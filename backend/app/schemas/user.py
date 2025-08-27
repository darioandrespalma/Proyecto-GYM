from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.member

class User(UserBase):
    id: int
    role: UserRole
    membership_status: str

    # Configuración para Pydantic V2
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    membership_status: Optional[str] = None

class UserInDB(UserBase):
    id: int
    role: UserRole
    membership_status: str
    registration_date: datetime


    class Config:
        orm_mode = True