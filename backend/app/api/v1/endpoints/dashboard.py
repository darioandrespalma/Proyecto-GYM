# backend/app/api/v1/endpoints/dashboard.py (SOLUCIÓN FINAL)

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from typing import List


# --- 1. IMPORTACIÓN AÑADIDA ---
# Se necesita para definir los modelos de respuesta
from pydantic import BaseModel

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.payment import Payment, PaymentStatus
from app.models.class_schedule import ClassSchedule
from app.api.v1.deps import get_current_admin_user

# --- 2. IMPORTACIONES DE SCHEMAS CORREGIDAS ---
# Ahora importamos los schemas que SÍ existen en tus archivos
from app.schemas.payment import PaymentInDB
from app.schemas.user import User as UserSchema

# --- 3. MODELOS DE RESPUESTA AJUSTADOS ---
# Definimos la estructura de la respuesta de la API usando los schemas correctos

class RecentActivityResponse(BaseModel):
    # La lista de pagos debe ser del tipo del schema que tenemos: PaymentInDB
    payments: List[PaymentInDB]
    members: List[UserSchema]

class StatsResponse(BaseModel):
    totalMembers: int
    newMembers: int
    monthlyIncome: str
    scheduledClasses: int

class DashboardResponse(BaseModel):
    stats: StatsResponse
    recentActivity: RecentActivityResponse

router = APIRouter()

# El response_model ahora usa la estructura correcta que definimos arriba
@router.get("/", response_model=DashboardResponse)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Calcula y devuelve todas las métricas para el panel de administración.
    """
    # --- LA LÓGICA DE CÁLCULO SE MANTIENE, YA ERA CORRECTA ---
    total_members = db.query(User).filter(User.role == UserRole.member).count()
    one_month_ago = datetime.utcnow() - timedelta(days=30)
    new_members = db.query(User).filter(
        User.role == UserRole.member, User.registration_date >= one_month_ago
    ).count()
    current_month = datetime.utcnow().month
    current_year = datetime.utcnow().year
    monthly_income = db.query(func.sum(Payment.amount)).filter(
        Payment.status == PaymentStatus.completed,
        extract('month', Payment.created_at) == current_month,
        extract('year', Payment.created_at) == current_year
    ).scalar() or 0.0
    scheduled_classes = db.query(ClassSchedule).filter(
        ClassSchedule.date_time >= datetime.utcnow()
    ).count()
    
    recent_payments = db.query(Payment).order_by(Payment.created_at.desc()).limit(5).all()
    recent_members = db.query(User).filter(User.role == UserRole.member).order_by(User.registration_date.desc()).limit(5).all()

    return {
        "stats": {
            "totalMembers": total_members,
            "newMembers": new_members,
            "monthlyIncome": f"{monthly_income:.2f}",
            "scheduledClasses": scheduled_classes,
        },
        "recentActivity": {
            "payments": recent_payments,
            "members": recent_members,
        }
    }