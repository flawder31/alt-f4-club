from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role_id = Column(Integer, ForeignKey('roles.id'), nullable=False)
    password = Column(String(255), nullable=False)
    balance = Column(Integer, default=0)
    
    role = relationship("Role", back_populates="users")
    bookings = relationship("Booking", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, name='{self.name}')>"

class Role(Base):
    __tablename__ = 'roles'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    
    users = relationship("User", back_populates="role")
    
    def __repr__(self):
        return f"<Role(id={self.id}, name='{self.name}')>"

class Seat(Base):
    __tablename__ = 'seats'
    
    id = Column(Integer, primary_key=True)
    number = Column(Integer, nullable=False)
    type_id = Column(Integer, ForeignKey('types.id'), nullable=False)
    
    type = relationship("Type", back_populates="seats")
    bookings = relationship("Booking", back_populates="seat")
    
    def __repr__(self):
        return f"<Seat(id={self.id}, number='{self.number}')>"

class Type(Base):
    __tablename__ = 'types'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    price_per_hour = Column(Integer, default=0)
    
    seats = relationship("Seat", back_populates="type")
    
    def __repr__(self):
        return f"<Type(id={self.id}, name='{self.name}')>"

class Booking(Base):
    __tablename__ = 'bookings'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    seat_id = Column(Integer, ForeignKey('seats.id'), nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    status_id = Column(Integer, ForeignKey('statuses.id'), nullable=False)
    
    user = relationship("User", back_populates="bookings")
    seat = relationship("Seat", back_populates="bookings")
    status = relationship("Status", back_populates="bookings")
    
    def __repr__(self):
        return f"<Booking(id={self.id}, user_id={self.user_id})>"

class Status(Base):
    __tablename__ = 'statuses'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    
    bookings = relationship("Booking", back_populates="status")
    
    def __repr__(self):
        return f"<Status(id={self.id}, name='{self.name}')>"