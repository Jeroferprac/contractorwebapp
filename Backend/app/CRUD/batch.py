from sqlalchemy.orm import Session
from sqlalchemy import and_,func
from uuid import UUID
from typing import List, Optional

from app.models.batch import Batch
from app.schemas.batch import BatchCreate, BatchUpdate


def create_batch(db: Session, batch_data: BatchCreate) -> Batch:
    batch = Batch(**batch_data.model_dump())
    db.add(batch)
    db.commit()
    db.refresh(batch)
    return batch


def get_batch(db: Session, batch_id: UUID) -> Optional[Batch]:
    return db.query(Batch).filter(Batch.id == batch_id).first()


def update_batch(db: Session, batch_id: UUID, batch_data: BatchUpdate) -> Optional[Batch]:
    batch = get_batch(db, batch_id)
    if not batch:
        return None
    for key, value in batch_data.model_dump(exclude_unset=True).items():
        setattr(batch, key, value)
    db.commit()
    db.refresh(batch)
    return batch


def delete_batch(db: Session, batch_id: UUID) -> bool:
    batch = get_batch(db, batch_id)
    if not batch:
        return False
    db.delete(batch)
    db.commit()
    return True


def list_batches(
    db: Session,
    product_id: Optional[UUID] = None,
    warehouse_id: Optional[UUID] = None,
    batch_number: Optional[str] = None,
    expiry_date: Optional[str] = None,
    include_expired: bool = False,
) -> List[Batch]:
    print("include_expired in CRUD:", include_expired)
    query = db.query(Batch)
    if product_id:
        query = query.filter(Batch.product_id == product_id)
    if warehouse_id:
        query = query.filter(Batch.warehouse_id == warehouse_id)
    if batch_number:
        query = query.filter(Batch.batch_number.ilike(f"%{batch_number}%"))
    if expiry_date:
        query = query.filter(Batch.expiry_date <= expiry_date)
    if include_expired is False:
        query = query.filter(Batch.expiry_date >= func.current_date())
    if include_expired is True:
        query = query.filter(Batch.expiry_date < func.current_date())

    return query.order_by(Batch.expiry_date).all()
