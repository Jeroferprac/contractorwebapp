import uuid
from sqlalchemy import Column, String, Text, DECIMAL, TIMESTAMP, func, UniqueConstraint, Integer, ForeignKey, Boolean, Date
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import BaseModel
from sqlalchemy.orm import relationship

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

class ProductSupplier(BaseModel):
    __tablename__ = "product_suppliers"

    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    supplier_id = Column(UUID(as_uuid=True), ForeignKey("suppliers.id"), nullable=False)

    supplier_price = Column(DECIMAL(10, 4))
    lead_time_days = Column(Integer)
    min_order_qty = Column(DECIMAL(10, 2))
    is_preferred = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Optional relationships
    product = relationship("Product", backref="supplier_links")
    supplier = relationship("Supplier", backref="product_links")

class Sale(BaseModel):
    __tablename__ = "sales"

    customer_name = Column(String(255), nullable=True)
    sale_date = Column(Date, server_default=func.current_date())
    total_amount = Column(DECIMAL(12, 2), nullable=True)
    status = Column(String(20), default="completed")
    notes = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    items = relationship("SaleItem", back_populates="sale", cascade="all, delete")


class SaleItem(BaseModel):
    __tablename__ = "sale_items"

    sale_id = Column(UUID(as_uuid=True), ForeignKey("sales.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    quantity = Column(DECIMAL(10, 2))
    unit_price = Column(DECIMAL(10, 4))
    line_total = Column(DECIMAL(12, 2))
    created_at = Column(TIMESTAMP, server_default=func.now())

    sale = relationship("Sale", back_populates="items")
    product = relationship("Product")

class PurchaseOrder(BaseModel):
    __tablename__ = "purchase_orders"

    supplier_id = Column(UUID(as_uuid=True), ForeignKey("suppliers.id"), nullable=False)
    po_number = Column(String(50), unique=True)
    order_date = Column(Date, server_default=func.current_date())
    total_amount = Column(DECIMAL(12, 2), nullable=True)
    status = Column(String(20), default="pending")
    created_at = Column(TIMESTAMP, server_default=func.now())

    supplier = relationship("Supplier", backref="purchase_orders")
    items = relationship("PurchaseOrderItem", back_populates="purchase_order", cascade="all, delete")

class PurchaseOrderItem(BaseModel):
    __tablename__ = "purchase_order_items"

    po_id = Column(UUID(as_uuid=True), ForeignKey("purchase_orders.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    quantity = Column(DECIMAL(10, 2))
    unit_price = Column(DECIMAL(10, 4))
    line_total = Column(DECIMAL(12, 2))
    received_qty = Column(DECIMAL(10, 2), default=0)
    created_at = Column(TIMESTAMP, server_default=func.now())

    purchase_order = relationship("PurchaseOrder", back_populates="items")
    product = relationship("Product")
