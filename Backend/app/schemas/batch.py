from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import date, datetime
from decimal import Decimal


# Shared fields (for both Create & Update)
class BatchBase(BaseModel):
    product_id: UUID
    warehouse_id: UUID
    batch_number: str
    manufacturing_date: Optional[date] = None
    expiry_date: Optional[date] = None
    quantity: Decimal
    available_quantity: Decimal


# Create
class BatchCreate(BatchBase):
    pass


# Update
class BatchUpdate(BaseModel):
    manufacturing_date: Optional[date] = None
    expiry_date: Optional[date] = None
    quantity: Optional[Decimal] = None
    available_quantity: Optional[Decimal] = None


# Read
class BatchOut(BatchBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
