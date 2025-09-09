#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, PlayerSignup, PickupGame

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        User.query.delete()
        PlayerSignup.query.delete()
        PickupGame.query.delete()

        print('Creating Users')
        user1= User(username= 'swalker', email= 'swalker@gmail.com', password_hash= 'steve')
        user2= User(username= 'felixl', email= 'felixl@felix.com', password_hash= 'felix')

        db.session.add_all([user1, user2])
        db.session.commit()

        print('Creating Pickup Games')
        game1= PickupGame(location= 'Maryland Sports Arena', city= 'Edgewood', state= 'MD', date= '2024-12-23', time= '19:30', sport= 'Soccer', image= 'https://s3-media0.fl.yelpcdn.com/bphoto/jMgAm9iujApYifv5yHTglQ/1000s.jpg', total_attendees= 32)

        game2= PickupGame(location= 'Rucker Park', city= 'New York', state= 'NY', date= '2025-01-01', time= '00:01', sport= 'Basketball', image= 'https://static.nycgovparks.org/images/photo_gallery/full_size/24848.jpg', total_attendees= 212)

        game3= PickupGame(location= 'The Sandlot', city= 'Los Angeles', state= 'CA', date= '2024-11-13', time= '14:00', sport='Baseball', image= 'https://i2.wp.com/jacobbarlow.com/wp-content/uploads/2019/05/Screenshot-2019-03-18-23.10.05.png?fit=529%2C285&ssl=1', total_attendees= 23)

        game4= PickupGame(location= 'Venice Beach Courts', city= 'Los Angeles', state= 'CA', date= '2024-12-28', time= '13:00', sport= 'Basketball', image= 'https://i.pinimg.com/originals/d9/7f/1d/d97f1d658ed51fd2b3bca996cacfb2dc.jpg', total_attendees= 51)

        game5= PickupGame(location= 'Met Oval Field', city= 'New York', state= 'NY', date= '2024-10-12', time= '10:00', sport= 'Soccer', image= 'https://images.squarespace-cdn.com/content/v1/515e1bace4b0bca14d7a6ed3/1589414655900-A3UKH3L0A9HL2RUWYOOV/IMG_7929+2.jpg?format=1000w', total_attendees= 42)

        game6= PickupGame(location= 'The Backyard Rink', city= 'Saint Paul', state= 'MN', date= '2024-09-24', time= '13:30', sport= 'Hockey', image= 'https://ezicerinks.com/cdn/shop/files/EZ_ICE_PRO_Home_Arena_System_1600x900_45cf916a-68aa-4883-a760-fc4632362bce.jpg?v=1630506824&width=2048', total_attendees= 102)

        game7= PickupGame(location= 'Clothier Field', city= 'Swarthmore', state= 'PA', date= '2024-09-22', time= '14:45', sport= 'Soccer', image= 'https://pbs.twimg.com/media/E5S3mB1WYAEJI90?format=jpg&name=4096x4096', total_attendees= 18)

        game8= PickupGame(location= 'Cardozo High School', city='Washington', state= 'DC', date= '2024-12-29', time= '11:00', sport= 'Football', image= 'https://live.staticflickr.com/5111/7157491064_36143f512c_b.jpg', total_attendees= 22)

        game9= PickupGame(location= 'Dyckman Park', city= 'New York', state= 'NY', date= '2024-09-14', time= '21:00', sport= 'Basketball', image= 'https://i0.wp.com/www.thecity.nyc/wp-content/uploads/2023/09/061224_dyckman_basketball_game_1-scaled.jpg?resize=1536%2C1024&ssl=1', total_attendees= 450)

        game10= PickupGame(location= 'Stanley Butler Softball Field', city= 'Cleveland', state= 'TN', date= '2024-08-30', time= '10:30', sport= 'Softball', image= 'https://leeuflames.com/images/2015/11/4//Softball%20Facility%202_038.jpg', total_attendees= 21)

        game11= PickupGame(location= 'Marywood Track', city= 'Columbus', state= 'OH', date= '2024-11-28', time='08:00', sport='Running', image= 'https://www.penrithcity.nsw.gov.au/images/PCC_Harold_Corr_oval%2061.jpg', total_attendees= 14)

        game12= PickupGame(location= "St. Paul's School", city= 'Baltimore', state= 'MD', date= '2024-12-27', time= '10:30', sport= 'Lacrosse', image= 'https://www.brockusa.com/wp-content/uploads/2022/08/St_Pauls_Stadium_Field-2022-6-1-scaled-1.jpg', total_attendees= 42)

        db.session.add_all([game1, game2, game3, game4, game5, game6, game7, game8, game9, game10, game11, game12])
        db.session.commit()

        signup1= PlayerSignup(name= 'Steve Walker', preferred_position= 'Center', user= user1, pickup_game= game2)
        signup2= PlayerSignup(name= 'Felix Laniyan', preferred_position= 'Defender', user= user2, pickup_game= game1)
        signup3= PlayerSignup(name= 'Felix Laniyan', preferred_position= 'Point Guard', user= user2, pickup_game= game4)
        signup4= PlayerSignup(name= 'Felix Laniyan', preferred_position= 'Running Back', user= user2, pickup_game= game8)

        db.session.add_all([signup1, signup2, signup3, signup4])
        db.session.commit()

        print('Creating Player Signups')

        print('Finished seeding')
