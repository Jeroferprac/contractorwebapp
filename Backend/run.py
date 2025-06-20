import subprocess
import sys
import os
from pathlib import Path

def check_environment():
    # Check if .env exists
    if not Path(".env").exists():
        print("❌ .env file not found. Run setup.py first.")
        return False
    
    # Check if virtual environment exists
    venv_path = Path("venv")
    if not venv_path.exists():
        print("❌ Virtual environment not found. Run setup.py first.")
        return False
    
    # Check if app directory exists
    if not Path("app").exists():
        print("❌ App directory not found. Run setup.py first.")
        return False
    
    return True

def run_migrations():
    print("🔄 Running database migrations...")
    try:
        subprocess.run(["alembic", "upgrade", "head"], check=True)
        print("✅ Migrations completed")
        return True
    except subprocess.CalledProcessError:
        print("❌ Migration failed")
        return False
    except FileNotFoundError:
        print("❌ Alembic not found. Make sure dependencies are installed.")
        return False

def start_server(reload=True, host="0.0.0.0", port=8000):
    print(f"🚀 Starting server on {host}:{port}")
    
    cmd = ["uvicorn", "app.main:app", "--host", host, "--port", str(port)]
    if reload:
        cmd.append("--reload")
    
    try:
        subprocess.run(cmd)
    except KeyboardInterrupt:
        print("\\n🛑 Server stopped")
    except FileNotFoundError:
        print("❌ uvicorn not found. Make sure dependencies are installed.")

def main():
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "setup":
            # Run setup
            subprocess.run([sys.executable, "setup.py"])
            return
        elif command == "migrate":
            # Run only migrations
            if check_environment():
                run_migrations()
            return
        elif command == "shell":
            # Start Python shell with app context
            print("🐍 Starting Python shell...")
            subprocess.run([sys.executable, "-c", "from app.main import app; import IPython; IPython.embed()"])
            return
    
    # Default: run development server
    if not check_environment():
        print("\\nRun 'python run.py setup' to set up the project first.")
        return
    
    # Run migrations first
    run_migrations()
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()