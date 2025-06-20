from sqlalchemy import Column, String, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from .base import BaseModel

class User(BaseModel):
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)  # Nullable for OAuth users
    full_name = Column(String(255), nullable=True)
    role = Column(String(20), default='company', nullable=False)  # contractor, company, admin
    avatar_data = Column(Text, nullable=True)  # Base64 encoded image
    avatar_mimetype = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    oauth_provider = Column(String(50), nullable=True)  # 'google', 'github', null for email
    oauth_id = Column(String(255), nullable=True)