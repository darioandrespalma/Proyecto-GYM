from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Schema para información del entrenador
class UserInfo(BaseModel):
    id: int
    full_name: str

    class Config:
        from_attributes = True

# Schema para información básica de reserva
class BookingInfo(BaseModel):
    member_id: int
    class_id: int

    class Config:
        from_attributes = True

# Schema para crear una clase
class ClassScheduleCreate(BaseModel):
    name: str
    trainer_id: int
    date_time: datetime
    duration_minutes: int
    max_capacity: int

# Schema para clase en base de datos
class ClassScheduleInDB(BaseModel):
    id: int
    name: str
    date_time: datetime
    duration_minutes: int
    max_capacity: int
    trainer: UserInfo
    bookings: List[BookingInfo] = []

    class Config:
        from_attributes = True

# NUEVO: Schema para clases disponibles con información enriquecida
class AvailableClass(BaseModel):
    id: int
    name: str
    date_time: datetime
    duration_minutes: int
    max_capacity: int
    available_slots: int
    trainer_name: str
    is_booked: bool = False

    class Config:
        from_attributes = True