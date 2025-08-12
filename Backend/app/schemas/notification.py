from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List, Optional

class NotificationOut(BaseModel):
    id: UUID
    type: str
    title: Optional[str] = None
    message: Optional[str] = None
    reference_id: Optional[UUID] = None
    reference_type: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationMarkRead(BaseModel):
    is_read: bool
