from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional

from app.models.serial_number import SerialNumber
from app.schemas.serial_number import SerialNumberCreate, SerialNumberUpdate

def create_serial_number(db: Session, data: SerialNumberCreate) -> SerialNumber:
    db_serial = SerialNumber(**data.dict())
    db.add(db_serial)
    db.commit()
    db.refresh(db_serial)
    return db_serial

def get_serial_number(db: Session, serial_id: UUID) -> Optional[SerialNumber]:
    return db.query(SerialNumber).filter(SerialNumber.id == serial_id).first()

def list_serial_numbers(
    db: Session,
    product_id: Optional[UUID] = None,
    warehouse_id: Optional[UUID] = None,
    status: Optional[str] = None,
    serial_number: Optional[str] = None,
    sale_id: Optional[UUID] = None
) -> List[SerialNumber]:
    query = db.query(SerialNumber)

    if product_id:
        query = query.filter(SerialNumber.product_id == product_id)

    if warehouse_id:
        query = query.filter(SerialNumber.warehouse_id == warehouse_id)

    if status:
        query = query.filter(SerialNumber.status == status)

    if serial_number:
        query = query.filter(SerialNumber.serial_number.ilike(f"%{serial_number}%"))

    if sale_id:
        query = query.filter(SerialNumber.sale_id == sale_id)

    return query.order_by(SerialNumber.serial_number).all()

def update_serial_number(db: Session, serial_id: UUID, data: SerialNumberUpdate) -> Optional[SerialNumber]:
    db_serial = get_serial_number(db, serial_id)
    if not db_serial:
        return None
    for field, value in data.dict(exclude_unset=True).items():
        setattr(db_serial, field, value)
    db.commit()
    db.refresh(db_serial)
    return db_serial

def delete_serial_number(db: Session, serial_id: UUID) -> bool:
    db_serial = get_serial_number(db, serial_id)
    if not db_serial:
        return False
    db.delete(db_serial)
    db.commit()
    return True
