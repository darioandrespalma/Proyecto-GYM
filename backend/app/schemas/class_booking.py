# backend/app/schemas/class_booking.py (NUEVO ARCHIVO)

from pydantic import BaseModel

class ClassMember(BaseModel):
    id: int
    full_name: str

    class Config:
        orm_mode = True # Anteriormente `from_attributes = True` en Pydantic v2