import enum
from sqlalchemy import Column, String, Text, Boolean, Enum as SQLEnum
from sqlalchemy.orm import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from .base import BaseModel

Base = declarative_base()

class RoleEnum(str, enum.Enum):
    contractor = "contractor"
    company = "company"
    admin = "admin"

class User(Base):
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    full_name = Column(String(255), nullable=True)
    
    role = Column(
        SQLEnum(
            RoleEnum,
            name="role_enum",
            native_enum=False,
            create_constraint=True,
            validate_strings=True
        ),
        default=RoleEnum.company,
        nullable=False
    )
    
    avatar_data = Column(Text, nullable=True)
    avatar_mimetype = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    oauth_provider = Column(String(50), nullable=True)
    oauth_id = Column(String(255), nullable=True)
