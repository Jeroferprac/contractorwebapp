from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.models.shipping import Shipment
from app.schemas.shipping import (
    ShipmentCreate, ShipmentOut, ShipmentUpdate
)

router = APIRouter(prefix='/shipments', tags=['shipments'])

@router.post('/', response_model=ShipmentOut, status_code=201)
def create_shipment(shp: ShipmentCreate, db: Session = Depends(get_db)):
    # Validate sale exists
    from app.models.inventory import Sale
    if not db.get(Sale, shp.sale_id):
        raise HTTPException(status_code=404, detail='Linked sale not found')
    new = Shipment(**shp.model_dump())
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

@router.get('/', response_model=List[ShipmentOut])
def list_shipments(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(Shipment).offset(skip).limit(limit).all()

@router.get('/{shipment_id}', response_model=ShipmentOut)
def get_shipment(shipment_id: UUID, db: Session = Depends(get_db)):
    shp = db.get(Shipment, shipment_id)
    if not shp:
        raise HTTPException(status_code=404, detail='Shipment not found')
    return shp

@router.put('/{shipment_id}', response_model=ShipmentOut)
def update_shipment(shipment_id: UUID, data: ShipmentUpdate, db: Session = Depends(get_db)):
    shp = db.get(Shipment, shipment_id)
    if not shp:
        raise HTTPException(status_code=404, detail='Shipment not found')
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(shp, key, val)
    db.commit()
    db.refresh(shp)
    return shp

# @router.get('/{shipment_id}/track')
# def track_shipment(shipment_id: UUID, db: Session = Depends(get_db)):
#     # Placeholder to fetch provider API with carrier_name + tracking_number
#     shp = db.get(Shipment, shipment_id)
#     if not shp or not shp.tracking_number:
#         raise HTTPException(status_code=404, detail='No tracking info available')
#     status, history = fetch_tracking_updates(shp.carrier_name, shp.tracking_number)
#     return {'shipment': shp, 'tracking': history}
