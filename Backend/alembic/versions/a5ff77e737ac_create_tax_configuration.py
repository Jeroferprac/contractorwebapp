"""create tax configuration

Revision ID: a5ff77e737ac
Revises: 81bc1cbf9f6d
Create Date: 2025-08-04 19:46:01.220965

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'a5ff77e737ac'
down_revision: Union[str, Sequence[str], None] = '81bc1cbf9f6d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- Create tax_groups ---
    op.create_table(
        'tax_groups',
        sa.Column('id', sa.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('rate', sa.DECIMAL(precision=5, scale=2), nullable=False),
        sa.Column('is_compound', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    # --- Create product_taxes ---
    op.create_table(
        'product_taxes',
        sa.Column('id', sa.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('product_id', sa.UUID(), nullable=False),
        sa.Column('tax_group_id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], name='fk_product_taxes_product'),
        sa.ForeignKeyConstraint(['tax_group_id'], ['tax_groups.id'], name='fk_product_taxes_tax_group'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('product_id', 'tax_group_id', name='uq_product_taxes_product_tax'),
    )

    # --- Optional: create index for faster lookups ---
    op.create_index('ix_product_taxes_product_id', 'product_taxes', ['product_id'])

    # Adjust timestamps on shipments only if truly necessary:
    # If you actually want to drop or recreate the index, do so conditionally:
    op.drop_index('ix_shipments_sale_id', table_name='shipments', if_exists=True)

def downgrade() -> None:
    # Drop constraints & tables
    op.drop_index('ix_product_taxes_product_id', table_name='product_taxes', if_exists=True)
    op.drop_table('product_taxes')
    op.drop_table('tax_groups')
    # You can recreate the shipments index if needed:
    op.create_index('ix_shipments_sale_id', 'shipments', ['sale_id'], unique=False)
    # ### end Alembic commands ###
