from pydantic import BaseModel, Field, ConfigDict,condecimal,UUID4,field_serializer,field_validator,computed_field
from typing import Optional,List,Literal,Annotated
from uuid import UUID
from decimal import Decimal
from datetime import datetime,date
from enum import Enum
from app.schemas.customer import CustomerOut

                ###################      Products   #####################

# --- Shared fields used in both Create & Update ---
class ProductBase(BaseModel):
    name: str
    sku: str
    barcode: Optional[str] = None
    category_name: str 
    brand: Optional[str] = None
    unit: Optional[str] = None  # sqft, pcs, etc.
    current_stock: Optional[Decimal] = 0
    min_stock_level: Optional[Decimal] = 0
    reorder_point: Optional[Decimal] = 0
    max_stock_level: Optional[Decimal] = None
    cost_price: Optional[Decimal] = None
    selling_price: Optional[Decimal] = None
    description: Optional[str] = None
    weight: Optional[Decimal] = None
    dimensions: Optional[str] = None
    is_active: Optional[bool] = True
    track_serial: Optional[bool] = False
    track_batch: Optional[bool] = False
    is_composite: Optional[bool] = False

# --- Create schema ---
class ProductCreate(ProductBase):
    pass

# --- Update schema ---
class ProductUpdate(ProductBase):
    name: Optional[str] = None
    sku: Optional[str] = None

class CategoryOut(BaseModel):
    id: UUID
    name: str

    class Config:
        model_config = ConfigDict(from_attributes=True)

# --- Output schema ---
class ProductOut(ProductBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    category: CategoryOut

    class Config:
        model_config = ConfigDict(from_attributes=True)

# --- Bulk update schema ---
class ProductBulkUpdate(BaseModel):
    products: List[dict]  # List of product updates with id and fields to update

# --- Category response schema ---
# app/schemas/inventory.py or wherever your schema is


               ###################     Supplier    #####################
# --- Shared Base ---
class SupplierBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

    payment_terms: Optional[int] = 30

# --- Create Schema ---
class SupplierCreate(SupplierBase):
    pass

# --- Update Schema ---
class SupplierUpdate(SupplierBase):
    pass

# --- Output Schema ---
class SupplierOut(SupplierBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

#######################################  product-supplier   ############################################

# --- Base Schema ---
class ProductSupplierBase(BaseModel):
    product_id: UUID
    supplier_id: UUID
    supplier_price: Optional[Decimal] = Field(default=None, decimal_places=4, ge=0)
    lead_time_days: Optional[int] = None
    min_order_qty: Optional[Decimal] = Field(default=None, decimal_places=2, ge=0)
    is_preferred: Optional[bool] = False

# --- Create ---
class ProductSupplierCreate(ProductSupplierBase):
    pass

# --- Update ---
class ProductSupplierUpdate(BaseModel):
    supplier_price: Optional[Decimal] = Field(default=None, decimal_places=4, ge=0)
    lead_time_days: Optional[int] = None
    min_order_qty: Optional[Decimal] = Field(default=None, decimal_places=2, ge=0)
    is_preferred: Optional[bool] = None

# --- Output ---
class ProductSupplierOut(ProductSupplierBase):
    id: UUID
    created_at: datetime

    class Config:
        model_config = ConfigDict(from_attributes=True)


 ################### Warehouse ###################

class WarehouseBase(BaseModel):
    name: str
    code: str
    address: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = True

class WarehouseCreate(WarehouseBase):
    pass

class WarehouseUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    address: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None

class WarehouseOut(WarehouseBase):
    id: UUID
    created_at: datetime

    class Config:
        model_config = ConfigDict(from_attributes=True)


################### Warehouse Transfer ###################

class TransferStatus(str, Enum):
    pending = "pending"
    in_transit = "in_transit"
    completed = "completed"

class WarehouseTransferItemCreate(BaseModel):
    product_id: UUID
    quantity: Annotated[Decimal, Field(max_digits=10, decimal_places=2)]

class WarehouseTransferItemOut(WarehouseTransferItemCreate):
    id: UUID
    received_quantity: Decimal
    created_at: datetime

    class Config:
        model_config = ConfigDict(from_attributes=True)

class WarehouseTransferCreate(BaseModel):
    transfer_number: str
    from_warehouse_id: UUID
    to_warehouse_id: UUID
    transfer_date: Optional[date] = None
    status: Optional[TransferStatus] = TransferStatus.pending
    notes: Optional[str] = None
    created_by: UUID
    items: List[WarehouseTransferItemCreate]

class WarehouseTransferOut(BaseModel):
    id: UUID
    transfer_number: str
    from_warehouse_id: UUID
    to_warehouse_id: UUID
    transfer_date: date
    status: TransferStatus
    notes: Optional[str]
    created_by: UUID
    created_at: datetime
    items: List[WarehouseTransferItemOut]

    class Config:
        model_config = ConfigDict(from_attributes=True)
############### Warehouse Stock ########################
class WarehouseStockBase(BaseModel):
    product_id: UUID
    warehouse_id: UUID
    quantity: Annotated[Decimal, Field(max_digits=10, decimal_places=2)]
    reserved_quantity: Annotated[Decimal, Field(max_digits=10, decimal_places=2)]
    available_quantity: Annotated[Decimal, Field(max_digits=10, decimal_places=2)]
    bin_location: Optional[str] = None

class WarehouseStockCreate(WarehouseStockBase):
    pass

class WarehouseStockUpdate(WarehouseStockBase):
    product_id: Optional[UUID] = None
    warehouse_id: Optional[UUID] = None
    quantity: Optional[Decimal] = None
    reserved_quantity: Optional[Decimal] = None
    available_quantity: Optional[Decimal] = None  # Usually computed
    bin_location: Optional[str] = None

class WarehouseStockOut(WarehouseStockBase):
    id: UUID
    available_quantity: Annotated[Decimal, Field(max_digits=10, decimal_places=2)]
    updated_at: datetime

    class Config:
        from_attributes = True

#############     sale Items     ##############
# --- Enum for payment status (used in frontend dropdowns) ---
class PaymentStatus(str, Enum):
    unpaid = "unpaid"
    partial = "partial"
    paid = "paid"


# --- SaleItem Schemas ---
class SaleItemBase(BaseModel):
    product_id: UUID
    quantity: int
    unit_price: float
    discount: Optional[float] = 0.0
    tax: Optional[float] = 0.0
    total_price: float | None = None  # Optional to allow validator to compute

class SaleItemCreate(SaleItemBase):
    @field_validator("total_price", mode="before")
    @classmethod
    def calculate_total(cls, v, values):
        if v is not None:
            return v
        try:
            qty = values["quantity"]
            price = values["unit_price"]
            tax = values.get("tax", 0)
            discount = values.get("discount", 0)

            base = qty * price
            tax_amt = base * (tax / 100)
            discount_amt = base * (discount / 100)
            return round(base + tax_amt - discount_amt, 2)
        except KeyError:
            raise ValueError("Missing fields for total_price calculation")

class SaleItemUpdate(BaseModel):
    id: Optional[UUID] = None  # Include this if updating existing items
    product_id: Optional[UUID] = None
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    discount: Optional[float] = None
    tax: Optional[float] = None
    total_price: Optional[float] = None

class SaleItemOut(SaleItemBase):
    id: UUID
    sale_id: UUID

    class Config:
        from_attributes = True

#############     sale      ##############
# --- Sale Schemas ---
class SaleBase(BaseModel):
    sale_number: str
    customer_id: Optional[UUID] = None  
    warehouse_id: Optional[UUID] = None 
    price_list_id: Optional[UUID] = None
    sale_date: Optional[date] = None
    due_date: Optional[date] = None
    status: Optional[str] = "completed"
    payment_status: PaymentStatus = PaymentStatus.unpaid
    subtotal: Optional[float] = 0.0
    tax_amount: Optional[float] = 0.0
    discount_amount: Optional[float] = 0.0
    paid_amount: Optional[float] = 0.0
    total_amount: float
    shipping_address: Optional[str] = None
    notes: Optional[str] = None
    created_by: Optional[UUID] = None


class SaleCreate(SaleBase):
    items: List[SaleItemCreate]

class SaleUpdate(BaseModel):
    sale_number: Optional[str] = None
    sale_date: Optional[date] = None
    total_amount: Optional[float] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    customer_id: Optional[UUID] = None
    warehouse_id: Optional[UUID] = None
    subtotal: Optional[Decimal] = None
    tax_amount: Optional[Decimal] = None
    discount_amount: Optional[Decimal] = None
    paid_amount: Optional[Decimal] = None
    due_date: Optional[date] = None
    discount_amount: Optional[float] = None
    shipping_address: Optional[str] = None
    created_by: Optional[UUID] = None
    items: Optional[List[SaleItemCreate]] = None


class SaleOut(BaseModel):
    id: UUID
    sale_number: str
    customer_id: Optional[UUID] = None
    #customer_name: Optional[str] = None  # Derived via serializer
    sale_date: date
    due_date: Optional[date] = None
    subtotal: Optional[Decimal] = None
    tax_amount: Optional[Decimal] = None
    discount_amount: Optional[Decimal] = None
    total_amount: Optional[Decimal] = None
    paid_amount: Optional[Decimal] = None
    status: str
    payment_status: str
    shipping_address: Optional[str] = None
    created_by: Optional[UUID] = None
    #overdue_days: Optional[int] = None  # Derived via serializer
    shipped_at: Optional[datetime] = None
    customer: Optional[CustomerOut] = None  # or the related ORM model if using from_orm/from_attributes
    @computed_field
    @property
    def customer_name(self) -> Optional[str]:
     return self.customer.name if self.customer else None

    @computed_field
    @property
    def overdue_days(self) -> int:
        if self.due_date and self.due_date < date.today():
            return (date.today() - self.due_date).days
        return 0

    
    model_config = ConfigDict(from_attributes=True)

class GroupedSalesSummary(BaseModel):
    label: str  # e.g. "2025-07-18", "2025-W29", "2025-07"
    total_sales: int
    total_revenue: float


class MonthlySalesSummary(BaseModel):
    year: int
    month: int
    total_sales: int
    total_revenue: float

          #############    Purchase order Items    ##############
class PurchaseOrderItemBase(BaseModel):
    product_id: UUID
    quantity: Decimal = Field(..., ge=0)
    unit_price: Decimal = Field(..., decimal_places=4, ge=0)
    line_total: Decimal = Field(..., decimal_places=2, ge=0)
    received_qty: Optional[Decimal] = Field(default=0, ge=0)

class PurchaseOrderItemCreate(PurchaseOrderItemBase):
    pass

class PurchaseOrderItemOut(PurchaseOrderItemBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


          #############    Purchase order   ##############

class PurchaseOrderBase(BaseModel):
    supplier_id: UUID
    po_number: Optional[str] = None
    order_date: Optional[date] = None
    status: Optional[str] = "pending"

class PurchaseOrderCreate(PurchaseOrderBase):
    total_amount: Decimal = Field(..., decimal_places=2, ge=0)
    items: List[PurchaseOrderItemCreate]

class PurchaseOrderUpdate(BaseModel):
    supplier_id: Optional[UUID] = None
    po_number: Optional[str] = None
    order_date: Optional[date] = None
    status: Optional[str] = None
    total_amount: Optional[Decimal] = None
    items: Optional[List[PurchaseOrderItemCreate]] = None


class PurchaseOrderOut(PurchaseOrderBase):
    id: UUID
    total_amount: Decimal
    created_at: datetime
    items: List[PurchaseOrderItemOut]

    class Config:
        from_attributes = True

                ########  Inventory Transactions ############
class InventoryTransactionCreate(BaseModel):
    product_id: UUID
    transaction_type: Literal["inbound", "outbound"]
    quantity: Annotated[Decimal, condecimal(gt=0, max_digits=10, decimal_places=2)]
    reference_type: Optional[str] = None
    reference_id: Optional[UUID] = None
    notes: Optional[str] = None


class InventoryTransactionOut(BaseModel):
    id: UUID
    product_id: UUID
    transaction_type: str
    quantity: Decimal
    reference_type: Optional[str]
    reference_id: Optional[UUID]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

