"""create customers and price lists tables

Revision ID: 399cd0675b7d
Revises: 0458d6920f9c
Create Date: 2025-07-23 18:28:30.751202

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '399cd0675b7d'
down_revision: Union[str, Sequence[str], None] = '0458d6920f9c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'price_lists',
        sa.Column('id', sa.UUID(as_uuid=True), primary_key=True, default=sa.text('gen_random_uuid()')),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('currency', sa.String(3), server_default='USD'),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true')),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'))
    )

    op.create_table(
        'customers',
        sa.Column('id', sa.UUID(as_uuid=True), primary_key=True, default=sa.text('gen_random_uuid()')),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('contact_person', sa.String(100)),
        sa.Column('email', sa.String(255)),
        sa.Column('phone', sa.String(20)),
        sa.Column('address', sa.Text),
        sa.Column('city', sa.String(100)),
        sa.Column('state', sa.String(100)),
        sa.Column('zip_code', sa.String(20)),
        sa.Column('country', sa.String(100)),
        sa.Column('tax_id', sa.String(50)),
        sa.Column('payment_terms', sa.Integer(), server_default='30'),
        sa.Column('credit_limit', sa.Numeric(12, 2)),
        sa.Column('price_list_id', sa.UUID(as_uuid=True), sa.ForeignKey('price_lists.id')),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true')),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'))
    )


def downgrade():
    op.drop_table('customers')
    op.drop_table('price_lists')
