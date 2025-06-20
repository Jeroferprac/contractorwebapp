from sqlalchemy.orm import Session
from typing import Optional
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password
import uuid

class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_user_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        """Get user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()
    
    def get_user_by_oauth(self, provider: str, oauth_id: str) -> Optional[User]:
        """Get user by OAuth provider and ID"""
        return self.db.query(User).filter(
            User.oauth_provider == provider,
            User.oauth_id == oauth_id
        ).first()
    
    def create_user(self, user_data: UserCreate) -> User:
        """Create new user"""
        hashed_password = hash_password(user_data.password)
        
        db_user = User(
            email=user_data.email,
            password_hash=hashed_password,
            full_name=user_data.full_name,
            phone=user_data.phone,
            role=user_data.role
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    
    def create_oauth_user(self, email: str, full_name: str, provider: str, oauth_id: str) -> User:
        """Create user from OAuth"""
        db_user = User(
            email=email,
            full_name=full_name,
            oauth_provider=provider,
            oauth_id=oauth_id,
            is_verified=True  # OAuth users are pre-verified
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    
    def update_user(self, user_id: uuid.UUID, user_data: UserUpdate) -> Optional[User]:
        """Update user"""
        db_user = self.get_user_by_id(user_id)
        if not db_user:
            return None
        
        update_data = user_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    
    def activate_user(self, user_id: uuid.UUID) -> bool:
        """Activate user account"""
        db_user = self.get_user_by_id(user_id)
        if db_user:
            db_user.is_active = True
            db_user.is_verified = True
            self.db.commit()
            return True
        return False
    
    def deactivate_user(self, user_id: uuid.UUID) -> bool:
        """Deactivate user account"""
        db_user = self.get_user_by_id(user_id)
        if db_user:
            db_user.is_active = False
            self.db.commit()
            return True
        return False