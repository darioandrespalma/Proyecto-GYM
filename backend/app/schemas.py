from pydantic import BaseModel, EmailStr

class PaymentCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    plan: str
    payment_method: str

class PaymentResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    plan: str
    payment_method: str
    amount: float

    class Config:
        orm_mode = True
