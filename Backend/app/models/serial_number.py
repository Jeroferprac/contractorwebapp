from sqlalchemy import Column, String, ForeignKey, DateTime, UUID
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.models.base import BaseModel

class SerialNumber(BaseModel):
    __tablename__ = "serial_numbers"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(PG_UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    warehouse_id = Column(PG_UUID(as_uuid=True), ForeignKey("warehouses.id"), nullable=False)
    serial_number = Column(String(100), unique=True, nullable=False)
    status = Column(String(20), default="available")  # available, sold, reserved
    sale_id = Column(PG_UUID(as_uuid=True), ForeignKey("sales.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Optional: Relationships
    product = relationship("Product")
    warehouse = relationship("Warehouse")
    sale = relationship("Sale", backref="serials")
