from pydantic import BaseModel, Field, ConfigDict,condecimal,UUID4
from typing import Optional,List,Literal,Annotated
from uuid import UUID
from decimal import Decimal
from datetime import datetime,date
from enum import Enum

                ###################      Products   #####################

# --- Shared fields used in both Create & Update ---
class ProductBase(BaseModel):
    name: str
    sku: str
    barcode: Optional[str] = None
    category: Optional[str] = None
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

# --- Output schema ---
class ProductOut(ProductBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        model_config = ConfigDict(from_attributes=True)

# --- Bulk update schema ---
class ProductBulkUpdate(BaseModel):
    products: List[dict]  # List of product updates with id and fields to update

# --- Category response schema ---
class CategoryOut(BaseModel):
    category: str
    count: int

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

# --- SaleItem Schemas ---
class SaleItemBase(BaseModel):
    product_id: UUID
    quantity: Decimal = Field(..., ge=0)
    unit_price: Decimal = Field(..., decimal_places=4, ge=0)
    line_total: Decimal = Field(..., decimal_places=2, ge=0)

class SaleItemCreate(SaleItemBase):
    pass

class SaleItemOut(SaleItemBase):
    id: UUID
    created_at: datetime
    class Config:
        from_attributes = True

#############     sale      ##############
# --- Sale Schemas ---
class SaleBase(BaseModel):
    customer_name: Optional[str] = None
    sale_date: Optional[date] = None
    status: Optional[str] = "completed"
    notes: Optional[str] = None

class SaleCreate(SaleBase):
    total_amount: Decimal = Field(..., decimal_places=2, ge=0)
    items: List[SaleItemCreate]

class SaleOut(SaleBase):
    id: UUID
    total_amount: Decimal
    created_at: datetime
    items: List[SaleItemOut]

    class Config:
        from_attributes = True

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

