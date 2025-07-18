"""Add new product fields

Revision ID: 845a55b97a35
Revises: 7717bfaa7099
Create Date: 2025-07-16 08:44:17.559256

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '845a55b97a35'
down_revision: Union[str, Sequence[str], None] = '7717bfaa7099'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('products', sa.Column('barcode', sa.String(length=100), nullable=True))
    op.add_column('products', sa.Column('reorder_point', sa.DECIMAL(precision=10, scale=2), nullable=True))
    op.add_column('products', sa.Column('max_stock_level', sa.DECIMAL(precision=10, scale=2), nullable=True))
    op.add_column('products', sa.Column('weight', sa.DECIMAL(precision=10, scale=2), nullable=True))
    op.add_column('products', sa.Column('dimensions', sa.String(length=50), nullable=True))
    op.add_column('products', sa.Column('is_active', sa.Boolean(), nullable=True))
    op.add_column('products', sa.Column('track_serial', sa.Boolean(), nullable=True))
    op.add_column('products', sa.Column('track_batch', sa.Boolean(), nullable=True))
    op.add_column('products', sa.Column('is_composite', sa.Boolean(), nullable=True))
    op.alter_column('products', 'updated_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               type_=sa.TIMESTAMP(),
               existing_nullable=True,
               existing_server_default=sa.text('now()'))
    op.create_unique_constraint(None, 'products', ['barcode'])
    # op.alter_column('quotations', 'user_id',
    #            existing_type=sa.UUID(),
    #            type_=sa.String(),
    #            existing_nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('quotations', 'user_id',
               existing_type=sa.String(),
               type_=sa.UUID(),
               existing_nullable=False)
    op.drop_constraint(None, 'products', type_='unique')
    op.alter_column('products', 'updated_at',
               existing_type=sa.TIMESTAMP(),
               type_=postgresql.TIMESTAMP(timezone=True),
               existing_nullable=True,
               existing_server_default=sa.text('now()'))
    op.drop_column('products', 'is_composite')
    op.drop_column('products', 'track_batch')
    op.drop_column('products', 'track_serial')
    op.drop_column('products', 'is_active')
    op.drop_column('products', 'dimensions')
    op.drop_column('products', 'weight')
    op.drop_column('products', 'max_stock_level')
    op.drop_column('products', 'reorder_point')
    op.drop_column('products', 'barcode')
    # ### end Alembic commands ###
