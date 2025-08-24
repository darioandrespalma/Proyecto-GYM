from sqlalchemy.orm import Session
from app.models.user import User, UserRole

def get_users_by_role(db: Session, role: UserRole):
    return db.query(User).filter(User.role == role).all()