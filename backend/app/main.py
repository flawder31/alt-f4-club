import os
import jwt
from fastapi import FastAPI, Depends, HTTPException, Path, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel, validator
from passlib.context import CryptContext
from jwt.exceptions import PyJWTError
import pytz

from .database import engine, get_db, SessionLocal
from .models import Base, User, Seat, Type, Booking, Status, Role

Base.metadata.create_all(bind=engine)

SECRET_KEY = "secret-keyyy" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

security = HTTPBearer()

app = FastAPI(title="Моё приложение")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserRegisterRequest(BaseModel):
    phone: str
    name: str
    password: str
    
    @validator('phone')
    def validate_phone(cls, v):
        if not v or len(v) < 10:
            raise ValueError('Телефон должен содержать 11 символов')
        return v

class UserLoginRequest(BaseModel):
    phone: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    phone: str
    name: str
    role_id: int
    balance: int

class BalanceResponse(BaseModel):
    balance: int

class DepositRequest(BaseModel):
    amount: int

class DepositResponse(BaseModel):
    new_balance: int
    message: str

class SeatResponse(BaseModel):
    id: int
    number: int
    type: str

class BookingCalculateRequest(BaseModel):
    seat_id: int
    start_time: str
    end_time: str

    @validator('start_time', 'end_time')
    def validate_datetime_format(cls, v):
        """Валидация формата даты и времени"""
        try:
            datetime.strptime(v, '%Y-%m-%d %H:%M')
            return v
        except ValueError:
            raise ValueError('Неверный формат даты. Ожидается: ГГГГ-ММ-ДД ЧЧ:ММ (например: 2024-01-15 10:30)')
    
    def get_start_datetime(self) -> datetime:
        return datetime.strptime(self.start_time, '%Y-%m-%d %H:%M')
    
    def get_end_datetime(self) -> datetime:
        return datetime.strptime(self.end_time, '%Y-%m-%d %H:%M')

class BookingCalculateResponse(BaseModel):
    seat_id: int
    seat_number: int
    seat_type: str
    start_time: str
    end_time: str
    price_per_hour: int
    total_price: int

class BookingCreateRequest(BaseModel):
    seat_id: int
    start_time: str
    end_time: str

class BookingResponse(BaseModel):
    id: int
    user_phone: str
    seat_number: int
    seat_type: str
    start_time: str
    end_time: str
    price: int

class AdminBookingResponse(BaseModel):
    id: int
    user_phone: str
    user_name: str
    seat_number: int
    seat_type: str
    start_time: str
    end_time: str
    price: int
    status: str

def verify_password(plain_password, hashed_password):
    """Проверка пароля"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Хеширование пароля"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Создание JWT токена"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Получает текущего пользователя из JWT токена"""
    token = credentials.credentials
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        phone: str = payload.get("sub")
        
        if phone is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Недействительный токен",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    except PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный токен",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(User).filter(User.phone == phone).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

def get_current_admin(current_user: User = Depends(get_current_user)):
    """
    Проверить, что текущий пользователь является администратором
    """
    if current_user.role_id != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен. Требуются права администратора"
        )
    return current_user

def update_expired_bookings(db: Session):
    """
    Обновляет статус бронирований, у которых истекло время завершения
    """
    try:
        completed_status = db.query(Status).filter(Status.name == "Завершено").first()

        moscow_tz = pytz.timezone('Europe/Moscow')
        current_time = datetime.now(moscow_tz)

        expired_bookings = db.query(Booking).filter(
            Booking.end_time < current_time,
            Booking.status_id != completed_status.id
        ).all()
        
        for booking in expired_bookings:
            booking.status_id = completed_status.id
        
        if expired_bookings:
            db.commit()
            
    except Exception as e:
        db.rollback()
        print(f"Ошибка при обновлении статусов: {str(e)}")

@app.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserRegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Регистрация нового пользователя
    """
    existing_user = db.query(User).filter(User.phone == user_data.phone).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с таким номером телефона уже существует"
        )
    
    hashed_password = get_password_hash(user_data.password)
    
    new_user = User(
        phone=user_data.phone,
        name=user_data.name,
		role_id=2,
        password=hashed_password,
        balance=0,  
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(
        data={
            "sub": new_user.phone,
            "name": new_user.name,
            "role_id": new_user.role_id
        }
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "phone": new_user.phone,
            "name": new_user.name,
            "role_id": new_user.role_id,
			"balance": new_user.balance
        }
    }

@app.post("/auth/login", response_model=TokenResponse)
def login(
    login_data: UserLoginRequest,
    db: Session = Depends(get_db)
):
    """
    Вход в систему
    """
    user = db.query(User).filter(User.phone == login_data.phone).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный номер телефона или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный номер телефона или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={
            "sub": user.phone,
            "name": user.name,
            "role_id": user.role_id
        }
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "phone": user.phone,
            "name": user.name,
			"role_id": user.role_id,
            "balance": user.balance
        }
    }

@app.get("/auth/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Получить информацию о текущем пользователе
    """
    return {
        "phone": current_user.phone,
        "name": current_user.name,
        "role_id": current_user.role_id,
        "balance": current_user.balance
    }

@app.post("/auth/logout")
def logout():
    """
    Выход из системы (на стороне клиента нужно удалить токен)
    """
    return {"message": "Выход выполнен успешно"}

# Защищенные эндпоинты
@app.get("/balance", response_model=BalanceResponse)
def get_balance(
    current_user: User = Depends(get_current_user)
):
    """
    Получить баланс текущего пользователя
    """
    return {
        "balance": current_user.balance
    }

@app.post("/balance/deposit", response_model=DepositResponse)
def deposit_balance(
    deposit: DepositRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Пополнить свой счет
    """
    if deposit.amount <= 0:
        raise HTTPException(status_code=400, detail="Сумма должна быть положительной")
    
    current_user.balance += deposit.amount
    db.commit()
    
    return {
        "new_balance": current_user.balance,
        "message": f"Счет пополнен на {deposit.amount} рублей"
    }

@app.get("/seats", response_model=List[SeatResponse])
def get_all_seats(db: Session = Depends(get_db)):
    """
    Получить список всех мест
    """
    try:
        seats = db.query(Seat).all()
        seats_list = []
        for seat in seats:
            seats_list.append({
                "id": seat.id,
                "number": seat.number,
                "type": seat.type.name
            })
        return seats_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка базы данных: {str(e)}")

@app.get("/seats/available", response_model=List[SeatResponse])
def get_available_seats(
    start_time: Optional[str] = None, 
    end_time: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    """
    Получить список свободных мест
    """
    try:
        query = db.query(Seat)
        
        if start_time and end_time:
            busy_bookings = db.query(Booking).filter(

                Booking.start_time < end_time,
                Booking.end_time > start_time
            ).all()
            
            busy_seat_ids = [booking.seat_id for booking in busy_bookings]
            
            if busy_seat_ids:
                query = query.filter(Seat.id.notin_(busy_seat_ids))
        
        seats = query.all()
        seats_list = []
        for seat in seats:
            seats_list.append({
                "id": seat.id,
                "number": seat.number,
                "type": seat.type.name
            })
        return seats_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка базы данных: {str(e)}")

@app.post("/bookings", response_model=BookingResponse)
def create_booking(
    booking: BookingCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Создать новое бронирование
    """
    try:
        seat = db.query(Seat).filter(Seat.id == booking.seat_id).first()
        if not seat:
            raise HTTPException(status_code=404, detail="Место не найдено")
        
        try:
            start = datetime.strptime(booking.start_time, '%Y-%m-%d %H:%M')
            end = datetime.strptime(booking.end_time, '%Y-%m-%d %H:%M')

            if end <= start:
                raise HTTPException(
                    status_code=400, 
                    detail="Время окончания должно быть позже времени начала"
                )
            
        except ValueError:
            raise HTTPException(
                status_code=400, 
                detail="Неверный формат даты. Используйте формат: ГГГГ-ММ-ДД ЧЧ:ММ"
            )
        
        existing_booking = db.query(Booking).filter(
            Booking.seat_id == booking.seat_id,
            Booking.status_id == 1,
            Booking.start_time < booking.end_time,
            Booking.end_time > booking.start_time
        ).first()
        
        if existing_booking:
            raise HTTPException(
                status_code=400, 
                detail=f"Это место уже занято в указанное время. "
                       f"Выберите другое время или место."
            )
        
        price_per_hour = seat.type.price_per_hour
        hours = (end - start).total_seconds() / 3600
        total_price = hours * price_per_hour

        if current_user.role_id == 1:
            total_price = 0
        
        if current_user.balance < total_price:
            raise HTTPException(
                status_code=400, 
                detail=f"Недостаточно средств на балансе. "
                       f"Требуется: {round(total_price, 2)} руб., "
                       f"доступно: {current_user.balance} руб."
            )
        
        try:
            new_booking = Booking(
                user_id=current_user.id,
                seat_id=booking.seat_id,
                start_time=booking.start_time,
                end_time=booking.end_time,
                price=total_price,
                status_id=1
            )
            
            db.add(new_booking)
            
            current_user.balance -= total_price
            db.add(current_user)
            
            db.commit()
            
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500, 
                detail=f"Ошибка при создании бронирования: {str(e)}"
            )
        
        db.refresh(new_booking)
        
        return {
            "id": new_booking.id,
            "user_phone": current_user.phone,
            "seat_number": seat.number,
            "seat_type": seat.type.name,
            "start_time": booking.start_time,
            "end_time": booking.end_time,
            "price": int(new_booking.price)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка базы данных: {str(e)}")

@app.get("/my-bookings")
def get_my_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Получить все бронирования текущего пользователя
    """
    update_expired_bookings(db)

    bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()
    bookings_list = []

    for booking in bookings:
        bookings_list.append({
            "id": booking.id,
            "seat_number": booking.seat.number,
            "seat_type": booking.seat.type.name,
            "start_time": booking.start_time,
            "end_time": booking.end_time,
            "price": float(booking.price),
            "status": booking.status.name
        })
    
    return {"bookings": bookings_list}

@app.get("/my-bookings/nearest")
def get_nearest_booking(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Получить ближайшую бронь текущего пользователя
    """
    update_expired_bookings(db)

    moscow_tz = pytz.timezone('Europe/Moscow')
    now = datetime.now(moscow_tz)
    now_str = now.strftime('%Y-%m-%d %H:%M')

    nearest_booking = db.query(Booking).filter(
        Booking.user_id == current_user.id,
        Booking.start_time >= now_str
    ).order_by(
        Booking.start_time.asc()
    ).first()
    
    if not nearest_booking:
        return {"message": "У вас пока нет броней"}
    
    start_time = datetime.strptime(nearest_booking.start_time, '%Y-%m-%d %H:%M')
    end_time = datetime.strptime(nearest_booking.end_time, '%Y-%m-%d %H:%M')
    
    return {
        "id": nearest_booking.id,
        "seat_number": nearest_booking.seat.number if nearest_booking.seat else None,
        "start_time": start_time.strftime('%d.%m.%Y %H:%M'),
        "end_time": end_time.strftime('%d.%m.%Y %H:%M'),
        "price": float(nearest_booking.price),
        "status": nearest_booking.status.name if nearest_booking.status else "Неизвестно"
    }

# Админские эндпоинты
@app.get("/admin/bookings", response_model=List[AdminBookingResponse])
def get_all_bookings(
    status: Optional[str] = None,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Получить список всех бронирований
    """
    
    update_expired_bookings(db)

    try:
        query = db.query(Booking)
        
        if status:
            status_obj = db.query(Status).filter(Status.name == status).first()
            if status_obj:
                query = query.filter(Booking.status_id == status_obj.id)
        
        bookings = query.all()
        bookings_list = []
        
        for booking in bookings:
            booking_response = AdminBookingResponse(
                id=booking.id,
                user_phone=booking.user.phone,
                user_name=booking.user.name,
                seat_number=booking.seat.number,
                seat_type=booking.seat.type.name,
                start_time=booking.start_time,
                end_time=booking.end_time,
                price=int(booking.price),
                status=booking.status.name
            )
            bookings_list.append(booking_response)
        
        return bookings_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка базы данных: {str(e)}")

@app.post("/admin/bookings/{id}/complete")
def complete_booking(
    id: int = Path(..., description="ID бронирования"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Завершить сессию бронирования досрочно
    """
    try:
        booking = db.query(Booking).filter(Booking.id == id).first()
        if not booking:
            raise HTTPException(
                status_code=404, 
                detail=f"Бронирование с id {id} не найдено"
            )
        
        active_status = db.query(Status).filter(Status.name == "Активно").first()
        if booking.status_id != active_status.id:
            raise HTTPException(
                status_code=400,
                detail=f"Бронирование уже {booking.status.name if booking.status else 'завершено'}"
            )

        now = datetime.now() + timedelta(hours=3)
        
        start_time = datetime.fromisoformat(booking.start_time)
        
        if now < start_time:
            raise HTTPException(
                status_code=400,
                detail="Нельзя завершить бронирование, которое еще не началось"
            )
        
        completed_status = db.query(Status).filter(Status.name == "Завершено").first()
        if not completed_status:
            completed_status = Status(name="Завершено")
            db.add(completed_status)
            db.flush()
        
        booking.status_id = completed_status.id
        booking.end_time = now.strftime('%Y-%m-%d %H:%M')
        
        db.commit()
        
        return {
            "message": f"Бронирование {id} успешно завершено",
            "booking_id": id,
            "status": "Завершено",
            "booking_details": {
                "start_time": booking.start_time,
                "new_end_time": booking.end_time
            }
        }
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка базы данных: {str(e)}")

@app.get("/users", response_model=dict)
def get_all_users(db: Session = Depends(get_db)):
    """
    Возвращает всех пользователей (без паролей)
    """
    try:
        users = db.query(User).all()
        users_list = [
            {
                "phone": user.phone,
                "name": user.name,
                "role_id": user.role_id,
                "balance": user.balance
            }
            for user in users
        ]
        return {
            "count": len(users_list),
            "users": users_list
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка базы данных: {str(e)}")

@app.get("/")
def root():
    """
    Возвращает статус бэка
    """
    return {"message": "Hello from FastAPI backend!"}