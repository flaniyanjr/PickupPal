import { useOutletContext } from "react-router-dom";
import { useState } from 'react'
import CreatedGameCard from "./CreatedGameCard.tsx";
import sportlogo4 from "../img/sportlogo4.jpg"
import sportlogo5 from "../img/sportlogo5.jpeg"
import { User, PickupGame } from "../types"
import { FORMATS, DEFAULT_FORMAT, minPlayers } from "../constants.ts"

interface GameFormData {
    location: string
    city: string
    state: string
    date: string
    time: string
    format: string
    max_players: string
    image: string
}

interface OutletContext {
    addNewGame: (game: PickupGame) => void
    createdGames: PickupGame[]
    user: User | null
}

function CreateGame() {

    const initialState: GameFormData = {
        location: '',
        city: '',
        state: '',
        date: '',
        time: '',
        format: DEFAULT_FORMAT,
        max_players: String(minPlayers(DEFAULT_FORMAT)),
        image: ''
    }

    const [gameData, setGameData] = useState<GameFormData>(initialState)
    const [error, setError] = useState<string>('')
    const { addNewGame, createdGames, user } = useOutletContext<OutletContext>()

    const currentDate = new Date()
    let day = currentDate.getDate().toString().padStart(2, '0')
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const year = currentDate.getFullYear()

    const today = `${year}-${month}-${day}`

    let createdGameCards

    if (createdGames) {
        createdGameCards = createdGames.map(gameObj => {
            return <CreatedGameCard key={gameObj.id} gameObj={gameObj} />
        })
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setGameData(current => {
            return { ...current, [e.target.name]: e.target.value }
        })
    }

    function handleFormatChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newFormat = e.target.value
        setGameData(current => {
            return {
                ...current,
                format: newFormat,
                max_players: String(minPlayers(newFormat))
            }
        })
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')

        if (
            gameData.location === '' ||
            gameData.city === '' ||
            gameData.state === '' ||
            gameData.date === '' ||
            gameData.time === ''
        ) {
            setError('Venue, city, state, date and time are required')
            return
        }

        const maxPlayers = Number(gameData.max_players)
        const minAllowed = minPlayers(gameData.format)
        if (!Number.isInteger(maxPlayers) || maxPlayers < minAllowed) {
            setError(`A ${gameData.format} game needs at least ${minAllowed} players`)
            return
        }

        try {
            const response = await fetch('/pickup_games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...gameData,
                    max_players: maxPlayers,
                    sport: 'Soccer',
                    total_attendees: 0
                })
            })
            const data = await response.json()
            if (!response.ok) {
                setError(data.error || `Game creation failed (status ${response.status})`)
                return
            }
            addNewGame(data)
            setGameData(initialState)
        } catch (err) {
            console.error('Error submitting new game:', err)
            setError('Could not reach the server. Please try again.')
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
                                <option value=""></option>
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
                            <label>Format</label>
                            <select name="format" value={gameData.format} onChange={handleFormatChange}>
                                {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Max Players</label>
                            <input
                                type='number'
                                name='max_players'
                                min={minPlayers(gameData.format)}
                                max={30}
                                value={gameData.max_players}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Image URL (optional)</label>
                            <input type='text' name='image' value={gameData.image} onChange={handleChange} />
                        </div>
                        {error ? <p style={{ color: 'red' }}>{error}</p> : null}
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