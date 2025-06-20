import os
import subprocess
import sys
from pathlib import Path

def run_command(command, description):
    print(f"\\n>>> {description}")
    print(f"Running: {command}")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        if e.stderr:
            print(f"Error output: {e.stderr}")
        return False

def create_directory_structure():
    directories = [
        "app",
        "app/api",
        "app/api/v1", 
        "app/core",
        "app/models",
        "app/schemas",
        "app/services",
        "app/utils",
        "alembic",
        "alembic/versions",
        "tests",
        "tests/api",
        "tests/services"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        # Create __init__.py files
        init_file = Path(directory) / "__init__.py"
        if not init_file.exists() and directory.startswith("app"):
            init_file.touch()
    
    print("✅ Directory structure created")

def setup_virtual_environment():

    if not run_command("python -m venv venv", "Creating virtual environment"):
        return False
    
    # Activation command varies by OS
    if os.name == 'nt':  # Windows
        activate_cmd = "venv\\\\Scripts\\\\activate"
        pip_cmd = "venv\\\\Scripts\\\\pip"
    else:  # Unix/Linux/MacOS
        activate_cmd = "source venv/bin/activate"
        pip_cmd = "venv/bin/pip"
    
    print(f"✅ Virtual environment created. Activate with: {activate_cmd}")
    return True

def install_dependencies():

    pip_cmd = "venv/bin/pip" if os.name != 'nt' else "venv\\\\Scripts\\\\pip"
    
    dependencies = [
        "fastapi==0.104.1",
        "uvicorn[standard]==0.24.0",
        "sqlalchemy==2.0.23",
        "alembic==1.13.0",
        "psycopg2-binary==2.9.9",
        "bcrypt==4.1.1",
        "argon2-cffi==23.1.0",
        "authlib==1.2.1",
        "python-jose[cryptography]==3.3.0",
        "python-multipart==0.0.6",
        "redis==5.0.1",
        "python-dotenv==1.0.0",
        "pydantic[email]==2.5.0",
        "pydantic-settings==2.1.0",
        "httpx==0.25.2",
        "pytest==7.4.3",
        "pytest-asyncio==0.21.1"
    ]
    
    for dep in dependencies:
        if not run_command(f"{pip_cmd} install {dep}", f"Installing {dep}"):
            return False
    
    print("✅ Dependencies installed")
    return True

def create_env_file():
    env_content = '''# Database
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# Authentication  
SECRET_KEY=your-super-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Redis (optional for sessions)
REDIS_URL=redis://localhost:6379

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,pdf,doc,docx

# Environment
ENVIRONMENT=development
DEBUG=True
'''
    
    env_file = Path(".env")
    if not env_file.exists():
        env_file.write_text(env_content)
        print("✅ .env file created")
    else:
        print("⚠️  .env file already exists")

def setup_alembic():
    if not Path("alembic.ini").exists():
        if not run_command("alembic init alembic", "Initializing Alembic"):
            return False
        print("✅ Alembic initialized")
    else:
        print("⚠️  Alembic already initialized")
    
    return True

def main():

    print("🚀 Setting up ContractorHub project...")
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    
    print(f"✅ Python {sys.version.split()[0]} detected")
    
    # Create directory structure
    create_directory_structure()
    
    # Setup virtual environment
    setup_virtual_environment()
    
    # Install dependencies
    install_dependencies()
    
    # Create .env file
    create_env_file()
    
    # Setup Alembic
    setup_alembic()
    
    print("\\n🎉 Project setup complete!")
    print("\\nNext steps:")
    print("1. Activate virtual environment:")
    if os.name == 'nt':
        print("   venv\\\\Scripts\\\\activate")
    else:
        print("   source venv/bin/activate")
    
    print("2. Update .env file with your database credentials")
    print("3. Run initial migration:")
    print("   alembic upgrade head")
    print("4. Start the development server:")
    print("   uvicorn app.main:app --reload")
    print("5. Visit http://localhost:8000/docs for API documentation")

if __name__ == "__main__":
    main()
