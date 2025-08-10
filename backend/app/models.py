from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, index=True, nullable=False)
    phone = Column(String, nullable=False)
    plan = Column(String, index=True, nullable=False)
    payment_method = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
