from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.models.notification import Notification
from app.schemas.notification import NotificationOut, NotificationMarkRead

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/", response_model=List[NotificationOut])
def list_notifications(user_id: UUID, include_read: bool = False, db: Session = Depends(get_db)):
    q = db.query(Notification).filter(Notification.user_id == user_id)
    if not include_read:
        q = q.filter(Notification.is_read == False)
    return q.order_by(Notification.created_at.desc()).all()

@router.put("/{notif_id}", response_model=NotificationOut)
def mark_read(notif_id: UUID, data: NotificationMarkRead, db: Session = Depends(get_db)):
    notif = db.get(Notification, notif_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = data.is_read
    db.commit()
    db.refresh(notif)
    return notif
