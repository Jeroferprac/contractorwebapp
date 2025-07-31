from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, DECIMAL, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
from uuid import uuid4
from datetime import datetime

class Customer(BaseModel):
    __tablename__ = "customers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String(255), nullable=False)
    contact_person = Column(String(100), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    zip_code = Column(String(20), nullable=True)
    country = Column(String(100), nullable=True)
    tax_id = Column(String(50), nullable=True)
    payment_terms = Column(Integer, default=30)
    credit_limit = Column(DECIMAL(12, 2), nullable=True)
    price_list_id = Column(UUID(as_uuid=True), ForeignKey("price_lists.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=datetime.utcnow)

    sales = relationship("Sale", back_populates="customer")
