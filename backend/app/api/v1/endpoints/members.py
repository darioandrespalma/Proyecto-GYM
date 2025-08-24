from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.user import UserInDB, UserCreate, UserUpdate
from app.core.security import get_password_hash
from app.api.v1.deps import get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[UserInDB])
def read_members(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    members = db.query(User).filter(User.role == UserRole.member).all()
    return members

@router.post("/", response_model=UserInDB, status_code=201)
def create_member(member: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    db_user = db.query(User).filter(User.email == member.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(member.password)
    new_member = User(
        email=member.email,
        full_name=member.full_name,
        phone=member.phone,
        hashed_password=hashed_password,
        role=UserRole.member
    )
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member

@router.put("/{member_id}", response_model=UserInDB)
def update_member(member_id: int, member_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    db_member = db.query(User).filter(User.id == member_id, User.role == UserRole.member).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    update_data = member_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_member, key, value)

    db.commit()
    db.refresh(db_member)
    return db_member