"""create ship ments & tax tables

Revision ID: 81bc1cbf9f6d
Revises: 7afe556ece2c
Create Date: 2025-08-04 19:03:02.497444

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '81bc1cbf9f6d'
down_revision: Union[str, Sequence[str], None] = '7afe556ece2c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'shipments',
        sa.Column('id', sa.UUID(), server_default=sa.text('gen_random_uuid()'), primary_key=True, nullable=False),
        sa.Column('sale_id', sa.UUID(), nullable=False),
        sa.Column('carrier_name', sa.String(length=100), nullable=True),
        sa.Column('tracking_number', sa.String(length=100), nullable=True),
        sa.Column('shipping_method', sa.String(length=50), nullable=True),
        sa.Column('shipping_cost', sa.DECIMAL(precision=10, scale=2), nullable=True),
        sa.Column('weight', sa.DECIMAL(precision=10, scale=2), nullable=True),
        sa.Column('dimensions', sa.String(length=50), nullable=True),
        sa.Column('shipped_date', sa.Date(), nullable=True),
        sa.Column('delivered_date', sa.Date(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False, server_default=sa.text("'pending'")),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(
            ['sale_id'], ['sales.id'], name='fk_shipments_sale_id_sales'
        ),
    )
    op.create_index('ix_shipments_sale_id', 'shipments', ['sale_id'])

def downgrade() -> None:
    op.drop_index('ix_shipments_sale_id', table_name='shipments')
    op.drop_table('shipments')
