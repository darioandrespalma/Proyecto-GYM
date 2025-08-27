# backend/app/models/class_booking.py

from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class ClassBooking(Base):
    __tablename__ = "class_bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Llave foránea que apunta al usuario que hizo la reserva
    member_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Llave foránea que apunta a la clase específica que fue reservada
    class_id = Column(Integer, ForeignKey("class_schedules.id"), nullable=False)
    
    booking_date = Column(DateTime, default=datetime.utcnow)
    
    # Estas relaciones conectan este modelo con los otros dos.
    # El 'back_populates' debe coincidir con el nombre de la relación en el otro modelo.
    member = relationship("User", back_populates="bookings")
    class_schedule = relationship("ClassSchedule", back_populates="bookings")