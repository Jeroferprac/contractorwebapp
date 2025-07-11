"""Add created_at to quotations

Revision ID: 02ac10e7921b
Revises: 3f9ca96fa0c5
Create Date: 2025-07-01 12:03:58.048696

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '02ac10e7921b'
down_revision: Union[str, Sequence[str], None] = '3f9ca96fa0c5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('quotations', sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('quotations', 'created_at')
    # ### end Alembic commands ###
