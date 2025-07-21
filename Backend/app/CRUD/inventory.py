from app.models.inventory import WarehouseStock
from app.schemas.inventory import WarehouseStockCreate, WarehouseStockUpdate
from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

# crud/inventory.py

def create_warehouse_stock(db: Session, stock: WarehouseStockCreate) -> WarehouseStock:
    # Compute available_quantity before creating the object
    available_quantity = stock.quantity - stock.reserved_quantity

    # Create the DB model instance
    db_stock = WarehouseStock(
        product_id=stock.product_id,
        warehouse_id=stock.warehouse_id,
        quantity=stock.quantity,
        reserved_quantity=stock.reserved_quantity,
        available_quantity=available_quantity,
        bin_location=stock.bin_location,
    )

    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock


def update_warehouse_stock(db: Session, stock_id: UUID, stock_data: WarehouseStockUpdate) -> WarehouseStock:
    stock = db.query(WarehouseStock).filter(WarehouseStock.id == stock_id).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    for key, value in stock_data.model_dump(exclude_unset=True).items():
        setattr(stock, key, value)

    # Optional: Recalculate available_quantity if needed
    if 'quantity' in stock_data.model_fields_set or 'reserved_quantity' in stock_data.model_fields_set:
        stock.available_quantity = (stock.quantity or 0) - (stock.reserved_quantity or 0)

    db.commit()
    db.refresh(stock)
    return stock


def get_all_warehouse_stocks(db: Session) -> List[WarehouseStock]:
    return db.query(WarehouseStock).all()

def get_warehouse_stock(db: Session, stock_id: UUID) -> WarehouseStock:
    return db.query(WarehouseStock).filter(WarehouseStock.id == stock_id).first()

def delete_warehouse_stock(db: Session, stock_id: UUID):
    stock = db.query(WarehouseStock).filter(WarehouseStock.id == stock_id).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    db.delete(stock)
    db.commit()
