"""Add profile_type to contractor_profiles

Revision ID: 74f18878f08c
Revises: d9f8802620c1
Create Date: 2025-07-07 14:30:10.899312

"""
from typing import Sequence, Union
import app.core.types

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '74f18878f08c'
down_revision: Union[str, Sequence[str], None] = 'd9f8802620c1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Add the column as nullable
    op.add_column(
        "contractor_profiles",
        sa.Column(
            "profile_type",
            sa.Enum("contractor", "company", name="profiletype", native_enum=False),
            nullable=True,
        ),
    )
    # 2. Set a default for existing records
    op.execute("UPDATE contractor_profiles SET profile_type = 'contractor' WHERE profile_type IS NULL")
    # 3. Make the column non-nullable
    op.alter_column("contractor_profiles", "profile_type", nullable=False)

    # ### end Alembic commands ###

def downgrade() -> None:
    # Revert quotations.user_id type changes
    op.alter_column(
        'quotations',
        'user_id',
        existing_type=sa.UUID(),
        type_=sa.String(),
        existing_nullable=False,
        postgresql_using="user_id::text"
    )
    op.alter_column('contractor_profiles', 'website_url',
               existing_type=app.core.types.HttpUrlType(length=2083),
               type_=sa.VARCHAR(length=500),
               existing_nullable=True)
    # Drop the profile_type column in contractor_profiles
    op.drop_column('contractor_profiles', 'profile_type')

    # Finally, drop the enum type from the database
    op.execute("DROP TYPE IF EXISTS profiletype")

