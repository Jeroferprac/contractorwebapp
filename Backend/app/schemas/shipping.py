from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import date, datetime
from decimal import Decimal

class ShipmentBase(BaseModel):
    sale_id: UUID
    carrier_name: Optional[str] = None
    tracking_number: Optional[str] = None
    shipping_method: Optional[str] = None
    shipping_cost: Optional[Decimal] = Field(None, decimal_places=2, ge=0)
    weight: Optional[Decimal] = Field(None, decimal_places=2, ge=0)
    dimensions: Optional[str] = None
    shipped_date: Optional[date] = None
    delivered_date: Optional[date] = None 
    status: Optional[str] = "pending"

class ShipmentCreate(ShipmentBase):
    pass

class ShipmentUpdate(BaseModel):
    status: Optional[str] = None
    tracking_number: Optional[str] = None
    shipped_date: Optional[date] = None
    delivered_date: Optional[date] = None

class ShipmentOut(ShipmentBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
