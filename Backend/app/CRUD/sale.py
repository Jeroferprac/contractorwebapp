from sqlalchemy.orm import Session,selectinload,joinedload
from uuid import UUID
from app.models.inventory import Sale, SaleItem,WarehouseStock
from app.schemas.inventory import SaleCreate, SaleUpdate,SaleOut
from typing import List, Optional
from fastapi import HTTPException
from sqlalchemy.exc import NoResultFound
from sqlalchemy import select
from datetime import datetime
import uuid


def generate_sale_number():
    now = datetime.utcnow()
    return f"SALE-{now.strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
    
# -------- Create Sale --------
def create_sale_record(db: Session, sale_data: SaleCreate) -> Sale:
    sale = Sale(
        sale_number=sale_data.sale_number,
        customer_id=sale_data.customer_id,
        warehouse_id=sale_data.warehouse_id,
        sale_date=sale_data.sale_date,
        due_date=sale_data.due_date,
        status=sale_data.status,
        payment_status=sale_data.payment_status,
        subtotal=sale_data.subtotal,
        tax_amount=sale_data.tax_amount,
        discount_amount=sale_data.discount_amount,
        paid_amount=sale_data.paid_amount,
        total_amount=sale_data.total_amount,
        shipping_address=sale_data.shipping_address,
        notes=sale_data.notes,
        created_by=sale_data.created_by
    )

    db.add(sale)
    db.flush()  # Needed to assign sale.id for SaleItem FK

    for item in sale_data.items:
        sale_item = SaleItem(
            sale_id=sale.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            discount=item.discount,
            tax=item.tax,
            line_total=item.total_price
        )
        db.add(sale_item)

    db.commit()
    db.refresh(sale)
    return sale



# -------- Get Sale by ID --------
def get_sale(db: Session, sale_id: UUID) -> SaleOut:
    sale = (
        db.query(Sale)
        .options(joinedload(Sale.customer))
        .filter(Sale.id == sale_id)
        .first()
    )
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    return SaleOut.model_validate(sale, from_attributes=True)



# -------- Update Sale --------
def update_sale(db: Session, sale_id: UUID, sale_data: SaleUpdate) -> Optional[Sale]:
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    # Update main sale fields
    for field, value in sale_data.dict(exclude={"items"}).items():
        setattr(sale, field, value)

    # Delete existing sale items
    db.query(SaleItem).filter(SaleItem.sale_id == sale.id).delete()

    # Add new sale items
    for item in sale_data.items:
        sale_item = SaleItem(
            sale_id=sale.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price,
            discount=item.discount,
            tax=item.tax,
            line_total=item.total_price
        )
        db.add(sale_item)

    db.commit()
    db.refresh(sale)
    return sale


# -------- Delete Sale --------
def delete_sale(db: Session, sale_id: UUID) -> bool:
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    db.delete(sale)
    db.commit()
    return True


# -------- List Sales --------
def list_sales(db: Session, skip: int = 0, limit: int = 100) -> List[Sale]:
    return (
        db.query(Sale)
        .options(selectinload(Sale.customer))
        .offset(skip)
        .limit(limit)
        .all()
    )


# -------------Ship Sale -------------------

async def ship_sale(sale_id: UUID, db: Session):
    sale = db.execute(
        select(Sale)
        .options(selectinload(Sale.items))
        .where(Sale.id == sale_id)
    ).scalar_one_or_none()

    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    if sale.status == "shipped":
        raise HTTPException(status_code=400, detail="Sale is already shipped")

    if not sale.warehouse_id:
        raise HTTPException(status_code=400, detail="Warehouse not assigned for this sale")

    # Check and deduct stock
    for item in sale.items:
        stock = db.execute(
            select(WarehouseStock)
            .where(
                WarehouseStock.product_id == item.product_id,
                WarehouseStock.warehouse_id == sale.warehouse_id
            )
        ).scalar_one_or_none()

        if not stock or stock.available_quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for product ID {item.product_id}")

        stock.quantity -= item.quantity
        stock.reserved_quantity = max(stock.reserved_quantity - item.quantity, 0)
        db.add(stock)

    # Update sale status
    sale.status = "shipped"
    sale.shipped_at = datetime.utcnow()
    db.add(sale)

    db.commit()
    db.refresh(sale)
    return sale