from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List
from uuid import UUID

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate


def create_customer(db: Session, data: CustomerCreate) -> Customer:
    customer = Customer(**data.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def list_customers(
    db: Session,
    name: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    is_active: Optional[bool] = None
) -> List[Customer]:
    query = db.query(Customer)
    if name:
        query = query.filter(Customer.name.ilike(f"%{name}%"))
    if city:
        query = query.filter(Customer.city.ilike(f"%{city}%"))
    if state:
        query = query.filter(Customer.state.ilike(f"%{state}%"))
    if is_active is not None:
        query = query.filter(Customer.is_active == is_active)
    return query.order_by(Customer.name).all()


def get_customer(db: Session, customer_id: UUID) -> Optional[Customer]:
    return db.query(Customer).filter(Customer.id == customer_id).first()


def update_customer(db: Session, customer_id: UUID, data: CustomerUpdate) -> Optional[Customer]:
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(customer, field, value)
    db.commit()
    db.refresh(customer)
    return customer


# Placeholder for future advanced features
def get_customer_sales_history(db: Session, customer_id: UUID):
    # In future: join with sales table
    return {"message": f"Sales history for customer {customer_id} not implemented yet."}


def get_customer_payments(db: Session, customer_id: UUID):
    # In future: join with payments table
    return {"message": f"Payments for customer {customer_id} not implemented yet."}
