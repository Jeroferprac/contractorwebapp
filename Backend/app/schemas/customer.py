from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal

# Shared fields for both Create and Update
class CustomerBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    tax_id: Optional[str] = None
    payment_terms: Optional[int] = 30
    credit_limit: Optional[Decimal] = None
    price_list_id: Optional[UUID] = None
    is_active: Optional[bool] = True

# Schema for creating a new customer
class CustomerCreate(CustomerBase):
    pass

# Schema for updating an existing customer
class CustomerUpdate(CustomerBase):
    name: Optional[str] = None  # Allow partial update

# Schema for API output
class CustomerOut(CustomerBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True  # Needed for ORM mode in Pydantic v2
