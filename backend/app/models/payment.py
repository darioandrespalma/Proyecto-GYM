from sqlalchemy import Column, Integer, String, Float, DateTime, Enum as SQLAlchemyEnum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base import Base

class PaymentStatus(enum.Enum):
    pending = "pending"
    completed = "completed"
    rejected = "rejected"

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    membership_type = Column(String) # e.g., "Premium", "VIP"
    amount = Column(Float)
    payment_method = Column(String) # "credit_card", "bank_transfer"
    status = Column(SQLAlchemyEnum(PaymentStatus), default=PaymentStatus.pending)
    transaction_id = Column(String, unique=True, index=True)
    date = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="payments")