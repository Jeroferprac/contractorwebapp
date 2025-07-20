"""Add warehouse_stock table

Revision ID: f47451f9b282
Revises: cea33f6710ea
Create Date: 2025-07-18 19:39:09.312347

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import uuid

# revision identifiers, used by Alembic.
revision: str = 'f47451f9b282'
down_revision: Union[str, Sequence[str], None] = 'cea33f6710ea'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        "warehouse_stock",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("product_id", sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("warehouse_id", sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey("warehouses.id"), nullable=False),
        sa.Column("quantity", sa.DECIMAL(10, 2), nullable=False, server_default="0"),
        sa.Column("reserved_quantity", sa.DECIMAL(10, 2), nullable=False, server_default="0"),
        sa.Column("bin_location", sa.String(50)),
        sa.Column("updated_at", sa.TIMESTAMP(), server_default=sa.func.now()),
        sa.UniqueConstraint("product_id", "warehouse_id", name="uix_product_warehouse")
    )
   

def downgrade():
    op.drop_table("warehouse_stock")
