from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base import Base

class UserRole(str, enum.Enum):
    admin = "admin"
    trainer = "trainer"
    member = "member"

class MembershipStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    expired = "expired"
    pending = "pending"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    profile_picture_url = Column(String, nullable=True) # Para guardar la URL de la foto
    role = Column(SQLAlchemyEnum(UserRole), nullable=False, default=UserRole.member)
    membership_status = Column(SQLAlchemyEnum(MembershipStatus), default=MembershipStatus.inactive)
    membership_start = Column(DateTime, nullable=True)
    membership_end = Column(DateTime, nullable=True)
    registration_date = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    payments = relationship("Payment", back_populates="user")
    bookings = relationship("ClassBooking", back_populates="member")
    trained_classes = relationship("ClassSchedule", back_populates="trainer")  # Añadir esta relación