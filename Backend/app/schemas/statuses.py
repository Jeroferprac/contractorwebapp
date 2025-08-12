from enum import Enum
from pydantic import BaseModel
from typing import List

class SerialStatus(str, Enum):
    available = "available"
    sold = "sold"
    reserved = "reserved"

class SalesStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"

class ShippingStatus(str, Enum):
    pending = "pending"
    shipped = "shipped"
    delivered = "delivered"
    returned = "returned"

class TransferStatus(str, Enum):
    pending = "pending"
    in_transit = "in_transit"
    completed = "completed"

class AllStatuses(BaseModel):
    serial: List[SerialStatus]
    sales: List[SalesStatus]
    shipping: List[ShippingStatus]
    transfer: List[TransferStatus]

