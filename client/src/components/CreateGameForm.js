import { useOutletContext } from "react-router-dom";
import { useState } from 'react'
import CreatedGameCard from "./CreatedGameCard.tsx";
import sportlogo4 from "../img/sportlogo4.jpg"
import sportlogo5 from "../img/sportlogo5.jpeg"

function CreateGame() {

    const initialState = {
        location: '',
        city: '',
        state: '',
        date: '',
        time: '',
        sport: '',
        image: ''
    }

    const [gameData, setGameData] = useState(initialState)
    const { addNewGame, createdGames, user } = useOutletContext()

    const currentDate = new Date()
    let day = currentDate.getDate()
    let month = currentDate.getMonth() + 1
    const year = currentDate.getFullYear()

    if (day < 10) {
        day = '0' + day;
    }

    if (month < 10) {
        month = '0' + month;
    }

    const today = year + '-' + month + '-' + day;

    let createdGameCards

    if (createdGames) {
        createdGameCards = createdGames.map(gameObj => {
            return <CreatedGameCard key={gameObj.id} gameObj={gameObj} />
        })
    }

    function handleChange(e) {
        setGameData(current => {
            return { ...current, [e.target.name]: e.target.value }
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (
            gameData['location'] === '' ||
            gameData['city'] === '' ||
            gameData['state'] === '' ||
            gameData['date'] === '' ||
            gameData['time'] === ''
        ) {
            alert('All fields except for image are required')
        } else {
            try {
                const response = await fetch('/pickup_games', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...gameData, total_attendees: 0 })
                })
                if (!response.ok) {
                    throw new Error(`Failed to create game. Status: ${response.status}`)
                }
                const newGame = await response.json()
                addNewGame(newGame)
            } catch (error) {
                console.error('Error submitting new game:', error)
                alert('Sorry, game creation was unsuccessful. Please try again.')
            }
            setGameData(initialState)
        }
    }

    return (
        user ?
            <div>
                <div className="create-game-form">
                    <h4>Create a Game</h4>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Venue</label>
                            <input type='text' name='location' value={gameData.location} onChange={handleChange} />
                        </div>
                        <div>
                            <label>City</label>
                            <input type='text' name='city' value={gameData.city} onChange={handleChange} />
                        </div>
                        <div>
                            <label>State</label>
                            <select name="state" onChange={handleChange} value={gameData.state}>
                                <option value="" selected="selected" ></option>
                                <option value="AL">Alabama</option>
                                <option value="AK">Alaska</option>
                                <option value="AZ">Arizona</option>
                                <option value="AR">Arkansas</option>
                                <option value="CA">California</option>
                                <option value="CO">Colorado</option>
                                <option value="CT">Connecticut</option>
                                <option value="DE">Delaware</option>
                                <option value="DC">District of Columbia</option>
                                <option value="FL">Florida</option>
                                <option value="GA">Georgia</option>
                                <option value="HI">Hawaii</option>
                                <option value="ID">Idaho</option>
                                <option value="IL">Illinois</option>
                                <option value="IN">Indiana</option>
                                <option value="IA">Iowa</option>
                                <option value="KS">Kansas</option>
                                <option value="KY">Kentucky</option>
                                <option value="LA">Louisiana</option>
                                <option value="ME">Maine</option>
                                <option value="MD">Maryland</option>
                                <option value="MA">Massachusetts</option>
                                <option value="MI">Michigan</option>
                                <option value="MN">Minnesota</option>
                                <option value="MS">Mississippi</option>
                                <option value="MO">Missouri</option>
                                <option value="MT">Montana</option>
                                <option value="NE">Nebraska</option>
                                <option value="NV">Nevada</option>
                                <option value="NH">New Hampshire</option>
                                <option value="NJ">New Jersey</option>
                                <option value="NM">New Mexico</option>
                                <option value="NY">New York</option>
                                <option value="NC">North Carolina</option>
                                <option value="ND">North Dakota</option>
                                <option value="OH">Ohio</option>
                                <option value="OK">Oklahoma</option>
                                <option value="OR">Oregon</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="RI">Rhode Island</option>
                                <option value="SC">South Carolina</option>
                                <option value="SD">South Dakota</option>
                                <option value="TN">Tennessee</option>
                                <option value="TX">Texas</option>
                                <option value="UT">Utah</option>
                                <option value="VT">Vermont</option>
                                <option value="VA">Virginia</option>
                                <option value="WA">Washington</option>
                                <option value="WV">West Virginia</option>
                                <option value="WI">Wisconsin</option>
                                <option value="WY">Wyoming</option>
                            </select>
                        </div>
                        <div>
                            <label>Date</label>
                            <input type='date' name='date' value={gameData.date} min={today} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Time</label>
                            <input type='time' name='time' value={gameData.time} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Sport</label>
                            <input type='text' name='sport' value={gameData.sport} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Image</label>
                            <input type='text' name='image' value={gameData.image} onChange={handleChange} />
                        </div>
                        <button className='submit-button green' type='submit'>Create</button>
                    </form>
                    <div className='logo-four-image-containter'>
                        <img id='logo-four' src={sportlogo4} alt='tennis sports logo' />
                    </div>
                    <div className='logo-five-image-containter'>
                        <img id='logo-five' src={sportlogo5} alt='tennis sports logo' />
                    </div>
                </div>
                {createdGameCards}
            </div>
            :
            <h1 className="required-login-message">Login required to access this page </h1>
    )
}

export default CreateGame