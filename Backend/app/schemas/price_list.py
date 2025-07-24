from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from decimal import Decimal


class PriceListBase(BaseModel):
    name: str
    description: Optional[str] = None
    currency: Optional[str] = "USD"
    is_active: Optional[bool] = True


class PriceListCreate(PriceListBase):
    pass


class PriceListUpdate(PriceListBase):
    name: Optional[str] = None


class PriceListOut(PriceListBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Price List Item
class PriceListItemBase(BaseModel):
    price: Optional[Decimal] = None
    discount_percentage: Optional[Decimal] = None


class PriceListItemCreate(PriceListItemBase):
    product_id: UUID


class PriceListItemOut(PriceListItemBase):
    id: UUID
    product_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
