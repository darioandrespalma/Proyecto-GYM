from sqlalchemy import Column, Integer, String, Float, Text
from app.db.base import Base

class Membership(Base):
    __tablename__ = "memberships"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    price = Column(Float, nullable=False)
    duration_days = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)

    # Nota para el futuro: 
    # Para una mejor integración, podrías modificar tu modelo 'Payment' 
    # para que en lugar de 'membership_type = Column(String)', 
    # uses 'membership_id = Column(Integer, ForeignKey("memberships.id"))'.
    # Esto crearía una relación formal entre las tablas.