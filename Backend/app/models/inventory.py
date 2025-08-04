import uuid
from uuid import uuid4
import enum
from sqlalchemy import Column, String,Enum, Text, DECIMAL, TIMESTAMP, func, UniqueConstraint, Integer, ForeignKey, Boolean, Date,DateTime
from sqlalchemy.dialects.postgresql import UUID
from typing import Optional
from app.models.base import BaseModel
from sqlalchemy.orm import relationship

class Product(BaseModel):
    __tablename__ = "products"

    name = Column(String(255), nullable=False)
    sku = Column(String(50), nullable=False, unique=True)
    barcode = Column(String(100), unique=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"))
    brand = Column(String(100))
    unit = Column(String(20))  # e.g., sqft, pieces, lbs
    current_stock = Column(DECIMAL(10, 2), default=0)
    min_stock_level = Column(DECIMAL(10, 2), default=0)
    reorder_point = Column(DECIMAL(10, 2), default=0)
    max_stock_level = Column(DECIMAL(10, 2))
    cost_price = Column(DECIMAL(10, 4))
    selling_price = Column(DECIMAL(10, 4))
    description = Column(Text)
    weight = Column(DECIMAL(10, 2))
    dimensions = Column(String(50))
    is_active = Column(Boolean, default=True)
    track_serial = Column(Boolean, default=False)
    track_batch = Column(Boolean, default=False)
    is_composite = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    category = relationship("Category", back_populates="products")
    transactions = relationship("InventoryTransaction", back_populates="product")

    @property
    def category_name(self) -> Optional[str]:
        return self.category.name if self.category else None

# models/category.py
class Category(BaseModel):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String(100), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    products = relationship("Product", back_populates="category")
class Supplier(BaseModel):
    __tablename__ = "suppliers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String(255), nullable=False)
    contact_person = Column(String(100))
    email = Column(String(255))
    phone = Column(String(20))

    street = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    pincode = Column(String(20), nullable=True)

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
    # created_at = Column(TIMESTAMP, server_default=func.now())

    # Optional relationships
    product = relationship("Product", backref="supplier_links")
    supplier = relationship("Supplier", backref="product_links")


class Warehouse(BaseModel):
    __tablename__ = "warehouses"

    name = Column(String(255), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    address = Column(Text)
    contact_person = Column(String(100))
    phone = Column(String(20))
    email = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    transfers_from = relationship("WarehouseTransfer", back_populates="from_warehouse", foreign_keys="WarehouseTransfer.from_warehouse_id")
    transfers_to = relationship("WarehouseTransfer", back_populates="to_warehouse", foreign_keys="WarehouseTransfer.to_warehouse_id")


class WarehouseTransfer(BaseModel):
    __tablename__ = "warehouse_transfers"

    transfer_number = Column(String(50), unique=True, nullable=False)
    from_warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id"))
    to_warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id"))
    transfer_date = Column(Date, server_default=func.current_date())
    status = Column(String(20), default="pending")  # pending, in_transit, completed
    notes = Column(Text)
    created_by = Column(UUID(as_uuid=True))
    created_at = Column(TIMESTAMP, server_default=func.now())

    from_warehouse = relationship("Warehouse", foreign_keys=[from_warehouse_id], back_populates="transfers_from")
    to_warehouse = relationship("Warehouse", foreign_keys=[to_warehouse_id], back_populates="transfers_to")
    items = relationship("WarehouseTransferItem", back_populates="transfer")


class WarehouseTransferItem(BaseModel):
    __tablename__ = "warehouse_transfer_items"

    transfer_id = Column(UUID(as_uuid=True), ForeignKey("warehouse_transfers.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    quantity = Column(DECIMAL(10, 2))
    received_quantity = Column(DECIMAL(10, 2), default=0)
    created_at = Column(TIMESTAMP, server_default=func.now())

    transfer = relationship("WarehouseTransfer", back_populates="items")
    product = relationship("Product")

class WarehouseStock(BaseModel):
    __tablename__ = "warehouse_stock"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id"), nullable=False)
    quantity = Column(DECIMAL(10, 2), nullable=False, default=0)
    reserved_quantity = Column(DECIMAL(10, 2), nullable=False, default=0)
    available_quantity = Column(DECIMAL(10, 2), nullable=False)  # Set by trigger
    bin_location = Column(String(50), nullable=True)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime, server_default=func.now())
    __table_args__ = (
        UniqueConstraint("product_id", "warehouse_id", name="uix_product_warehouse"),
    )
    product = relationship("Product", backref="warehouse_stocks")
    warehouse = relationship("Warehouse", backref="stocks")

class PaymentStatusEnum(str, enum.Enum):
    unpaid = "unpaid"
    partial = "partial"
    paid = "paid"

class Sale(BaseModel):
    __tablename__ = "sales"

    # Existing fields
    customer_name = Column(String(255), nullable=True)
    sale_date = Column(Date, server_default=func.current_date())
    total_amount = Column(DECIMAL(12, 2), nullable=True)
    status = Column(String(20), default="completed")
    notes = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Newly added fields
    sale_number = Column(String(50), unique=True, nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=True)
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id"), nullable=True)
    due_date = Column(Date, nullable=True)
    subtotal = Column(DECIMAL(12, 2), nullable=True)
    tax_amount = Column(DECIMAL(12, 2), nullable=True)
    discount_amount = Column(DECIMAL(12, 2), nullable=True)
    paid_amount = Column(DECIMAL(12, 2), nullable=True, default=0)
    payment_status = Column(Enum(PaymentStatusEnum), default=PaymentStatusEnum.unpaid)
    shipping_address = Column(Text, nullable=True)
    created_by = Column(UUID(as_uuid=True), nullable=True)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    shipped_at = Column(TIMESTAMP, nullable=True)


    items = relationship("SaleItem", back_populates="sale", cascade="all, delete")
    customer = relationship("Customer", back_populates="sales", lazy="selectin")
    shipments = relationship('Shipment', back_populates='sale', cascade='all, delete')


class SaleItem(BaseModel):
    __tablename__ = "sale_items"

    sale_id = Column(UUID(as_uuid=True), ForeignKey("sales.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    quantity = Column(DECIMAL(10, 2))
    unit_price = Column(DECIMAL(10, 4))
    discount = Column(DECIMAL(5, 2), default=0.0)   
    tax = Column(DECIMAL(5, 2), default=0.0)       
    line_total = Column(DECIMAL(12, 2))             # total_price
    created_at = Column(TIMESTAMP, server_default=func.now())

    sale = relationship("Sale", back_populates="items")
    product = relationship("Product")


class PurchaseOrder(BaseModel):
    __tablename__ = "purchase_orders"

    supplier_id = Column(UUID(as_uuid=True), ForeignKey("suppliers.id"),nullable=False) 
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

class InventoryTransaction(BaseModel):
    __tablename__ = "inventory_transactions"

    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    transaction_type = Column(String(20), nullable=False)  # 'inbound' or 'outbound'
    quantity = Column(DECIMAL(10, 2), nullable=False)
    reference_type = Column(String(50))  # 'purchase_order', 'sale', 'adjustment'
    reference_id = Column(UUID(as_uuid=True))  # ID of the PO or Sale
    notes = Column(Text)

    product = relationship("Product", back_populates="transactions")
