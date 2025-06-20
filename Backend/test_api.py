#!/usr/bin/env python3
"""
Python script to test ContractorHub API
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_registration():
    """Test user registration"""
    print("🔑 Testing user registration...")
    
    user_data = {
        "email": "pythontest@example.com",
        "password": "testpassword123",
        "full_name": "Python Test User",
        "role": "company",
        "phone": "+1234567890"
    }
    
    response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=user_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_login():
    """Test user login"""
    print("\n🔐 Testing user login...")
    
    login_data = {
        "email": "pythontest@example.com", 
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/api/v1/auth/login", json=login_data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Token: {data['access_token'][:20]}...")
        print(f"User: {data['user']['full_name']}")
        return data["access_token"]
    else:
        print(f"Error: {response.json()}")
        return None

def test_protected_endpoint(token):
    """Test protected endpoint"""
    print("\n👤 Testing protected endpoint...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/v1/auth/me", headers=headers)
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        user = response.json()
        print(f"Current user: {user['full_name']} ({user['email']})")
    else:
        print(f"Error: {response.json()}")

def test_profile_update(token):
    """Test profile update"""
    print("\n✏️ Testing profile update...")
    
    headers = {"Authorization": f"Bearer {token}"}
    update_data = {
        "full_name": "Updated Python Test User",
        "phone": "+1987654321"
    }
    
    response = requests.put(f"{BASE_URL}/api/v1/users/profile", 
                           headers=headers, json=update_data)
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        user = response.json()
        print(f"Updated user: {user['full_name']} - {user['phone']}")
    else:
        print(f"Error: {response.json()}")

def main():
    """Run all tests"""
    print("🧪 Testing ContractorHub API with Python")
    print("=" * 50)
    
    # Test registration (might fail if user exists)
    test_registration()
    
    # Test login
    token = test_login()
    if not token:
        print("❌ Login failed, cannot continue")
        return
    
    # Test protected endpoints
    test_protected_endpoint(token)
    test_profile_update(token)
    
    print("\n🎉 Python API testing complete!")

if __name__ == "__main__":
    main()
