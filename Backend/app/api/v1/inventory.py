from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.schemas.inventory import ProductCreate, ProductOut, ProductUpdate, SupplierCreate, SupplierUpdate, SupplierOut
from app.models.inventory import Product, Supplier
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