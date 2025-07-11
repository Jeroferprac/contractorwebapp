from pydantic import BaseModel, Field, ConfigDict,condecimal
from typing import Optional,List,Literal,Annotated
from uuid import UUID
from decimal import Decimal
from datetime import datetime,date

                ###################      Products   #####################

# --- Shared fields used in both Create & Update ---
class ProductBase(BaseModel):
    name: str
    sku: str
    category: Optional[str] = None
    brand: Optional[str] = None
    unit: Optional[str] = None  # sqft, pcs, etc.
    current_stock: Optional[Decimal] = 0
    min_stock_level: Optional[Decimal] = 0
    cost_price: Optional[Decimal] = None
    selling_price: Optional[Decimal] = None
    description: Optional[str] = None

# --- Create schema ---
class ProductCreate(ProductBase):
    pass

# --- Update schema ---
class ProductUpdate(ProductBase):
    pass

# --- Output schema ---
class ProductOut(ProductBase):
    id: UUID
    created_at: datetime

    class Config:
        model_config = ConfigDict(from_attributes=True)

               ###################     Supplier    #####################

# --- Shared Base ---
class SupplierBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
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

    class Config:
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

class PurchaseOrderUpdate(PurchaseOrderBase):
    status: Optional[str] = None

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

