import sqlalchemy as sa
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
from sqlalchemy import UniqueConstraint

class Notification(BaseModel):
    __tablename__ = "notifications"

    id = sa.Column(sa.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()"))
    type = sa.Column(sa.String(50), nullable=False)
    title = sa.Column(sa.String(255), nullable=True)
    message = sa.Column(sa.Text, nullable=True)
    reference_id = sa.Column(sa.UUID(as_uuid=True), nullable=True)
    reference_type = sa.Column(sa.String(50), nullable=True)
    is_read = sa.Column(sa.Boolean, nullable=False, default=False)
    user_id = sa.Column(sa.UUID(as_uuid=True), nullable=False)
    created_at = sa.Column(sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False)

    __table_args__ = (
        UniqueConstraint('user_id', 'type', 'reference_id', 'is_read', name='uq_user_type_ref_unread'),
    )
