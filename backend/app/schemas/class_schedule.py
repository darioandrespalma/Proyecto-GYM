from pydantic import BaseModel
from datetime import datetime
from .user import UserInDB
from typing import Optional

class ClassScheduleBase(BaseModel):
    name: str
    trainer_id: int
    date_time: datetime
    duration_minutes: int
    max_capacity: int

class ClassScheduleCreate(ClassScheduleBase):
    pass

class ClassScheduleInDB(ClassScheduleBase):
    id: int
    trainer: UserInDB

    class Config:
        orm_mode = True