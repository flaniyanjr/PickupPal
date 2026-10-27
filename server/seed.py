#!/usr/bin/env python3
from app import app
from models import db, User, PlayerSignup, PickupGame

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")
        PlayerSignup.query.delete()
        PickupGame.query.delete()
        User.query.delete()
        db.session.commit()

        print('Creating Users')
        user1= User(username= 'swalker', email= 'swalker@gmail.com', password_hash= 'steve')
        user2= User(username= 'felixl', email= 'felixl@felix.com', password_hash= 'felix')
        db.session.add_all([user1, user2])
        db.session.commit()

        print('Creating Games')
        img_md= 'https://s3-media0.fl.yelpcdn.com/bphoto/jMgAm9iujApYifv5yHTglQ/1000s.jpg'
        img_met= 'https://images.squarespace-cdn.com/content/v1/515e1bace4b0bca14d7a6ed3/1589414655900-A3UKH3L0A9HL2RUWYOOV/IMG_7929+2.jpg?format=1000w'
        img_clothier= 'https://pbs.twimg.com/media/E5S3mB1WYAEJI90?format=jpg&name=4096x4096'
        img_cardozo= 'https://live.staticflickr.com/5111/7157491064_36143f512c_b.jpg'
        img_stpauls= 'https://www.brockusa.com/wp-content/uploads/2022/08/St_Pauls_Stadium_Field-2022-6-1-scaled-1.jpg'
        img_pier5= 'https://brooklynbridgepark.org/wp-content/uploads/2020/09/Brooklyn-Bridge-Park-Pier-5-soccer-turf-night-scaled-1.jpg'

        g1= PickupGame(location= 'Maryland Sports Arena', city= 'Edgewood', state= 'MD', date= '2026-11-07', time= '19:30', format= '7v7', max_players= 14, latitude= 39.442183611054446, longitude= -76.29068696153179, sport= 'Soccer', image= img_md, total_attendees= 1, creator_id= user1.id)
        g2= PickupGame(location= 'Met Oval Field', city= 'New York', state= 'NY', date= '2026-11-08', time= '10:00', format= '11v11', max_players= 22, latitude= 40.71482391336103, longitude= -73.90724763262628, sport= 'Soccer', image= img_met, total_attendees= 1, creator_id= user1.id)
        g3= PickupGame(location= 'Clothier Field', city= 'Swarthmore', state= 'PA', date= '2026-11-14', time= '14:45', format= '11v11', max_players= 22, latitude= 39.90038757886468, longitude= -75.35284817684943, sport= 'Soccer', image= img_clothier, total_attendees= 0, creator_id= user1.id)
        g4= PickupGame(location= 'Cardozo High School', city= 'Washington', state= 'DC', date= '2026-11-15', time= '11:00', format= '7v7', max_players= 14, latitude= 38.92121027501493, longitude= -77.02841533272408, sport= 'Soccer', image= img_cardozo, total_attendees= 1, creator_id= user2.id)
        g5= PickupGame(location= "Tullai Field", city= 'Brooklandville', state= 'MD', date= '2026-11-21', time= '09:00', format= '5v5', max_players= 10, latitude= 39.4270174815202, longitude= -76.67455464618992, sport= 'Soccer', image= img_stpauls, total_attendees= 0, creator_id= user2.id)
        g6= PickupGame(location= 'Pier 5', city= 'Brooklyn', state= 'NY', date= '2026-11-22', time= '16:00', format= '9v9', max_players= 18, latitude= 40.695031561704845, longitude= -74.00168528844902, sport= 'Soccer', image= img_pier5, total_attendees= 0, creator_id= user2.id)
        db.session.add_all([g1, g2, g3, g4, g5, g6])
        db.session.commit()

        print('Creating Player Signups')
        s1= PlayerSignup(name= 'Felix Laniyan', preferred_position= 'Defender', user= user2, pickup_game= g1)
        s2= PlayerSignup(name= 'Felix Laniyan', preferred_position= 'Midfielder', user= user2, pickup_game= g2)
        s3= PlayerSignup(name= 'Steve Walker', preferred_position= 'Forward', user= user1, pickup_game= g4)
        db.session.add_all([s1, s2, s3])
        db.session.commit()
        print('Finished seeding')
