from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class ClassSchedule(Base):
    __tablename__ = "class_schedules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    trainer_id = Column(Integer, ForeignKey("users.id"))
    date_time = Column(DateTime)
    duration_minutes = Column(Integer)
    max_capacity = Column(Integer)
    
    trainer = relationship("User")
    bookings = relationship("ClassBooking", back_populates="class_schedule")