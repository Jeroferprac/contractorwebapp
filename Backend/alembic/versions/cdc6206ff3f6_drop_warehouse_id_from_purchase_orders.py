"""drop warehouse_id from purchase_orders

Revision ID: cdc6206ff3f6
Revises: 59c3bf3c7e52
Create Date: 2025-07-21 15:33:29.148492

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cdc6206ff3f6'
down_revision: Union[str, Sequence[str], None] = '59c3bf3c7e52'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # op.drop_column("purchase_orders", "warehouse_id", if_exists=True)
    op.execute("""
        ALTER TABLE public.purchase_orders
        DROP COLUMN IF EXISTS warehouse_id;
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column("purchase_orders", sa.Column("warehouse_id", sa.UUID(), nullable=True))
