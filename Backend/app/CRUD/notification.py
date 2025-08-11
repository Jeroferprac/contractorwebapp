from app.models.inventory import Product
from uuid import UUID
from datetime import datetime, date
from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.models.user import User
from sqlalchemy.exc import IntegrityError

def create_notification(
    db: Session,
    user_id: UUID,
    notif_type: str,
    title: str,
    message: str,
    reference_id: UUID,
    reference_type: str = None
):
    existing = (
        db.query(Notification)
          .filter_by(
              user_id=user_id,
              type=notif_type,
              reference_id=reference_id,
              is_read=False
          )
          .first()
    )
    if existing:
        return
    notification = Notification(
            user_id=user_id,
            type=notif_type,
            title=title,
            message=message,
            reference_id=reference_id,
            reference_type=reference_type,
            created_at=datetime.utcnow(),
            is_read=False
        )
    try:
        db.add(notification)
        # db.flush()
    except IntegrityError:
        db.rollback()

def notify_admins(
    db: Session,
    notif_type: str,
    title: str,
    message: str,
    reference_id: UUID,
    reference_type: str = None
):
    admins = db.query(User).filter(User.role == "admin").all()
    for admin in admins:
        create_notification(
            db=db,
            user_id=admin.id,
            notif_type=notif_type,
            title=title,
            message=message,
            reference_id=reference_id,
            reference_type=reference_type
        )

