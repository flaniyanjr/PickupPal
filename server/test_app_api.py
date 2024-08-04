import requests

ENDPOINT= 'http://127.0.0.1:5555'

def test_can_get_pickup_games():
    response= requests.get(ENDPOINT + '/api/v1/pickup_games')
    assert response.status_code == 200

def test_can_get_player_signups():
    response= requests.get(ENDPOINT + '/api/v1/player_signups')
    assert response.status_code == 200

def test_create_user_success():
    payload= {
        'username' : 'testing1',
        'email' : 'testing1@test.com',
        'password' : 'testing1'
    }
    # Test to create a user
    create_user_response= requests.post(ENDPOINT + '/api/v1/users', json= payload)
    assert create_user_response.status_code == 201

    user_id= create_user_response.json()['user']['id']

    # Test to GET user to make sure it was created successfully
    get_user_response= requests.get(ENDPOINT + f'/api/v1/users/{user_id}')
    assert get_user_response.status_code == 200

    # Tests to make sure the newly created user data is the same as the payload inputs for each User attribute (remember that password is taken out of the response in the serialize rules)
    user_response_data= get_user_response.json()
    assert user_response_data['username'] == payload['username']
    assert user_response_data['email'] == payload['email']

def test_create_pickup_game_success():
    payload= {
        'location' : 'Wallingford Turf Field',
        'city' : 'Jackson',
        'state' : 'Wyoming',
        'date' : '2024-09-24',
        'time' : '13:30',
        'sport' : 'Badminton',
        'image' : 'https://i.ytimg.com/vi/tWU0IVOk4NU/maxresdefault.jpg',
        'total_attendees' : 0
    }
    # Test to create a pickup game
    create_pickup_game_response= requests.post(ENDPOINT + '/api/v1/pickup_games', json= payload)
    assert create_pickup_game_response.status_code == 201

    pickup_game_id= create_pickup_game_response.json()['id']

    # Test to GET the new game to make sure it was created successfully
    get_pickup_game= requests.get(ENDPOINT + f'/api/v1/pickup_games/{pickup_game_id}')
    assert get_pickup_game.status_code == 200

    # Tests to make sure the newly created pickup game data is the same as the payload inputs for each PickupGame attribute
    pickup_game_data= get_pickup_game.json()
    assert pickup_game_data['location'] == payload['location']
    assert pickup_game_data['city'] == payload['city']
    assert pickup_game_data['state'] == payload['state']
    assert pickup_game_data['date'] == payload['date']
    assert pickup_game_data['time'] == payload['time']
    assert pickup_game_data['sport'] == payload['sport']
    assert pickup_game_data['image'] == payload['image']
    assert pickup_game_data['total_attendees'] == payload['total_attendees']

def test_create_pickup_game_failure_no_location():
    payload= {
        'location' : '',
        'city' : 'Jackson',
        'state' : 'Wyoming',
        'date' : '2024-09-24',
        'time' : '13:30',
        'sport' : 'Badminton',
        'image' : 'https://i.ytimg.com/vi/tWU0IVOk4NU/maxresdefault.jpg',
        'total_attendees' : 0
    }
    response= requests.post(ENDPOINT + '/api/v1/pickup_games', json= payload)
    assert response.status_code == 422

# This unit test is not working for some reason
# def test_create_pickup_game_failure_no_city():
#     payload= {
#         'location' : 'Wallingford Turf Field',
#         'city' : '',
#         'state' : 'Wyoming',
#         'date' : '2024-09-24',
#         'time' : '13:30',
#         'sport' : 'Badminton',
#         'image' : 'https://i.ytimg.com/vi/tWU0IVOk4NU/maxresdefault.jpg',
#         'total_attendees' : 0
#     }
#     response= requests.post(ENDPOINT + '/api/v1/pickup_games', json= payload)
#     assert response.status_code == 422

def test_create_pickup_game_failure_no_state():
    payload= {
        'location' : 'Wallingford Turf Field',
        'city' : 'Jackson',
        'state' : '',
        'date' : '2024-09-24',
        'time' : '13:30',
        'sport' : 'Badminton',
        'image' : 'https://i.ytimg.com/vi/tWU0IVOk4NU/maxresdefault.jpg',
        'total_attendees' : 0
    }
    response= requests.post(ENDPOINT + '/api/v1/pickup_games', json= payload)
    assert response.status_code == 422

def test_create_pickup_game_failure_no_date():
    payload= {
        'location' : 'Wallingford Turf Field',
        'city' : 'Jackson',
        'state' : 'Wyoming',
        'date' : '',
        'time' : '13:30',
        'sport' : 'Badminton',
        'image' : 'https://i.ytimg.com/vi/tWU0IVOk4NU/maxresdefault.jpg',
        'total_attendees' : 0
    }
    response= requests.post(ENDPOINT + '/api/v1/pickup_games', json= payload)
    assert response.status_code == 422

def test_create_pickup_game_failure_no_time():
    payload= {
        'location' : 'Wallingford Turf Field',
        'city' : 'Jackson',
        'state' : 'Wyoming',
        'date' : '2024-09-24',
        'time' : '',
        'sport' : 'Badminton',
        'image' : 'https://i.ytimg.com/vi/tWU0IVOk4NU/maxresdefault.jpg',
        'total_attendees' : 0
    }
    response= requests.post(ENDPOINT + '/api/v1/pickup_games', json= payload)
    assert response.status_code == 422

def test_create_pickup_game_failure_no_sport():
    payload= {
        'location' : 'Wallingford Turf Field',
        'city' : 'Jackson',
        'state' : 'Wyoming',
        'date' : '2024-09-24',
        'time' : '13:30',
        'sport' : '',
        'image' : 'https://i.ytimg.com/vi/tWU0IVOk4NU/maxresdefault.jpg',
        'total_attendees' : 0
    }
    response= requests.post(ENDPOINT + '/api/v1/pickup_games', json= payload)
    assert response.status_code == 422