import os
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

from database import engine, get_db, SessionLocal
from models import Base, User, Seat, Type, Booking, Status, Role

INIT_ROLES = [
    {"name": "Админ"},
    {"name": "Пользователь"},
]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

INIT_USERS = [
    {"phone": "89998887766", "name": "Лариса", "role_id": 1, "password": "123", "balance": 100000},
    {"phone": "89008007060", "name": "Лера", "role_id": 1, "password": "321", "balance": 100000},
    {"phone": "89118117161", "name": "Рома", "role_id": 1, "password": "111", "balance": 100000},
    {"phone": "89228227262", "name": "Игорь", "role_id": 1, "password": "222", "balance": 100000},
]

INIT_TYPES = [
    {"name": "Standart", "price_per_hour": 100},
    {"name": "Vip", "price_per_hour": 200},
    {"name": "Pro", "price_per_hour": 300},
]

INIT_SEATS = [
    {"number": 1, "type_id": 1},
    {"number": 2, "type_id": 1},
    {"number": 3, "type_id": 1},
    {"number": 4, "type_id": 1},
    {"number": 5, "type_id": 1},
    {"number": 6, "type_id": 1},
    {"number": 7, "type_id": 1},
    {"number": 8, "type_id": 1},
    {"number": 9, "type_id": 1},
    {"number": 10, "type_id": 1},
    {"number": 11, "type_id": 1},
    {"number": 12, "type_id": 1},
    {"number": 13, "type_id": 1},
    {"number": 14, "type_id": 1},
    {"number": 15, "type_id": 1},
    {"number": 16, "type_id": 1},
    {"number": 17, "type_id": 1},
    {"number": 18, "type_id": 1},
    {"number": 19, "type_id": 1},
    {"number": 20, "type_id": 1},
    {"number": 1, "type_id": 2},
    {"number": 2, "type_id": 2},
    {"number": 3, "type_id": 2},
    {"number": 4, "type_id": 2},
    {"number": 5, "type_id": 2},
    {"number": 6, "type_id": 2},
    {"number": 7, "type_id": 2},
    {"number": 8, "type_id": 2},
    {"number": 9, "type_id": 2},
    {"number": 10, "type_id": 2},
    {"number": 1, "type_id": 3},
    {"number": 2, "type_id": 3},
    {"number": 3, "type_id": 3},
    {"number": 4, "type_id": 3},
    {"number": 5, "type_id": 3},
    {"number": 6, "type_id": 3},
]

INIT_STATUSES = [
    {"name": "Активно"},
    {"name": "Завершено"},  
]

def init_database():
    """Инициализирует базу данных и создаёт таблицы"""
    Base.metadata.create_all(bind=engine)
    print("✅ Таблицы созданы")
    db = SessionLocal()
    try:
        role_count = db.query(Role).count()
        if role_count == 0:
            roles = [Role(**role_data) for role_data in INIT_ROLES]
            db.add_all(roles)
            db.commit()
            print(f"✅ Добавлено ролей: {len(INIT_ROLES)}")

        user_count = db.query(User).count()
        if user_count == 0:
            users = []
            for user_data in INIT_USERS:
                # Создаем копию и хешируем пароль
                user_dict = user_data.copy()
                user_dict["password"] = pwd_context.hash(user_data["password"])
                users.append(User(**user_dict))

            db.add_all(users)
            db.commit()
            print(f"✅ Добавлено пользователей: {len(INIT_USERS)}") 

        type_count = db.query(Type).count()
        if type_count == 0:
            types = [Type(**type_data) for type_data in INIT_TYPES]
            db.add_all(types)
            db.commit()
            print(f"✅ Добавлено типов: {len(INIT_TYPES)}")  

        seat_count = db.query(Seat).count()  
        if seat_count == 0:
            seats = [Seat(**seat_data) for seat_data in INIT_SEATS]
            db.add_all(seats)
            db.commit()
            print(f"✅ Добавлено мест: {len(INIT_SEATS)}")

        status_count = db.query(Status).count()  
        if status_count == 0:
            statuses = [Status(**status_data) for status_data in INIT_STATUSES]
            db.add_all(statuses)
            db.commit()
            print(f"✅ Добавлено статусов: {len(INIT_STATUSES)}")  
            
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        db.rollback()
    finally:
        db.close()    

    return engine
    
def main():
    engine = init_database()

if __name__ == "__main__":
    main()