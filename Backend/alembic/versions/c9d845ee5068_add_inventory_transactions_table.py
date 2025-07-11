"""Add inventory transactions table

Revision ID: c9d845ee5068
Revises: 5ce206cd1827
Create Date: 2025-07-11 17:55:34.333953

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c9d845ee5068'
down_revision: Union[str, Sequence[str], None] = '5ce206cd1827'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('inventory_transactions',
    sa.Column('product_id', sa.UUID(), nullable=False),
    sa.Column('transaction_type', sa.String(length=20), nullable=False),
    sa.Column('quantity', sa.DECIMAL(precision=10, scale=2), nullable=False),
    sa.Column('reference_type', sa.String(length=50), nullable=True),
    sa.Column('reference_id', sa.UUID(), nullable=True),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
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
    op.drop_table('inventory_transactions')
    # ### end Alembic commands ###
