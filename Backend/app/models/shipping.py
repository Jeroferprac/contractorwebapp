from sqlalchemy import Column, String, ForeignKey, DECIMAL, Date, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import sqlalchemy as sa

from app.models.base import BaseModel
from app.models.inventory import Sale  # existing sales model

class Shipment(BaseModel):
    __tablename__ = 'shipments'

    id = Column(UUID(as_uuid=True), primary_key=True,
                server_default=sa.text('gen_random_uuid()'))
    sale_id = Column(UUID(as_uuid=True), ForeignKey('sales.id'), nullable=False)
    carrier_name = Column(String(100))
    tracking_number = Column(String(100))
    shipping_method = Column(String(50))
    shipping_cost = Column(DECIMAL(10, 2))
    weight = Column(DECIMAL(10, 2))
    dimensions = Column(String(50))
    shipped_date = Column(Date)
    delivered_date = Column(Date)
    status = Column(String(20), nullable=False, default='pending')
    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=sa.text('now()'))

    sale = relationship('Sale', back_populates='shipments')
