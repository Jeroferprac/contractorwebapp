from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.schemas.customer import (
    CustomerCreate, CustomerUpdate, CustomerOut
)
from app.CRUD import customer as crud
from app.api.deps import get_db

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.post("/", response_model=CustomerOut, status_code=201)
def create_customer(data: CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db, data)


@router.get("/", response_model=List[CustomerOut])
def list_customers(
    name: Optional[str] = Query(None, alias="search", description="Filter by customer name (partial match)"),
    city: Optional[str] = Query(None, description="Filter by city"),
    state: Optional[str] = Query(None, description="Filter by state"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    db: Session = Depends(get_db)
):
    """
    List all customers.  
    **Filters**:  
    - `name` → partial name match  
    - `city` → city name  
    - `state` → state name  
    - `is_active` → true or false  
    """
    return crud.list_customers(db, name=name, city=city, state=state, is_active=is_active)


@router.get("/{id}", response_model=CustomerOut)
def get_customer(id: UUID, db: Session = Depends(get_db)):
    customer = crud.get_customer(db, id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.put("/{id}", response_model=CustomerOut)
def update_customer(id: UUID, data: CustomerUpdate, db: Session = Depends(get_db)):
    customer = crud.update_customer(db, id, data)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


# --- Extra endpoints for Sales History & Payments ---

@router.get("/{id}/sales")
def get_customer_sales_history(id: UUID, db: Session = Depends(get_db)):
    """
    Get all sales related to a specific customer.
    """
    return crud.get_customer_sales_history(db, id)


@router.get("/{id}/payments")
def get_customer_payments(id: UUID, db: Session = Depends(get_db)):
    """
    Get all payment records for a specific customer.
    """
    return crud.get_customer_payments(db, id)
