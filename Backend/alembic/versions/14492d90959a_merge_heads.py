"""merge heads

Revision ID: 14492d90959a
Revises: 95cfe581525a, f47451f9b282
Create Date: 2025-07-19 12:24:59.759609

"""
from typing import Sequence, Union
import uuid
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '14492d90959a'
down_revision: Union[str, Sequence[str], None] = ('95cfe581525a', 'f47451f9b282')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    pass

def downgrade():
    pass
