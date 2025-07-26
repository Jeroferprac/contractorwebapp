from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import date

from app.schemas.batch import BatchCreate, BatchUpdate, BatchOut
from app.CRUD import batch as crud
from app.api.deps import get_db

router = APIRouter(prefix="/batches", tags=["Batches"])


@router.post("/", response_model=BatchOut)
def create_batch(batch_data: BatchCreate, db: Session = Depends(get_db)):
    return crud.create_batch(db, batch_data)


@router.get("/{batch_id}", response_model=BatchOut)
def get_batch(batch_id: UUID, db: Session = Depends(get_db)):
    batch = crud.get_batch(db, batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch


@router.put("/{batch_id}", response_model=BatchOut)
def update_batch(batch_id: UUID, batch_data: BatchUpdate, db: Session = Depends(get_db)):
    batch = crud.update_batch(db, batch_id, batch_data)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch


@router.delete("/{batch_id}")
def delete_batch(batch_id: UUID, db: Session = Depends(get_db)):
    success = crud.delete_batch(db, batch_id)
    if not success:
        raise HTTPException(status_code=404, detail="Batch not found")
    return {"message": "Batch deleted successfully"}


@router.get("/", response_model=List[BatchOut])
def list_batches(
    product_id: Optional[UUID] = Query(None, description="Filter by product"),
    warehouse_id: Optional[UUID] = Query(None, description="Filter by warehouse"),
    batch_number: Optional[str] = Query(None, description="Partial match on batch number"),
    expiry_date: Optional[date] = Query(None, description="Expiry date upper limit"),
    include_expired: bool = Query(False, description="Include expired batches"),
    db: Session = Depends(get_db)
):
    """
    List all batches with optional filters.
    """
    print("include_expired received:", include_expired)
    return crud.list_batches(
        db,
        product_id=product_id,
        warehouse_id=warehouse_id,
        batch_number=batch_number,
        expiry_date=expiry_date,
        include_expired=include_expired,
    )
