# backend/app/schemas/class_schedule.py

from pydantic import BaseModel
from datetime import datetime
from typing import List

# --- Schemas para representar datos relacionados de forma segura y simplificada ---

class UserInfo(BaseModel):
    """Schema público para la información del usuario/entrenador."""
    id: int
    full_name: str

    class Config:
        from_attributes = True

class BookingInfo(BaseModel):
    """Schema simplificado para la información de una reserva."""
    member_id: int
    class_id: int

    class Config:
        from_attributes = True


# --- Schemas principales para ClassSchedule ---

class ClassScheduleCreate(BaseModel):
    """Schema para recibir datos al crear una clase."""
    name: str
    trainer_id: int
    date_time: datetime
    duration_minutes: int
    max_capacity: int

class ClassScheduleInDB(BaseModel):
    """
    Schema completo para devolver datos de una clase desde la API.
    """
    id: int
    name: str
    date_time: datetime
    duration_minutes: int
    max_capacity: int
    trainer: UserInfo                # Usamos el schema seguro UserInfo
    bookings: List[BookingInfo] = [] # Añadimos la lista de reservas (bookings)

    class Config:
        from_attributes = True