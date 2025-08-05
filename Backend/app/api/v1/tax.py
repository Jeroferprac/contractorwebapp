from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.models.tax import TaxGroup, ProductTax
from app.models.inventory import Product
from app.schemas.tax import (
    TaxGroupCreate, TaxGroupOut, TaxGroupUpdate,
    ProductTaxBase, ProductTaxOut
)

router = APIRouter(prefix="/tax", tags=["tax"])

@router.post("/groups", response_model=TaxGroupOut, status_code=201)
def create_tax_group(tg: TaxGroupCreate, db: Session = Depends(get_db)):
    new = TaxGroup(**tg.model_dump())
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

@router.get("/groups", response_model=List[TaxGroupOut])
def list_tax_groups(db: Session = Depends(get_db)):
    return db.query(TaxGroup).filter_by(is_active=True).all()

@router.put("/groups/{tg_id}", response_model=TaxGroupOut)
def update_tax_group(
    tg_id: UUID,
    data: TaxGroupUpdate,
    db: Session = Depends(get_db)
):
    tg = db.get(TaxGroup, tg_id)
    if not tg:
        raise HTTPException(404, "Tax group not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(tg, k, v)
    db.commit()
    db.refresh(tg)
    return tg

@router.post("/assign", response_model=ProductTaxOut, status_code=201)
def assign_product_tax(pt: ProductTaxBase, db: Session = Depends(get_db)):
    # Validate product & tax group exist
    if not db.get(Product, pt.product_id):
        raise HTTPException(404, "Product not found")
    if not db.get(TaxGroup, pt.tax_group_id):
        raise HTTPException(404, "Tax group not found")

    new = ProductTax(**pt.model_dump())
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

@router.get("/product/{product_id}/taxes", response_model=List[ProductTaxOut])
def product_taxes(product_id: UUID, db: Session = Depends(get_db)):
    return db.query(ProductTax).filter_by(product_id=product_id).all()
