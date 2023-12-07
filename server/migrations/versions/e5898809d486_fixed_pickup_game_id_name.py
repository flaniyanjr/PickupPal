"""fixed pickup_game_id name

Revision ID: e5898809d486
Revises: d1e889cecb31
Create Date: 2023-12-06 11:56:41.690993

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e5898809d486'
down_revision = 'd1e889cecb31'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('player_signups', schema=None) as batch_op:
        batch_op.add_column(sa.Column('pickup_game_id', sa.Integer(), nullable=True))
        batch_op.drop_constraint('fk_player_signups_pickup_game__id_pickup_games', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_player_signups_pickup_game_id_pickup_games'), 'pickup_games', ['pickup_game_id'], ['id'])
        batch_op.drop_column('pickup_game__id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('player_signups', schema=None) as batch_op:
        batch_op.add_column(sa.Column('pickup_game__id', sa.INTEGER(), nullable=True))
        batch_op.drop_constraint(batch_op.f('fk_player_signups_pickup_game_id_pickup_games'), type_='foreignkey')
        batch_op.create_foreign_key('fk_player_signups_pickup_game__id_pickup_games', 'pickup_games', ['pickup_game__id'], ['id'])
        batch_op.drop_column('pickup_game_id')

    # ### end Alembic commands ###
