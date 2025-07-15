from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session,joinedload
from typing import Optional,List,Literal,Annotated
from uuid import UUID
from sqlalchemy import func,extract
from datetime import date,datetime
from pydantic import BaseModel, Field, ConfigDict,condecimal
from decimal import Decimal
from collections import defaultdict

from app.schemas.inventory import (ProductCreate, ProductOut, ProductUpdate, SupplierCreate, SupplierUpdate, SupplierOut,
                                   ProductSupplierCreate, ProductSupplierUpdate, ProductSupplierOut,SaleBase,SaleCreate,SaleItemBase,SaleOut,
                                    PurchaseOrderCreate, PurchaseOrderOut, PurchaseOrderUpdate,MonthlySalesSummary,  
                                    PurchaseOrderItemCreate, PurchaseOrderItemOut,InventoryTransactionCreate, InventoryTransactionOut)
from app.models.inventory import Product, Supplier, ProductSupplier,Sale,SaleItem,PurchaseOrderItem,PurchaseOrder,InventoryTransaction
from app.api.deps import get_db

router = APIRouter(prefix="/inventory", tags=["inventory"])

                      #############   Products API Calls  ########################
# GET /api/products - List all products
@router.get("/products", response_model=List[ProductOut])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

# POST /api/products - Create a new product
@router.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product_in.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# GET /api/products/low-stock - Get products below min stock
@router.get("/products/low-stock", response_model=List[ProductOut])
def low_stock_products(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.current_stock < Product.min_stock_level).all()

# GET /api/products/{id} - Get product by ID
@router.get("/products/{id}", response_model=ProductOut)
def get_product(id: UUID, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# PUT /api/products/{id} - Update product
@router.put("/products/{id}", response_model=ProductOut)
def update_product(id: UUID, product_in: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for key, value in product_in.dict(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product

# DELETE /api/products/{id} - Delete product
@router.delete("/products/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(id: UUID, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return

              
                  ##################   Supplier API Calls  ######################

# --- List all suppliers ---
@router.get("/suppliers", response_model=List[SupplierOut])
def list_suppliers(db: Session = Depends(get_db)):
    return db.query(Supplier).all()

# --- Create supplier ---
@router.post("/suppliers", response_model=SupplierOut, status_code=201)
def create_supplier(supplier_in: SupplierCreate, db: Session = Depends(get_db)):
    supplier = Supplier(**supplier_in.dict())
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier

# --- Get supplier by ID ---
@router.get("/suppliers/{id}", response_model=SupplierOut)
def get_supplier(id: UUID, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier

# --- Update supplier ---
@router.put("/suppliers/{id}", response_model=SupplierOut)
def update_supplier(id: UUID, supplier_in: SupplierUpdate, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    for key, value in supplier_in.dict(exclude_unset=True).items():
        setattr(supplier, key, value)
    
    db.commit()
    db.refresh(supplier)
    return supplier

# --- Delete supplier ---
@router.delete("/suppliers/{id}", status_code=204)
def delete_supplier(id: UUID, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    db.delete(supplier)
    db.commit()
    return

                 ##################   Product-Supplier API Calls  ######################
##Create ProductSupplier
@router.post("/product-suppliers", response_model=ProductSupplierOut, status_code=201)
def create_product_supplier(data: ProductSupplierCreate, db: Session = Depends(get_db)):
    entry = ProductSupplier(**data.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry
##List All ProductSuppliers
@router.get("/product-suppliers", response_model=List[ProductSupplierOut])
def list_product_suppliers(db: Session = Depends(get_db)):
    return db.query(ProductSupplier).all()
##Get One by ID
@router.get("/product-suppliers/{id}", response_model=ProductSupplierOut)
def get_product_supplier(id: UUID, db: Session = Depends(get_db)):
    entry = db.query(ProductSupplier).filter(ProductSupplier.id == id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="ProductSupplier not found")
    return entry
##Update by ID
@router.put("/product-suppliers/{id}", response_model=ProductSupplierOut)
def update_product_supplier(id: UUID, data: ProductSupplierUpdate, db: Session = Depends(get_db)):
    entry = db.query(ProductSupplier).filter(ProductSupplier.id == id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="ProductSupplier not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(entry, key, value)

    db.commit()
    db.refresh(entry)
    return entry
##Delete by ID
@router.delete("/product-suppliers/{id}", status_code=204)
def delete_product_supplier(id: UUID, db: Session = Depends(get_db)):
    entry = db.query(ProductSupplier).filter(ProductSupplier.id == id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="ProductSupplier not found")
    db.delete(entry)
    db.commit()

                ##################   Sales API Calls  ######################
## List All Sales
@router.get("/sales", response_model=List[SaleOut])
def list_sales(db: Session = Depends(get_db)):
    return db.query(Sale).options(joinedload(Sale.items)).all()

## Create a Sale (with items)
@router.post("/sales", response_model=SaleOut, status_code=201)
def create_sale(data: SaleCreate, db: Session = Depends(get_db)):
    sale = Sale(
        customer_name=data.customer_name,
        sale_date=data.sale_date or date.today(),
        total_amount=data.total_amount,
        status=data.status,
        notes=data.notes,
    )
    db.add(sale)
    db.flush()  # So we get sale.id

    # Add sale items
    for item in data.items:
        sale_item = SaleItem(
            sale_id=sale.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            line_total=item.line_total
        )
        db.add(sale_item)

    db.commit()
    db.refresh(sale)
    return sale

## Sales Summary (Basic Report)
@router.get("/sales/summary")
def sales_summary(db: Session = Depends(get_db)):
    total_sales = db.query(func.count(Sale.id)).scalar()
    total_revenue = db.query(func.coalesce(func.sum(Sale.total_amount), 0)).scalar()
    latest_sale = db.query(Sale).order_by(Sale.sale_date.desc()).first()

    return {
        "total_sales": total_sales,
        "total_revenue": float(total_revenue),
        "latest_sale": latest_sale.sale_date if latest_sale else None
    }

####Sales Summary Monthly basis
@router.get("/sales/summary/monthly", response_model=List[MonthlySalesSummary])
def monthly_sales_summary(db: Session = Depends(get_db)):
    results = (
        db.query(
            extract('year', Sale.sale_date).label('year'),
            extract('month', Sale.sale_date).label('month'),
            func.count(Sale.id).label('total_sales'),
            func.sum(Sale.total_amount).label('total_revenue')
        )
        .group_by('year', 'month')
        .order_by('year', 'month')
        .all()
    )

    return [
        MonthlySalesSummary(
            year=int(row.year),
            month=int(row.month),
            total_sales=row.total_sales,
            total_revenue=float(row.total_revenue or 0)
        )
        for row in results
    ]

## Get Sale by ID
@router.get("/sales/{id}", response_model=SaleOut)
def get_sale(id: UUID, db: Session = Depends(get_db)):
    sale = db.query(Sale).options(joinedload(Sale.items)).filter(Sale.id == id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale


## Update Sale (status, notes, etc.)
@router.put("/sales/{id}", response_model=SaleOut)
def update_sale(id: UUID, data: SaleBase, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.id == id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(sale, key, value)

    db.commit()
    db.refresh(sale)
    return sale


                    #############   purchase order API Calls  ########################

## Create Purchase Order
@router.post("/purchase-orders", response_model=PurchaseOrderOut, status_code=201)
def create_po(data: PurchaseOrderCreate, db: Session = Depends(get_db)):
    po = PurchaseOrder(
        supplier_id=data.supplier_id,
        po_number=data.po_number,
        order_date=data.order_date or date.today(),
        total_amount=data.total_amount,
        status=data.status,
    )
    db.add(po)
    db.flush()  # Get po.id

    for item in data.items:
        db.add(PurchaseOrderItem(
            po_id=po.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            line_total=item.line_total,
            received_qty=item.received_qty or 0
        ))

    db.commit()
    db.refresh(po)
    return po


## List Purchase Orders
@router.get("/purchase-orders", response_model=List[PurchaseOrderOut])
def list_purchase_orders(db: Session = Depends(get_db)):
    return db.query(PurchaseOrder).options(joinedload(PurchaseOrder.items)).all()

## Get PO by ID
@router.get("/purchase-orders/{id}", response_model=PurchaseOrderOut)
def get_po(id: UUID, db: Session = Depends(get_db)):
    po = db.query(PurchaseOrder).options(joinedload(PurchaseOrder.items)).filter(PurchaseOrder.id == id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase Order not found")
    return po


## Update PO status
@router.put("/purchase-orders/{id}", response_model=PurchaseOrderOut)
def update_po(id: UUID, data: PurchaseOrderUpdate, db: Session = Depends(get_db)):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase Order not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(po, key, value)

    db.commit()
    db.refresh(po)
    return po

# ✅ 1. GET /inventory - Current Stock Levels
@router.get("/", summary="Current stock levels")
def get_current_inventory(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return [
        {
            "product_id": p.id,
            "name": p.name,
            "sku": p.sku,
            "current_stock": p.current_stock,
            "min_stock_level": p.min_stock_level
        }
        for p in products
    ]

# ✅ 2. POST /inventory/adjust - Manual Stock Adjustment
class StockAdjustRequest(BaseModel):
    product_id: UUID
    transaction_type: Literal["inbound", "outbound"]
    quantity: Annotated[Decimal, condecimal(gt=0, max_digits=10, decimal_places=2)]
    notes: Optional[str] = None

@router.post("/adjust", response_model=InventoryTransactionOut, summary="Adjust stock level manually")
def adjust_inventory(
    data: StockAdjustRequest,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if data.transaction_type == "inbound":
        product.current_stock += data.quantity
    elif data.transaction_type == "outbound":
        if product.current_stock < data.quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        product.current_stock -= data.quantity

    txn = InventoryTransaction(
        product_id=data.product_id,
        transaction_type=data.transaction_type,
        quantity=data.quantity,
        reference_type="adjustment",
        reference_id=None,
        notes=data.notes
    )

    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn

# ✅ 3. GET /inventory/transactions - All Inventory Transactions
@router.get("/transactions", response_model=List[InventoryTransactionOut], summary="Inventory transaction history")
def get_transactions(db: Session = Depends(get_db)):
    return db.query(InventoryTransaction).order_by(InventoryTransaction.created_at.desc()).all()

# ✅ 4. GET /inventory/reports - Inventory Summary
@router.get("/reports", summary="Inventory summary report")
def inventory_report(db: Session = Depends(get_db)):
    total_products = db.query(Product).count()
    low_stock = db.query(Product).filter(Product.current_stock < Product.min_stock_level).count()
    total_inbound = db.query(InventoryTransaction).filter(InventoryTransaction.transaction_type == "inbound").count()
    total_outbound = db.query(InventoryTransaction).filter(InventoryTransaction.transaction_type == "outbound").count()

    return {
        "total_products": total_products,
        "low_stock_items": low_stock,
        "total_inbound_transactions": total_inbound,
        "total_outbound_transactions": total_outbound
    }




