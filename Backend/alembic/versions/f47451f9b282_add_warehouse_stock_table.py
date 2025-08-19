"""Add warehouse_stock table

Revision ID: f47451f9b282
Revises: cea33f6710ea
Create Date: 2025-07-18 19:39:09.312347

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import uuid

# revision identifiers, used by Alembic.
revision: str = 'f47451f9b282'
down_revision: Union[str, Sequence[str], None] = 'cea33f6710ea'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    pass
   

def downgrade():
    pass
