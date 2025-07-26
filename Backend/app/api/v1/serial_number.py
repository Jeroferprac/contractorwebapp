from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.CRUD import serial_number as serial_crud
from app.schemas.serial_number import SerialNumberCreate, SerialNumberUpdate, SerialNumberOut
from app.api.deps import get_db

router = APIRouter(prefix="/serial-numbers", tags=["Serial Numbers"])

@router.post("/", response_model=SerialNumberOut, status_code=status.HTTP_201_CREATED)
def create_serial_number(data: SerialNumberCreate, db: Session = Depends(get_db)):
   return serial_crud.create_serial_number(db, data)

@router.get("/", response_model=List[SerialNumberOut])
def list_serial_numbers(
    product_id: Optional[UUID] = Query(None, description="Filter by product ID"),
    warehouse_id: Optional[UUID] = Query(None, description="Filter by warehouse ID"),
    status: Optional[str] = Query(None, description="Filter by status (available/reserved/sold)"),
    serial_number: Optional[str] = Query(None, description="Partial search for serial number"),
    sale_id: Optional[UUID] = Query(None, description="Filter by associated sale ID"),
    db: Session = Depends(get_db)
):
    return serial_crud.list_serial_numbers(
        db=db,
        product_id=product_id,
        warehouse_id=warehouse_id,
        status=status,
        serial_number=serial_number,
        sale_id=sale_id
    )

@router.get("/{serial_id}", response_model=SerialNumberOut)
def get_serial_number(serial_id: UUID, db: Session = Depends(get_db)):
    serial = serial_crud.get_serial_number(db, serial_id)
    if not serial:
        raise HTTPException(status_code=404, detail="Serial number not found")
    return serial

@router.put("/{serial_id}", response_model=SerialNumberOut)
def update_serial_number(serial_id: UUID, data: SerialNumberUpdate, db: Session = Depends(get_db)):
    serial = serial_crud.update_serial_number(db, serial_id, data)
    if not serial:
        raise HTTPException(status_code=404, detail="Serial number not found")
    return serial

@router.delete("/{serial_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_serial_number(serial_id: UUID, db: Session = Depends(get_db)):
    success = serial_crud.delete_serial_number(db, serial_id)
    if not success:
        raise HTTPException(status_code=404, detail="Serial number not found")
