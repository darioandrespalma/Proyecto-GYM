from pydantic import BaseModel
from datetime import datetime
from .user import UserInDB # Importamos el schema del usuario para anidarlo

# Schema para recibir datos al crear una clase
class ClassScheduleCreate(BaseModel):
    name: str
    trainer_id: int
    date_time: datetime
    duration_minutes: int
    max_capacity: int

# Schema para devolver datos de una clase desde la API
class ClassScheduleInDB(BaseModel):
    id: int
    name: str
    date_time: datetime
    duration_minutes: int
    max_capacity: int
    trainer: UserInDB # Devuelve el objeto completo del entrenador

    class Config:
        from_attributes = True
