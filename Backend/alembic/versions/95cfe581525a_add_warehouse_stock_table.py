"""Add warehouse_stock table

Revision ID: 95cfe581525a
Revises: 0abf36205b5a
Create Date: 2025-07-19 12:19:26.804880

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '95cfe581525a'
down_revision: Union[str, Sequence[str], None] = '0abf36205b5a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
