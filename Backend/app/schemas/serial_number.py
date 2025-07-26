from pydantic import BaseModel, UUID4, Field
from typing import Optional
from datetime import datetime

# Shared fields
class SerialNumberBase(BaseModel):
    product_id: UUID4
    warehouse_id: UUID4
    serial_number: str = Field(..., max_length=100)
    status: Optional[str] = "available"  # available, sold, reserved
    sale_id: Optional[UUID4] = None

# For creating new serial numbers
class SerialNumberCreate(SerialNumberBase):
    pass

# For updating serial numbers
class SerialNumberUpdate(BaseModel):
    status: Optional[str] = None
    sale_id: Optional[UUID4] = None

# For response
class SerialNumberOut(SerialNumberBase):
    id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True

        
