from sqlalchemy import Column, String, DECIMAL, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import sqlalchemy as sa

from app.models.base import BaseModel
from app.models.inventory import Product

class TaxGroup(BaseModel):
    __tablename__ = "tax_groups"

    id = Column(UUID(as_uuid=True), primary_key=True,
                server_default=sa.text("gen_random_uuid()"))
    name = Column(String(100), nullable=False)
    rate = Column(DECIMAL(5, 2), nullable=False)
    is_compound = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=sa.text("now()"))

    product_taxes = relationship("ProductTax", back_populates="tax_group", cascade="all, delete")


class ProductTax(BaseModel):
    __tablename__ = "product_taxes"

    id = Column(UUID(as_uuid=True), primary_key=True,
                server_default=sa.text("gen_random_uuid()"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    tax_group_id = Column(UUID(as_uuid=True), ForeignKey("tax_groups.id"), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=sa.text("now()"))

    tax_group = relationship("TaxGroup", back_populates="product_taxes")
    product = relationship("Product", back_populates="tax_groups")
