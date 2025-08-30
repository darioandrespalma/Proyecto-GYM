from pydantic import BaseModel
from datetime import datetime
from app.models.payment import PaymentStatus, PaymentMethod
from .user import UserInDB

class PaymentBase(BaseModel):
    membership_type: str
    amount: float
    payment_method: PaymentMethod

class PaymentCreate(PaymentBase):
    comprobante_url: str | None = None

class PaymentUpdate(BaseModel):
    status: PaymentStatus

class PaymentInDB(PaymentBase):
    id: int
    user_id: int
    status: PaymentStatus
    transaction_id: str | None
    comprobante_url: str | None
    created_at: datetime
    updated_at: datetime
    user: UserInDB

    class Config:
        orm_mode = True