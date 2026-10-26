import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { PlayerSignup, PickupGame } from "../types"

interface OutletContext {
    deleteNewGame: (id: number) => void
    updateNewGame: (game: PickupGame) => void
    allGames: PickupGame[]
    userSignups: PlayerSignup[]
    removeSignup: (id: number) => void
}

interface CreatedGameCardProps {
    gameObj: PickupGame
}

function CreatedGameCard({ gameObj }: CreatedGameCardProps) {

    const { location, city, state, date, time, sport, image, total_attendees, id } = gameObj

    const { deleteNewGame, allGames, updateNewGame, userSignups, removeSignup } = useOutletContext<OutletContext>()

    const [newDate, setNewDate] = useState<string>(date)
    const [newTime, setNewTime] = useState<string>(time)
    const [showUpdate, setShowUpdate] = useState<boolean>(false)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const currentGameSignupsArray = userSignups.filter(signup => {
        return signup.pickup_game_id === id
    })

    const currentGameSignup = currentGameSignupsArray[0]


    async function handleDelete() {
        try {
            const response = await fetch(`/pickup_games/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) {
                throw new Error(`Failed to delete game. Status Code: ${response.status}`)
            }
            deleteNewGame(id)
            if (currentGameSignup) {
                removeSignup(currentGameSignup.id)
            }
        } catch (error) {
            console.log('Error deleting game:', error)
        }
    }

    function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
        setNewDate(e.target.value)
    }

    function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setNewTime(e.target.value)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        try {
            const response = await fetch(`/pickup_games/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: newDate,
                    time: newTime
                })
            })
            const data = await response.json()
            if (!response.ok) {
                setError(data.error || `Update failed (status ${response.status})`)
                return
            }
            updateNewGame(data)
            setSubmitted(true)
            setShowUpdate(false)
        } catch (err) {
            console.error('Error updating game:', err)
            setError('Could not reach the server. Please try again.')
        }
    }

    function handleShowUpdate() {
        setShowUpdate(current => !current)
        setSubmitted(false)
    }

    const targetAttendeeArray = allGames.filter(game => {
        return game.id === id
    })
    const targetAttendeeGame = targetAttendeeArray[0]
    const targetAttendeeTotal = targetAttendeeGame?.total_attendees ?? 0

    const currentDate = new Date()
    const day = currentDate.getDate().toString().padStart(2, '0')
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const year = currentDate.getFullYear()

    const today = `${year}-${month}-${day}`

    return (
        <div className="card">
            <h2>{location}</h2>
            <img className="location-image submit-button" src={image} alt={location} onClick={handleShowUpdate} />
            <div>
                <p> City: {city}</p>
                <p> State: {state}</p>
                <p> Date: {date}</p>
                <p> Time: {time}</p>
                <p> Sport: {sport}</p>
                <p> Total Attendees: {targetAttendeeTotal}</p>
            </div>
            <button className='submit-button red' onClick={handleDelete}>Delete</button>
            {submitted ? <p>Updated!</p> : null}
            {showUpdate ?
                <form onSubmit={handleSubmit}>
                    <div>
                        <label id='update-date-text'>Update Date</label>
                        <input id='update-date-input' type='date' name='date' value={newDate} min={today} onChange={handleDateChange} />
                    </div>
                    <div>
                        <label id='update-time-text'>Update Time</label>
                        <input id='update-time-input' type='time' name='time' value={newTime} onChange={handleTimeChange} />
                    </div>
                    {error ? <p style={{ color: 'red' }}>{error}</p> : null}
                    <button className='submit-button green' type='submit'>Submit</button>
                </form>
                : null}

        </div>
    )
}

export default CreatedGameCard