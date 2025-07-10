from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID
from decimal import Decimal
from datetime import datetime

                ###################      Products   #####################

# --- Shared fields used in both Create & Update ---
class ProductBase(BaseModel):
    name: str
    sku: str
    category: Optional[str] = None
    brand: Optional[str] = None
    unit: Optional[str] = None  # sqft, pcs, etc.
    current_stock: Optional[Decimal] = 0
    min_stock_level: Optional[Decimal] = 0
    cost_price: Optional[Decimal] = None
    selling_price: Optional[Decimal] = None
    description: Optional[str] = None

# --- Create schema ---
class ProductCreate(ProductBase):
    pass

# --- Update schema ---
class ProductUpdate(ProductBase):
    pass

# --- Output schema ---
class ProductOut(ProductBase):
    id: UUID
    created_at: datetime

    class Config:
        model_config = ConfigDict(from_attributes=True)

               ###################     Supplier    #####################

# --- Shared Base ---
class SupplierBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    payment_terms: Optional[int] = 30

# --- Create Schema ---
class SupplierCreate(SupplierBase):
    pass

# --- Update Schema ---
class SupplierUpdate(SupplierBase):
    pass

# --- Output Schema ---
class SupplierOut(SupplierBase):
    id: UUID
    created_at: datetime

    class Config:
        model_config = ConfigDict(from_attributes=True)
