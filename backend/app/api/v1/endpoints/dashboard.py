from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
# --- CORRECCIÓN CLAVE AQUÍ ---
from datetime import datetime, timedelta

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.payment import Payment, PaymentStatus
from app.models.class_schedule import ClassSchedule
from app.api.v1.deps import get_current_admin_user

router = APIRouter()

@router.get("/")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Calcula y devuelve todas las métricas para el panel de administración.
    """
    # 1. Miembros Totales
    total_members = db.query(User).filter(User.role == UserRole.member).count()

    # 2. Nuevos Miembros (últimos 30 días)
    one_month_ago = datetime.utcnow() - timedelta(days=30)
    new_members = db.query(User).filter(
        User.role == UserRole.member,
        User.registration_date >= one_month_ago
    ).count()

    # 3. Ingresos de este Mes
    current_month = datetime.utcnow().month
    current_year = datetime.utcnow().year
    monthly_income = db.query(func.sum(Payment.amount)).filter(
        Payment.status == PaymentStatus.completed,
        extract('month', Payment.date) == current_month,
        extract('year', Payment.date) == current_year
    ).scalar() or 0.0

    # 4. Clases Programadas (para el futuro)
    scheduled_classes = db.query(ClassSchedule).filter(
        ClassSchedule.date_time >= datetime.utcnow()
    ).count()
    
    # 5. Listas de Actividad Reciente
    recent_payments = db.query(Payment).order_by(Payment.date.desc()).limit(5).all()
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
