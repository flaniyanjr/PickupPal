import { useOutletContext } from "react-router-dom";
import { useState } from "react";

function CreatedGameCard({ gameObj }) {
    const { location, city, state, date, time, sport, image, total_attendees, id } = gameObj

    const { deleteNewGame, allGames, updateNewGame, userSignups, removeSignup } = useOutletContext()

    const [newDate, setNewDate] = useState(date)
    const [newTime, setNewTime] = useState(time)
    const [showUpdate, setShowUpdate] = useState(false)
    const [submitted, setSubmitted] = useState(false)

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

    function handleDateChange(e) {
        setNewDate(e.target.value)
    }

    function handleTimeChange(e) {
        setNewTime(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault()
        fetch(`/pickup_games/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: newDate,
                time: newTime
            })
        })
            .then(r => r.json())
            .then(newGame => updateNewGame(newGame))
        setSubmitted(true)
        setShowUpdate(false)
    }

    function handleShowUpdate() {
        setShowUpdate(current => !current)
        setSubmitted(false)
    }

    const targetAttendeeArray = allGames.filter(game => {
        return game.id === id
    })
    const targetAttendeeGame = targetAttendeeArray[0]
    const targetAttendeeTotal = targetAttendeeGame.total_attendees

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
                    <button className='submit-button green' type='submit'>Submit</button>
                </form>
                : null}

        </div>
    )
}

export default CreatedGameCard