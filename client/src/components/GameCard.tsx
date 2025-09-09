import { useNavigate, useOutletContext } from "react-router-dom"
import { useState } from 'react'

interface Game {
    id: number
    location: string
    city: string
    state: string
    date: string
    time: string
    sport: string
    image: string
    total_attendees: number
}

interface GameCardProps {
    gameObj: Game
}

interface OutletContext {
    setCurrentGame: (game: Game) => void
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