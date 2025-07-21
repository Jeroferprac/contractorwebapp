"""undo warehouse_id rename, drop warehouse_id

Revision ID: 5d1e6bc4519f
Revises: cdc6206ff3f6
Create Date: 2025-07-21 15:49:04.372286

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5d1e6bc4519f'
down_revision: Union[str, Sequence[str], None] = 'cdc6206ff3f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Just drop warehouse_id if it's still present
    op.execute("""
        ALTER TABLE purchase_orders
        DROP COLUMN IF EXISTS warehouse_id;
    """)

def downgrade() -> None:
    # Optional: re-add the column if someone rolls back
    op.add_column(
        'purchase_orders',
        sa.Column('warehouse_id', sa.UUID(), nullable=True)
    )
