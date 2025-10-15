import { useNavigate, useOutletContext } from "react-router-dom"
import { useState } from 'react'
import { PickupGame } from "../types"

interface GameCardProps {
    gameObj: PickupGame
}

interface OutletContext {
    setCurrentGame: (game: PickupGame) => void
}

function GameCard({ gameObj }: GameCardProps) {
    const { location, city, state, date, time, sport, image, total_attendees, id } = gameObj

    const { setCurrentGame } = useOutletContext<OutletContext>()

    const navigate = useNavigate()

    return (
        <div className="card">
            <h2>{location}</h2>
            <img className="location-image" src={image} alt={location} />
            <div>
                <p>City: {city}</p>
                <p> State: {state}</p>
                <p> Date: {date}</p>
                <p> Time: {time}</p>
                <p> Sport: {sport}</p>
                <p> Total Attendees: {total_attendees}</p>
            </div>
            <button className='submit-button green' onClick={() => {
                setCurrentGame(gameObj)
                navigate('/signup-form')
            }}>Register</button>
        </div>
    )
}

export default GameCard