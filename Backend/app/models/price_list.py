from sqlalchemy import Column, String, Text, Boolean, TIMESTAMP, DECIMAL, ForeignKey, UniqueConstraint,DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import uuid
from datetime import datetime

class PriceList(BaseModel):
    __tablename__ = "price_lists"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    currency = Column(String(3), default="USD")
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), onupdate=datetime.utcnow)

    items = relationship("PriceListItem", back_populates="price_list", cascade="all, delete")


class PriceListItem(BaseModel):
    __tablename__ = "price_list_items"
    __table_args__ = (UniqueConstraint('price_list_id', 'product_id', name='uq_price_list_product'),)

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    price_list_id = Column(UUID(as_uuid=True), ForeignKey("price_lists.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    price = Column(DECIMAL(10, 4), nullable=True)
    discount_percentage = Column(DECIMAL(5, 2), nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    price_list = relationship("PriceList", back_populates="items")
    # You can also add: product = relationship("Product")
