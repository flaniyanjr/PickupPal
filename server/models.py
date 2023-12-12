from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__= 'users'

    serialize_rules= ('-_password_hash', '-player_signups.user')

    id= db.Column(db.Integer, primary_key= True)
    username= db.Column(db.String)
    email= db.Column(db.String)
    _password_hash= db.Column(db.String)
    created_at= db.Column(db.DateTime, server_default=db.func.now())
    updated_at= db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    player_signups= db.relationship('PlayerSignup', back_populates= 'user', cascade= 'all, delete-orphan')

    pickup_games= association_proxy('player_signups', 'pickup_game')


    @property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        byte_object= password.encode('utf-8')
        encrypted_password_object= bcrypt.generate_password_hash(byte_object)
        self._password_hash= encrypted_password_object.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self.password_hash, password.encode('utf-8'))

class PickupGame(db.Model, SerializerMixin):
    __tablename__= 'pickup_games'

    serialize_rules= ('-player_signups.pickup_game',)

    id= db.Column(db.Integer, primary_key=True)
    location= db.Column(db.String)
    city= db.Column(db.String)
    state= db.Column(db.String)
    date= db.Column(db.String)
    time= db.Column(db.String)
    sport= db.Column(db.String)
    image= db.Column(db.String)
    total_attendees= db.Column(db.Integer)

    player_signups= db.relationship('PlayerSignup', back_populates= 'pickup_game', cascade= 'all, delete-orphan')

    users= association_proxy('player_signups', 'user')

    @validates('location')
    def validate_location(self, key, location):
        if not location:
            raise ValueError('Location is required')
        elif type(location) != str:
            raise ValueError('Location must be a string')
        return location
    
    @validates('city')
    def validate_city(self, key, city):
        if not city:
            raise ValueError('City is required')
        elif type(city) != str:
            raise ValueError('City must be a string')
        return city
    
    @validates('state')
    def validate_city(self, key, state):
        if not state:
            raise ValueError('State is required')
        elif type(state) != str:
            raise ValueError('State must be a string')
        return state

    @validates('date')
    def validate_date(self, key, date):
        if not date:
            raise ValueError('A date must be included')
        elif type(date) != str:
            raise ValueError('Date must be a string')
        return date
        
    @validates('time')
    def validate_time(self, key, time):
        if not time:
            raise ValueError('A time must be included')
        elif type(time) != str:
            raise ValueError('Time must be a string')
        return time
        
    @validates('sport')
    def validate_sport(self, key, sport):
        if not sport:
            raise ValueError('A sport must be included')
        elif type(sport) != str:
            raise ValueError('Sport must be a string')
        return sport
        
    @validates('image')
    def validate_image(self, key, image):
        if type(image) != str:
            raise ValueError('Image must be a string')
        return image


class PlayerSignup(db.Model, SerializerMixin):
    __tablename__= 'player_signups'

    serialize_rules= ('-user.player_signups', '-pickup_game.player_signups')

    id= db.Column(db.Integer, primary_key= True)
    name= db.Column(db.String)
    preferred_position= db.Column(db.String)
    user_id= db.Column(db.Integer, db.ForeignKey('users.id'))
    pickup_game_id= db.Column(db.Integer, db.ForeignKey('pickup_games.id'))

    user= db.relationship('User', back_populates= 'player_signups')
    pickup_game= db.relationship('PickupGame', back_populates= 'player_signups')

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError('Name must be included')
        elif type(name) != str:
            raise ValueError('Name must be a string')
        return name
    
    @validates('preferred_position')
    def validate_position(self, key, position):
        if type(position) != str:
            raise ValueError('Preferred position must be a string')
        return position
