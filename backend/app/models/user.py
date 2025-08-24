from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base import Base

class UserRole(enum.Enum):
    admin = "admin"
    trainer = "trainer"
    member = "member"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(SQLAlchemyEnum(UserRole), nullable=False, default=UserRole.member)
    membership_status = Column(String, default="inactive") # active, inactive
    registration_date = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    payments = relationship("Payment", back_populates="user")
    bookings = relationship("ClassBooking", back_populates="member")