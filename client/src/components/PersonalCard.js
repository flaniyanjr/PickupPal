import { useOutletContext } from "react-router-dom";

function PersonalCard({ gameObj }) {

    const { userSignups, removeSignup, allGames, updateGameAttendees } = useOutletContext()

    const { location, city, state, date, time, sport, image, total_attendees, id } = gameObj

    const targetSignupArray = userSignups.filter(signup => {
        if (signup.pickup_game.id === id) {
            return true
        } else {
            return false
        }
    })
    const targetSignup = targetSignupArray[0]


    const targetAttendeeArray = allGames.filter(game => {
        return game.id === id
    })
    const targetAttendeeGame = targetAttendeeArray[0]
    const targetAttendeeTotal = targetAttendeeGame.total_attendees

    async function handleDelete() {
        try {
            const responseOne = await fetch(`/player_signups/${targetSignup.id}`, {
                method: 'DELETE'
            })
            if (responseOne.ok) {
                removeSignup(targetSignup.id)
                const responseTwo = await fetch(`/pickup_games/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        total_attendees: targetAttendeeTotal - 1
                    })
                })
                if (responseTwo.ok) {
                    const newGame = await responseTwo.json()
                    updateGameAttendees(newGame)
                } else {
                    throw new Error(`Failed to decrease attendance number. Status: ${responseTwo.status}`)
                }
            } else {
                throw new Error(`Failed to delete signup. Status: ${responseOne.status}`)
            }
        } catch (error) {
            console.error('Error:', error)
        }

    }

    return (
        <div className='card'>
            <h2>{location}</h2>
            <img className="location-image" src={image} alt={location} />
            <div>
                <p> City: {city}</p>
                <p> State: {state}</p>
                <p> Date: {date}</p>
                <p> Time: {time}</p>
                <p> Sport: {sport}</p>
                <p> Total Attendees: {targetAttendeeTotal}</p>
            </div>
            <button className="submit-button red" onClick={handleDelete}>Unregister</button>
        </div>
    )
}

export default PersonalCard