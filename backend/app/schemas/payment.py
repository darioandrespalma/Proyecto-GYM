from pydantic import BaseModel
from datetime import datetime
from app.models.payment import PaymentStatus
from .user import UserInDB

class PaymentBase(BaseModel):
    user_id: int
    membership_type: str
    amount: float
    payment_method: str
    status: PaymentStatus

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdate(BaseModel):
    status: PaymentStatus

class PaymentInDB(PaymentBase):
    id: int
    transaction_id: str
    date: datetime
    user: UserInDB

    class Config:
        orm_mode = True