from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional

from app.models.price_list import PriceList, PriceListItem
from app.schemas.price_list import (
    PriceListCreate, PriceListUpdate,
    PriceListItemCreate
)


# ----------------- Price Lists --------------------

def create_price_list(db: Session, data: PriceListCreate) -> PriceList:
    price_list = PriceList(**data.model_dump())
    db.add(price_list)
    db.commit()
    db.refresh(price_list)
    return price_list


def get_price_list(db: Session, price_list_id: UUID) -> Optional[PriceList]:
    return db.query(PriceList).filter(PriceList.id == price_list_id).first()


def list_price_lists(db: Session, is_active: Optional[bool] = None) -> List[PriceList]:
    query = db.query(PriceList)
    if is_active is not None:
        query = query.filter(PriceList.is_active == is_active)
    return query.order_by(PriceList.created_at.desc()).all()


def update_price_list(db: Session, price_list_id: UUID, data: PriceListUpdate) -> Optional[PriceList]:
    price_list = get_price_list(db, price_list_id)
    if not price_list:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(price_list, key, value)
    db.commit()
    db.refresh(price_list)
    return price_list


# ----------------- Price List Items --------------------

def get_price_list_items(db: Session, price_list_id: UUID) -> List[PriceListItem]:
    return db.query(PriceListItem).filter(PriceListItem.price_list_id == price_list_id).all()


def add_price_list_item(db: Session, price_list_id: UUID, data: PriceListItemCreate) -> PriceListItem:
    item = PriceListItem(
        price_list_id=price_list_id,
        product_id=data.product_id,
        price=data.price,
        discount_percentage=data.discount_percentage
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
