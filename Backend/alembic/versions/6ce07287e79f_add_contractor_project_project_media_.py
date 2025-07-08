"""Add contractor, project, project_media tables

Revision ID: 6ce07287e79f
Revises: 4f6184fe091a
Create Date: 2025-07-02 18:43:56.474468
"""
from alembic import op
import sqlalchemy as sa

revision = '6ce07287e79f'
down_revision = '4f6184fe091a'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Drop existing FK constraint so we can change the type
    op.drop_constraint(
        "fk_quotations_user_id_users",
        "quotations",
        type_="foreignkey"
    )
    # Change column type and cast existing values to UUID
    op.execute(
        "ALTER TABLE quotations ALTER COLUMN user_id TYPE UUID USING user_id::uuid;"
    )
    # Recreate the FK constraint matching the UUID type
    op.create_foreign_key(
        "fk_quotations_user_id_users",
        "quotations",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE"
    )

def downgrade() -> None:
    # Drop the new FK constraint
    op.drop_constraint(
        "fk_quotations_user_id_users",
        "quotations",
        type_="foreignkey"
    )
    # Revert column back to VARCHAR and cast UUID values to text
    op.execute(
        "ALTER TABLE quotations ALTER COLUMN user_id TYPE VARCHAR USING user_id::text;"
    )
    # Recreate the FK constraint with the VARCHAR type
    op.create_foreign_key(
        "fk_quotations_user_id_users",
        "quotations",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE"
    )
