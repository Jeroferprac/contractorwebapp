from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth import LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, OAuthRequest
from app.schemas.user import UserResponse
from app.models.user import User,RoleEnum
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.services.oauth_service import OAuthService
from app.api.deps import get_current_active_user
from typing import Dict, Any
from typing import List
from pydantic import BaseModel

router = APIRouter()
class OAuthDirectCallback(BaseModel):
    provider: str
    user_info: Dict[str, str]  # expects email, name, provider_id, provider

@router.post("/register", response_model=RegisterResponse)
async def register(
    user_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    """Register new user"""
    user_service = UserService(db)
    
    # Check if user already exists
    existing_user = user_service.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    try:
        user = user_service.create_user(user_data)
        return RegisterResponse(
            message="User registered successfully",
            user=UserResponse.from_orm(user)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

@router.post("/login", response_model=LoginResponse)
async def login(
    login_data: LoginRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """Login user with email and password"""
    auth_service = AuthService(db)
    
    # Authenticate user
    user = auth_service.authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = auth_service.create_access_token_for_user(user)
    
    # Create session
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent")
    session_token, session = auth_service.create_user_session(user, client_ip, user_agent)
    
    return LoginResponse(
        access_token=access_token,
        user=UserResponse.from_orm(user)
    )

@router.post("/logout")
async def logout(
    session_token: str = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Logout user"""
    auth_service = AuthService(db)
    
    if session_token:
        success = auth_service.logout_user(session_token)
        if success:
            return {"message": "Logged out successfully"}
    
    # Fallback: logout all sessions for this user
    deleted_count = auth_service.logout_all_sessions(current_user.id)
    return {"message": f"Logged out from {deleted_count} sessions"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user information"""
    return UserResponse.from_orm(current_user)

@router.get("/roles", response_model=List[RoleEnum])
async def get_roles():
    """
    Return all possible role names.
    """
    return list(RoleEnum)

@router.get("/oauth/{provider}")
async def oauth_login(request: Request,provider: str, redirect_uri: str):
    """Initiate OAuth login"""
    if provider not in ['google', 'github']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported OAuth provider")
        
    
    oauth_service = OAuthService()
    try:
        auth_url = await oauth_service.get_authorization_url(request,provider, redirect_uri)
        print(auth_url)
        return {"auth_url": auth_url}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OAuth initialization failed: {str(e)}"
        )

# ✅ Updated endpoint to accept POST call from frontend after GitHub OAuth
@router.post("/oauth/github/callback", response_model=LoginResponse)
async def direct_oauth_callback(
    payload: OAuthDirectCallback,
    request: Request,
    db: Session = Depends(get_db)
):
    provider = payload.provider
    user_info = payload.user_info

    if provider != 'github':
        raise HTTPException(status_code=400, detail="Only GitHub provider supported here")

    user_service = UserService(db)
    auth_service = AuthService(db)

    # Extract user info
    provider_id = user_info.get("provider_id")
    email = user_info.get("email")
    name = user_info.get("name")

    if not provider_id or not email:
        raise HTTPException(status_code=400, detail="Missing required user info from GitHub")

    # Check if user already exists by OAuth ID
    user = user_service.get_user_by_oauth(provider, provider_id)

    if not user:
        # Check if user exists with same email
        user = user_service.get_user_by_email(email)
        if user:
            # Link OAuth account
            user.oauth_provider = provider
            user.oauth_id = provider_id
            db.commit()
        else:
            # Create new OAuth user
            user = user_service.create_oauth_user(
                email=email,
                full_name=name,
                provider=provider,
                oauth_id=provider_id
            )

    # Create token and session
    access_token = auth_service.create_access_token_for_user(user)
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent")
    session_token, session = auth_service.create_user_session(user, client_ip, user_agent)

    return LoginResponse(
        access_token=access_token,
        user=UserResponse.from_orm(user)
    )


@router.post("/refresh")
async def refresh_token(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Refresh access token"""
    auth_service = AuthService(db)
    access_token = auth_service.create_access_token_for_user(current_user)
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }