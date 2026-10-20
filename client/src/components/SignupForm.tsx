import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { User, PlayerSignup, PickupGame } from "../types"
import { POSITIONS } from "../constants.ts"


interface OutletContext {
    user: User
    currentGame: PickupGame
    updateGameAttendees: (newGame: PickupGame) => void
    addNewSignup: (newSignup: PlayerSignup) => void
}

function SignupForm() {
    const { user, currentGame, updateGameAttendees, addNewSignup } = useOutletContext<OutletContext>()

    const [signupName, setSignupName] = useState('')
    const [position, setPosition] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    function handleSignupName(e: React.ChangeEvent<HTMLInputElement>) {
        setSignupName(e.target.value)
    }

    function handlePosition(e: React.ChangeEvent<HTMLSelectElement>) {
        setPosition(e.target.value)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setSubmitted(false)

        if (signupName === '') {
            setError('Name is required')
            return
        }
        if (position === '') {
            setError('Pick a preferred position')
            return
        }
        if (!currentGame) {
            setError('No game selected. Go back to the game list and pick one.')
            return
        }

        try {
            const responseOne = await fetch('/player_signups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: signupName,
                    preferred_position: position,
                    user_id: user.id,
                    pickup_game_id: currentGame.id
                })
            })
            const data = await responseOne.json()
            if (!responseOne.ok) {
                setError(data.error || `Signup failed (status ${responseOne.status})`)
                return
            }

            addNewSignup(data)
            updateGameAttendees({ ...currentGame, total_attendees: data.pickup_game.total_attendees })
            setSubmitted(true)
            setSignupName('')
            setPosition('')

        } catch (err) {
            console.error('Error:', err)
            setError('Could not reach the server. Please try again.')
        }
    }

    return (
        <div className="create-game-form">
            <h4>Signup Form</h4>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type='text' name='name' value={signupName} onChange={handleSignupName}></input>
                </div>
                <div>
                    <label>Preferred Position</label>
                    <select name='position' value={position} onChange={handlePosition}>
                        <option value=''>Select a position</option>
                        {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                {error ? <p style={{ color: 'red' }}>{error}</p> : null}
                <button className='submit-button green' type='submit'>Register</button>
            </form>
            {submitted ? <p>Signup Complete!</p> : null}
        </div>
    )
}

export default SignupForm