import uuid
from sqlalchemy import Column, String, Text, DECIMAL, TIMESTAMP, func, UniqueConstraint, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import BaseModel

class Product(BaseModel):
    __tablename__ = "products"

    name = Column(String(255), nullable=False)
    sku = Column(String(50), nullable=False, unique=True)
    category = Column(String(100))
    brand = Column(String(100))
    unit = Column(String(20))  # e.g., sqft, pieces, lbs
    current_stock = Column(DECIMAL(10, 2), default=0)
    min_stock_level = Column(DECIMAL(10, 2), default=0)
    cost_price = Column(DECIMAL(10, 4))
    selling_price = Column(DECIMAL(10, 4))
    description = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
class Supplier(BaseModel):
    __tablename__ = "suppliers"

    name = Column(String(255), nullable=False)
    contact_person = Column(String(100))
    email = Column(String(255))
    phone = Column(String(20))
    address = Column(Text)
    payment_terms = Column(Integer, default=30)  # days
    created_at = Column(TIMESTAMP, server_default=func.now())