from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from typing import Dict, Any, Optional
from app.core.config import settings
from .user_service import UserService

class OAuthService:
    def __init__(self):
        config = Config()
        self.oauth = OAuth(config)
        
        # Google OAuth
        if settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET:
            self.oauth.register(
                name='google',
                client_id=settings.GOOGLE_CLIENT_ID,
                client_secret=settings.GOOGLE_CLIENT_SECRET,
                server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
                client_kwargs={
                    'scope': 'openid email profile'
                }
            )
        
        # GitHub OAuth
        if settings.GITHUB_CLIENT_ID and settings.GITHUB_CLIENT_SECRET:
            self.oauth.register(
                name='github',
                client_id=settings.GITHUB_CLIENT_ID,
                client_secret=settings.GITHUB_CLIENT_SECRET,
                access_token_url='https://github.com/login/oauth/access_token',
                authorize_url='https://github.com/login/oauth/authorize',
                api_base_url='https://api.github.com/',
                client_kwargs={'scope': 'user:email'},
            )
    
    def get_authorization_url(self, provider: str, redirect_uri: str) -> str:
        """Get OAuth authorization URL"""
        client = getattr(self.oauth, provider)
        return client.authorize_redirect_uri(redirect_uri)
    
    async def get_user_info(self, provider: str, code: str, redirect_uri: str) -> Optional[Dict[str, Any]]:
        """Get user info from OAuth provider"""
        try:
            client = getattr(self.oauth, provider)
            token = await client.authorize_access_token(code=code, redirect_uri=redirect_uri)
            
            if provider == 'google':
                user_info = token.get('userinfo')
                if user_info:
                    return {
                        'email': user_info.get('email'),
                        'name': user_info.get('name'),
                        'provider_id': user_info.get('sub'),
                        'provider': 'google'
                    }
            
            elif provider == 'github':
                # Get user info from GitHub API
                resp = await client.get('user', token=token)
                user_data = resp.json()
                
                # Get primary email
                emails_resp = await client.get('user/emails', token=token)
                emails = emails_resp.json()
                primary_email = next((email['email'] for email in emails if email['primary']), None)
                
                return {
                    'email': primary_email or user_data.get('email'),
                    'name': user_data.get('name') or user_data.get('login'),
                    'provider_id': str(user_data.get('id')),
                    'provider': 'github'
                }
        
        except Exception as e:
            print(f"OAuth error for {provider}: {e}")
            return None
        
        return None
