from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from decimal import Decimal

class TaxGroupBase(BaseModel):
    name: str
    rate: Decimal = Field(..., decimal_places=2, ge=Decimal("0"), le=Decimal("100"))
    is_compound: Optional[bool] = False
    is_active: Optional[bool] = True

class TaxGroupCreate(TaxGroupBase):
    pass

class TaxGroupUpdate(BaseModel):
    name: Optional[str] = None
    rate: Optional[Decimal] = Field(None, decimal_places=2, ge=Decimal("0"), le=Decimal("100"))
    is_compound: Optional[bool] = None
    is_active: Optional[bool] = None

class TaxGroupOut(TaxGroupBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class ProductTaxBase(BaseModel):
    product_id: UUID
    tax_group_id: UUID

class ProductTaxOut(ProductTaxBase):
    id: UUID
    created_at: datetime
    tax_group: TaxGroupOut

    class Config:
        from_attributes = True
