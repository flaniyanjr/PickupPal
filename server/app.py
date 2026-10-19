#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, PickupGame, PlayerSignup



class Users(Resource):
    def get(self):
        users_list= [user.to_dict() for user in User.query.all()]
        return make_response(users_list, 200)

    def post(self):
        params= request.json
        try:
            user= User(username= params['username'], email= params['email'], password_hash= params['password'])
        except ValueError as validation_error:
            return make_response({'error' : str(validation_error)}, 422)
        db.session.add(user)
        db.session.commit()
        session['user_id']= user.id
        return make_response({'user': user.to_dict()}, 201)

api.add_resource(Users, '/api/v1/users')

class UsersById(Resource):
    def get(self, id):
        user= User.query.get(id)
        if not user:
            return make_response({'error' : 'User not found'}, 404)
        return make_response(user.to_dict(), 200)

api.add_resource(UsersById, '/api/v1/users/<int:id>')

class PickupGames(Resource):
    def get(self):
        games_list= [game.to_dict() for game in PickupGame.query.all()]
        return make_response(games_list, 200)
    
    def post(self):
        user_id= session.get('user_id')
        if not user_id:
            return make_response({'error': 'Login required'}, 401)
        params= request.json
        try:
            new_game= PickupGame(location= params['location'], city= params['city'], state= params['state'], date= params['date'], time= params['time'], format= params.get('format', '7v7'), max_players= params.get('max_players', 14), latitude= params.get('latitude'), longitude= params.get('longitude'), sport= params['sport'], image= params['image'], total_attendees= params['total_attendees'], creator_id= user_id,)
        except ValueError as validation_error:
            return make_response({'error': str(validation_error)}, 422)
        except KeyError as key_error:
            return make_response({'error': f'A {key_error} must be included'}, 422)
        db.session.add(new_game)
        db.session.commit()
        return make_response(new_game.to_dict(), 201)

api.add_resource(PickupGames, '/api/v1/pickup_games')

class PickupGamesById(Resource):
    def get(self, id):
        game= PickupGame.query.get(id)
        if not game:
            return make_response({'error' : 'Pickup game not found'}, 404)
        return make_response(game.to_dict(), 200)

    def patch(self, id):
        params= request.json
        game= PickupGame.query.get(id)
        if not game:
            return make_response({'error': 'Pickup game not found'}, 404)
        for attr in params:
            try:
                setattr(game, attr, params[attr])
            except ValueError as validation_error:
                return make_response({'error': str(validation_error)}, 422)
        db.session.commit()
        return make_response(game.to_dict(), 200)
    
    def delete(self, id):
        game= PickupGame.query.get(id)
        db.session.delete(game)
        db.session.commit()
        return make_response('', 204)

api.add_resource(PickupGamesById, '/api/v1/pickup_games/<int:id>')

class PlayerSignups(Resource):
    def get(self):
        signup_list= [signup.to_dict() for signup in PlayerSignup.query.all()]
        return make_response(signup_list, 200)

    def post(self):
        params= request.json
        try:
            new_signup= PlayerSignup(name= params['name'], preferred_position= params['preferred_position'], user_id= params['user_id'], pickup_game_id= params['pickup_game_id'])
        except ValueError as validation_error:
            return make_response({'error': str(validation_error)}, 422)
        except KeyError as key_error:
            return make_response({'error': f'A {key_error} must be included'}, 422)
        db.session.add(new_signup)
        db.session.commit()
        return make_response(new_signup.to_dict(), 201)

api.add_resource(PlayerSignups, '/api/v1/player_signups')

class PlayerSignupsById(Resource):
    def get(self, id):
        signup= PlayerSignup.query.get(id)
        if not signup:
            return make_response({'error' : 'Player signup not found'})
        return make_response(signup.to_dict(), 200)

    def delete(self, id):
        signup= PlayerSignup.query.get(id)
        db.session.delete(signup)
        db.session.commit()
        return make_response('', 204)

api.add_resource(PlayerSignupsById, '/api/v1/player_signups/<int:id>')

@app.route('/api/v1/authorized')
def authorized():
    try:
        user= User.query.filter_by(id=session.get('user_id')).first()
        return make_response(user.to_dict(), 200)
    except:
        return make_response({'error': 'User not found'}, 404)
    
@app.route('/api/v1/logout', methods=['DELETE'])
def logout():
    session['user_id']= None
    return make_response('', 204)

@app.route('/api/v1/login', methods=['POST'])
def login():
    params= request.json
    try:
        user= User.query.filter_by(username= params['username']).first()
        password= params['password']
        if user.authenticate(password):
            session['user_id']= user.id
            return make_response({'user': user.to_dict()}, 200)
        else:
            return make_response({'error': 'incorrect password'}, 400)
    except:
        return make_response({'error': 'username incorrect'}, 401)


if __name__ == '__main__':
    app.run(port=5555, debug=True)

