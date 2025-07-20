from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, extract, and_, or_
from typing import Optional, List, Literal, Annotated
from uuid import UUID
from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict, condecimal
from decimal import Decimal
from collections import defaultdict

from app.schemas.inventory import (
    ProductCreate, ProductOut, ProductUpdate, ProductBulkUpdate, CategoryOut,
    SupplierCreate, SupplierUpdate, SupplierOut,
    ProductSupplierCreate, ProductSupplierUpdate, ProductSupplierOut,
    WarehouseBase,WarehouseCreate,WarehouseOut,WarehouseTransferCreate,WarehouseStockCreate,WarehouseStockOut,
    WarehouseTransferItemOut,WarehouseTransferOut,WarehouseTransferItemCreate,WarehouseUpdate,TransferStatus,
    SaleBase, SaleCreate, SaleItemBase, SaleOut,
    PurchaseOrderCreate, PurchaseOrderOut, PurchaseOrderUpdate, MonthlySalesSummary,
    PurchaseOrderItemCreate, PurchaseOrderItemOut,WarehouseStockUpdate,
    InventoryTransactionCreate, InventoryTransactionOut
)
from app.models.inventory import (
    Product,Supplier, ProductSupplier, Warehouse,WarehouseTransfer,WarehouseTransferItem, Sale, SaleItem, 
    PurchaseOrderItem, PurchaseOrder, InventoryTransaction)

from app.CRUD.inventory import (create_warehouse_stock,get_all_warehouse_stocks,delete_warehouse_stock,update_warehouse_stock,
                                get_warehouse_stock)
from app.api.deps import get_db

router = APIRouter(prefix="/inventory", tags=["inventory"])

                      #############   Products API Calls  ########################

# GET /api/products - List all products with filters
@router.get("/products", response_model=List[ProductOut])
def list_products(
    db: Session = Depends(get_db),
    category: Optional[str] = Query(None, description="Filter by category"),
    brand: Optional[str] = Query(None, description="Filter by brand"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    search: Optional[str] = Query(None, description="Search in name, sku, or barcode"),
    skip: int = Query(0, ge=0, description="Skip items for pagination"),
    limit: int = Query(100, ge=1, le=1000, description="Limit items returned")
):
    query = db.query(Product)
    
    # Apply filters
    if category:
        query = query.filter(Product.category == category)
    if brand:
        query = query.filter(Product.brand == brand)
    if is_active is not None:
        query = query.filter(Product.is_active == is_active)
    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.sku.ilike(f"%{search}%"),
                Product.barcode.ilike(f"%{search}%")
            )
        )
    
    return query.offset(skip).limit(limit).all()

# POST /api/products - Create a new product
@router.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    # Check if SKU already exists
    if db.query(Product).filter(Product.sku == product_in.sku).first():
        raise HTTPException(status_code=400, detail="SKU already exists")
    
    # Check if barcode already exists (if provided)
    if product_in.barcode and db.query(Product).filter(Product.barcode == product_in.barcode).first():
        raise HTTPException(status_code=400, detail="Barcode already exists")
    
    db_product = Product(**product_in.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# GET /api/products/low-stock - Get products below min stock
@router.get("/products/low-stock", response_model=List[ProductOut])
def low_stock_products(db: Session = Depends(get_db)):
    return db.query(Product).filter(
        and_(
            Product.current_stock < Product.min_stock_level,
            Product.is_active == True
        )
    ).all()

# GET /api/products/barcode/{barcode} - Get product by barcode
@router.get("/products/barcode/{barcode}", response_model=ProductOut)
def get_product_by_barcode(barcode: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.barcode == barcode).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# POST /api/products/bulk-update - Bulk update products
@router.post("/products/bulk-update")
def bulk_update_products(bulk_update: ProductBulkUpdate, db: Session = Depends(get_db)):
    updated_products = []
    errors = []
    
    for product_data in bulk_update.products:
        try:
            product_id = product_data.get("id")
            if not product_id:
                errors.append({"error": "Product ID is required", "data": product_data})
                continue
            
            product = db.query(Product).filter(Product.id == product_id).first()
            if not product:
                errors.append({"error": f"Product with ID {product_id} not found", "data": product_data})
                continue
            
            # Update fields
            for key, value in product_data.items():
                if key != "id" and hasattr(product, key):
                    setattr(product, key, value)
            
            db.commit()
            db.refresh(product)
            updated_products.append(product)
            
        except Exception as e:
            errors.append({"error": str(e), "data": product_data})
            db.rollback()
    
    return {
        "updated_count": len(updated_products),
        "error_count": len(errors),
        "errors": errors
    }

# GET /api/products/categories - Get all categories
@router.get("/products/categories", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(
        Product.category,
        func.count(Product.id).label('count')
    ).filter(
        and_(Product.category.isnot(None), Product.is_active == True)
    ).group_by(Product.category).all()
    
    return [{"category": cat.category, "count": cat.count} for cat in categories]

# GET /api/products/{id}/stock - Stock across all warehouses
@router.get("/products/{id}/stock")
def get_product_stock(id: UUID, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # For now, returning current stock. In a multi-warehouse setup, 
    # you would query warehouse-specific stock levels
    return {
        "product_id": id,
        "total_stock": product.current_stock,
        "warehouses": [
            {
                "warehouse_id": "default",
                "warehouse_name": "Main Warehouse",
                "stock": product.current_stock
            }
        ]
    } 

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

    # Check if SKU already exists for another product
    if product_in.sku and product_in.sku != product.sku:
        if db.query(Product).filter(and_(Product.sku == product_in.sku, Product.id != id)).first():
            raise HTTPException(status_code=400, detail="SKU already exists")
    
    # Check if barcode already exists for another product
    if product_in.barcode and product_in.barcode != product.barcode:
        if db.query(Product).filter(and_(Product.barcode == product_in.barcode, Product.id != id)).first():
            raise HTTPException(status_code=400, detail="Barcode already exists")

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
# --- List suppliers with filters ---
@router.get("/suppliers", response_model=List[SupplierOut])
def list_suppliers(
    name: Optional[str] = Query(None, description="Filter by supplier name"),
    city: Optional[str] = Query(None, description="Filter by city"),
    state: Optional[str] = Query(None, description="Filter by state"),
    db: Session = Depends(get_db),
):
    query = db.query(Supplier)
    if name:
        query = query.filter(Supplier.name.ilike(f"%{name}%"))
    if city:
        query = query.filter(Supplier.city.ilike(f"%{city}%"))
    if state:
        query = query.filter(Supplier.state.ilike(f"%{state}%"))
    return query.all()

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

         ##################   Product-Supplier API Calls  ######################
# --- List product-suppliers with filters ---
@router.get("/product-suppliers", response_model=List[ProductSupplierOut])
def list_product_suppliers(
    product_id: Optional[UUID] = Query(None),
    supplier_id: Optional[UUID] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(ProductSupplier)
    if product_id:
        query = query.filter(ProductSupplier.product_id == product_id)
    if supplier_id:
        query = query.filter(ProductSupplier.supplier_id == supplier_id)
    return query.all()

# --- Create product-supplier ---
@router.post("/product-suppliers", response_model=ProductSupplierOut, status_code=201)
def create_product_supplier(data: ProductSupplierCreate, db: Session = Depends(get_db)):
    entry = ProductSupplier(**data.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

# --- Get product-supplier by ID ---
@router.get("/product-suppliers/{id}", response_model=ProductSupplierOut)
def get_product_supplier(id: UUID, db: Session = Depends(get_db)):
    entry = db.query(ProductSupplier).filter(ProductSupplier.id == id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="ProductSupplier not found")
    return entry

# --- Update product-supplier ---
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

# --- Delete product-supplier ---
@router.delete("/product-suppliers/{id}", status_code=204)
def delete_product_supplier(id: UUID, db: Session = Depends(get_db)):
    entry = db.query(ProductSupplier).filter(ProductSupplier.id == id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="ProductSupplier not found")
    db.delete(entry)
    db.commit()

# -------------------- Warehouse --------------------
@router.get("/warehouses/transfer-status-options")
def get_transfer_status_options():
    return [status.value for status in TransferStatus]
#-----------------------------------------------------------
# -------------------- Warehouse Transfers --------------------
@router.get("/warehouses/transfers", response_model=List[WarehouseTransferOut])
def list_transfers(
    status: Optional[str] = Query(None),
    from_warehouse_id: Optional[UUID] = Query(None),
    to_warehouse_id: Optional[UUID] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(WarehouseTransfer).options(joinedload(WarehouseTransfer.items))
    if status:
        query = query.filter(WarehouseTransfer.status == status)
    if from_warehouse_id:
        query = query.filter(WarehouseTransfer.from_warehouse_id == from_warehouse_id)
    if to_warehouse_id:
        query = query.filter(WarehouseTransfer.to_warehouse_id == to_warehouse_id)
    return query.all()


@router.post("/warehouses/transfer", response_model=WarehouseTransferOut, status_code=201)
def create_transfer(transfer: WarehouseTransferCreate, db: Session = Depends(get_db)):
    tr = WarehouseTransfer(
        transfer_number=transfer.transfer_number,
        from_warehouse_id=transfer.from_warehouse_id,
        to_warehouse_id=transfer.to_warehouse_id,
        transfer_date=transfer.transfer_date or date.today(),
        status=transfer.status,
        notes=transfer.notes,
        created_by=transfer.created_by,
    )
    db.add(tr)
    db.flush()

    for item in transfer.items:
        db.add(WarehouseTransferItem(
            transfer_id=tr.id,
            product_id=item.product_id,
            quantity=item.quantity,
        ))

    db.commit()
    db.refresh(tr)
    return tr

@router.post("/warehouses/transfers/{id}/complete", response_model=WarehouseTransferOut)
def complete_transfer(id: UUID, db: Session = Depends(get_db)):
    transfer = db.query(WarehouseTransfer).filter(WarehouseTransfer.id == id).first()
    if not transfer:
        raise HTTPException(404, detail="Transfer not found")

    transfer.status = "completed"
    db.commit()
    db.refresh(transfer)
    return transfer
# -------------------- xxxxxxxxxxxxxxxxxx --------------------
# -------------------- Warehouse --------------------
@router.get("/warehouses", response_model=List[WarehouseOut])
def list_warehouses(
    is_active: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Warehouse)
    if is_active is not None:
        query = query.filter(Warehouse.is_active == is_active)
    if search:
        query = query.filter(Warehouse.name.ilike(f"%{search}%"))
    return query.all()


@router.post("/warehouses", response_model=WarehouseOut, status_code=201)
def create_warehouse(data: WarehouseCreate, db: Session = Depends(get_db)):
    wh = Warehouse(**data.dict())
    db.add(wh)
    db.commit()
    db.refresh(wh)
    return wh


@router.put("/warehouses/{id}", response_model=WarehouseOut)
def update_warehouse(id: UUID, data: WarehouseUpdate, db: Session = Depends(get_db)):
    wh = db.query(Warehouse).filter(Warehouse.id == id).first()
    if not wh:
        raise HTTPException(404, detail="Warehouse not found")
    for k, v in data.dict(exclude_unset=True).items():
        setattr(wh, k, v)
    db.commit()
    db.refresh(wh)
    return wh


@router.get("/warehouses/{id}", response_model=WarehouseOut)
def get_warehouse(id: UUID, db: Session = Depends(get_db)):
    wh = db.query(Warehouse).filter(Warehouse.id == id).first()
    if not wh:
        raise HTTPException(404, detail="Warehouse not found")
    return wh
#################### warehouse stock table #########################

# routes/inventory/warehouse_stock.py

@router.post("/warehouse-stocks", response_model=WarehouseStockOut)
def create_stock(stock: WarehouseStockCreate, db: Session = Depends(get_db)):
    return create_warehouse_stock(db, stock)

@router.get("/warehouse-stocks", response_model=List[WarehouseStockOut])
def list_stocks(db: Session = Depends(get_db)):
    return get_all_warehouse_stocks(db)

@router.get("/warehouse-stocks/{stock_id}", response_model=WarehouseStockOut)
def get_stock(stock_id: UUID, db: Session = Depends(get_db)):
    stock = get_warehouse_stock(db, stock_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

@router.put("/warehouse-stocks/{stock_id}", response_model=WarehouseStockOut)
def update_stock(stock_id: UUID, stock_data: WarehouseStockUpdate, db: Session = Depends(get_db)):
    return update_warehouse_stock(db, stock_id, stock_data)

@router.delete("/warehouse-stocks/{stock_id}")
def delete_stock(stock_id: UUID, db: Session = Depends(get_db)):
    delete_warehouse_stock(db, stock_id)
    return {"detail": "Deleted"}


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
    # Add sale items and adjust inventory
    for item in data.items:
    # Fetch product
        product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")

    # Check stock availability
    if product.current_stock < item.quantity:
        raise HTTPException(status_code=400, detail=f"Insufficient stock for product {product.name}")

    # Reduce stock
    product.current_stock -= item.quantity

    # Create SaleItem
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
    else:
        raise HTTPException(status_code=400, detail="Invalid transaction type")

    txn = InventoryTransaction(
        product_id=product.id,
        transaction_type=data.transaction_type,
        quantity=data.quantity,
        reference_type="adjustment",
        reference_id=None,
        notes=data.notes or f"Manual stock {data.transaction_type}"
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



####################### Inventory summary based on product suppliers ##################

@router.get("/sales/summary/by-customer", summary="Sales summary grouped by customer")
def sales_by_customer(db: Session = Depends(get_db)):
    sales = (
        db.query(Sale)
        .options(joinedload(Sale.items))
        .order_by(Sale.sale_date.desc())
        .all()
    )

    customer_sales = []

    for sale in sales:
        customer_sales.append({
            "customer_name": sale.customer_name,
            "sale_date": sale.sale_date,
            "status": sale.status,
            "total_amount": str(sale.total_amount),
            "items": [
                {
                    "product_id": item.product_id,
                    "quantity": str(item.quantity),
                    "unit_price": str(item.unit_price),
                    "line_total": str(item.line_total),
                    "created_at": item.created_at.isoformat() if item.created_at else None
                }
                for item in sale.items
            ]
        })

    return customer_sales

@router.get("/sales/summary/by-product", summary="Sales summary per product with customer")
def sales_by_product_customer(db: Session = Depends(get_db)):
    results = (
        db.query(
            Product.id.label("product_id"),
            Product.name.label("product_name"),
            Sale.customer_name,
            SaleItem.quantity,
            SaleItem.line_total
        )
        .join(SaleItem, SaleItem.product_id == Product.id)
        .join(Sale, Sale.id == SaleItem.sale_id)
        .order_by(Product.name, Sale.customer_name)
        .all()
    )

    return [
        {
            "product_id": str(row.product_id),
            "product_name": row.product_name,
            "customer_name": row.customer_name,
            "quantity": float(row.quantity or 0),
            "line_total": float(row.line_total or 0)
        }
        for row in results
    ]

@router.get("/purchase/summary/by-supplier", summary="Purchase summary grouped by supplier")
def purchase_by_supplier(db: Session = Depends(get_db)):
    results = (
        db.query(
            Warehouse.name,
            func.count(PurchaseOrder.id).label("total_pos"),
            func.sum(PurchaseOrder.total_amount).label("total_amount")
        )
        .join(PurchaseOrder, PurchaseOrder.supplier_id == Warehouse.id)
        .group_by(Warehouse.name)
        .order_by(func.sum(PurchaseOrder.total_amount).desc())
        .all()
    )

    return [
        {
            "supplier_name": row.name,
            "total_po": row.total_pos,
            "total_amount": float(row.total_amount or 0)
        }
        for row in results
    ]
@router.get("/purchase/summary/by-product", summary="Purchase summary grouped by product")
def purchase_by_product(db: Session = Depends(get_db)):
    results = (
        db.query(
            Product.id,
            Product.name,
            func.sum(PurchaseOrderItem.quantity).label("total_quantity"),
            func.sum(PurchaseOrderItem.line_total).label("total_amount")
        )
        .join(PurchaseOrderItem, PurchaseOrderItem.product_id == Product.id)
        .group_by(Product.id, Product.name)
        .order_by(func.sum(PurchaseOrderItem.line_total).desc())
        .all()
    )

    return [
        {
            "product_id": str(row.id),
            "product_name": row.name,
            "total_quantity_purchased": float(row.total_quantity or 0),
            "total_amount": float(row.total_amount or 0)
        }
        for row in results
    ]
@router.get("/sales/details/by-period", summary="Sales details between two dates")
def sales_details_by_period(
    start_date: date = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: date = Query(..., description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    sales = (
        db.query(Sale)
        .options(joinedload(Sale.items))
        .filter(Sale.sale_date >= start_date, Sale.sale_date <= end_date)
        .order_by(Sale.sale_date)
        .all()
    )

    result = []
    for sale in sales:
        sale_data = {
            "customer_name": sale.customer_name,
            "sale_date": sale.sale_date,
            "status": sale.status,
            "total_amount": str(sale.total_amount),
            "items": []
        }
        for item in sale.items:
            sale_data["items"].append({
                "product_id": str(item.product_id),
                "quantity": str(item.quantity),
                "unit_price": str(item.unit_price),
                "line_total": str(item.line_total)
            })
        result.append(sale_data)

    return result



