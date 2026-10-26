import { useOutletContext } from "react-router-dom";
import { PlayerSignup, PickupGame } from "../types"

interface PersonalCardProps {
    gameObj: PickupGame
}

interface OutletContext {
    userSignups: PlayerSignup[]
    removeSignup: (id: number) => void
    allGames: PickupGame[]
    updateGameAttendees: (newGame: PickupGame) => void
}

function PersonalCard({ gameObj }: PersonalCardProps) {

    const { userSignups, removeSignup, allGames, updateGameAttendees } = useOutletContext<OutletContext>()

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
    const targetAttendeeTotal = targetAttendeeGame?.total_attendees ?? 0

    async function handleDelete() {
        if (!targetSignup) return
        try {
            const response = await fetch(`/player_signups/${targetSignup.id}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw new Error(`Failed to delete signup. Status: ${response.status}`)
            }
            removeSignup(targetSignup.id)

            const gameResponse = await fetch(`/pickup_games/${id}`)
            if (gameResponse.ok) {
                const updatedGame = await gameResponse.json()
                updateGameAttendees(updatedGame)
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