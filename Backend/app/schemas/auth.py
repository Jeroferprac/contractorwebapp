from pydantic import BaseModel, EmailStr
from typing import Optional
from .user import UserResponse, UserCreate  # Import UserResponse from user schemas

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class RegisterRequest(UserCreate):
    pass

class RegisterResponse(BaseModel):
    message: str
    user: UserResponse

class TokenPayload(BaseModel):
    sub: Optional[str] = None  # subject (user ID)
    email: Optional[str] = None
    role: Optional[str] = None

class OAuthRequest(BaseModel):
    provider: str  # 'google' or 'github'
    redirect_uri: str