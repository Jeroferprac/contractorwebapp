from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.schemas.price_list import (
    PriceListCreate, PriceListUpdate,
    PriceListOut, PriceListItemOut, PriceListItemCreate
)
from app.CRUD import price_list as crud
from app.api.deps import get_db

router = APIRouter(prefix="/price-lists", tags=["Price-lists"])


# ------------------ Price Lists ------------------

@router.post("/", response_model=PriceListOut, status_code=201)
def create_price_list(data: PriceListCreate, db: Session = Depends(get_db)):
    return crud.create_price_list(db, data)


@router.get("/", response_model=List[PriceListOut])
def list_price_lists(
    is_active: Optional[bool] = Query(None, description="Filter by active status: true or false"),
    db: Session = Depends(get_db)
):
    """
    List all price lists.  
    **Filters**:  
    - `is_active` → true or false
    """
    return crud.list_price_lists(db, is_active=is_active)


@router.get("/{id}", response_model=PriceListOut)
def get_price_list(id: UUID, db: Session = Depends(get_db)):
    price_list = crud.get_price_list(db, id)
    if not price_list:
        raise HTTPException(status_code=404, detail="Price list not found")
    return price_list


@router.put("/{id}", response_model=PriceListOut)
def update_price_list(id: UUID, data: PriceListUpdate, db: Session = Depends(get_db)):
    price_list = crud.update_price_list(db, id, data)
    if not price_list:
        raise HTTPException(status_code=404, detail="Price list not found")
    return price_list


# ------------------ Price List Items ------------------

@router.get("/{id}/products", response_model=List[PriceListItemOut])
def get_price_list_items(id: UUID, db: Session = Depends(get_db)):
    """
    Get all products with their price & discount in the given price list.
    """
    return crud.get_price_list_items(db, id)


@router.post("/{id}/products", response_model=PriceListItemOut, status_code=201)
def add_price_list_item(id: UUID, data: PriceListItemCreate, db: Session = Depends(get_db)):
    """
    Add a product with price and discount to a specific price list.
    """
    return crud.add_price_list_item(db, id, data)
