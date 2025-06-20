from sqlalchemy.orm import Session
from typing import Optional, Tuple
from datetime import datetime, timedelta
from app.models.user import User
from app.models.session import UserSession
from app.schemas.auth import LoginRequest, TokenPayload
from app.core.security import verify_password, create_access_token, generate_session_token
from .user_service import UserService
import uuid

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_service = UserService(db)
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user = self.user_service.get_user_by_email(email)
        if not user or not user.is_active:
            return None
        
        if not user.password_hash:  # OAuth user trying to login with password
            return None
        
        if not verify_password(password, user.password_hash):
            return None
        
        return user
    
    def create_user_session(self, user: User, ip_address: str = None, user_agent: str = None) -> Tuple[str, UserSession]:
        """Create user session"""
        session_token = generate_session_token()
        expires_at = datetime.utcnow() + timedelta(minutes=1440)  # 24 hours
        
        session = UserSession(
            user_id=user.id,
            session_token=session_token,
            expires_at=expires_at,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        
        return session_token, session
    
    def create_access_token_for_user(self, user: User) -> str:
        """Create JWT access token for user"""
        token_data = TokenPayload(
            sub=str(user.id),
            email=user.email,
            role=user.role
        )
        
        return create_access_token(token_data.dict())
    
    def get_session_by_token(self, session_token: str) -> Optional[UserSession]:
        """Get session by token"""
        session = self.db.query(UserSession).filter(
            UserSession.session_token == session_token,
            UserSession.expires_at > datetime.utcnow()
        ).first()
        
        if session:
            # Update last accessed
            session.last_accessed = datetime.utcnow()
            self.db.commit()
        
        return session
    
    def logout_user(self, session_token: str) -> bool:
        """Logout user by invalidating session"""
        session = self.db.query(UserSession).filter(
            UserSession.session_token == session_token
        ).first()
        
        if session:
            self.db.delete(session)
            self.db.commit()
            return True
        
        return False
    
    def logout_all_sessions(self, user_id: uuid.UUID) -> int:
        """Logout user from all sessions"""
        deleted_count = self.db.query(UserSession).filter(
            UserSession.user_id == user_id
        ).delete()
        
        self.db.commit()
        return deleted_count
    
    def cleanup_expired_sessions(self) -> int:
        """Clean up expired sessions"""
        deleted_count = self.db.query(UserSession).filter(
            UserSession.expires_at < datetime.utcnow()
        ).delete()
        
        self.db.commit()
        return deleted_count