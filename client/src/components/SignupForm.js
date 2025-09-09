import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function SignupForm() {
    const { user, currentGame, updateGameAttendees, addNewSignup } = useOutletContext()

    const [signupName, setSignupName] = useState('')
    const [position, setPosition] = useState('')
    const [submitted, setSubmitted] = useState(false)

    function handleSignupName(e) {
        setSignupName(e.target.value)
    }

    function handlePosition(e) {
        setPosition(e.target.value)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (signupName === '') {
            alert('Name is required')
        } else {
            try {
                const responseOne = await fetch('/player_signups', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: signupName,
                        preferred_position: position,
                        user_id: user.id,
                        pickup_game_id: currentGame?.id
                    })
                })
                if (!responseOne.ok) {
                    throw new Error(`Failed to create new signup. Status code: ${responseOne.status}`)
                }
                const newSignup = await responseOne.json()
                addNewSignup(newSignup)
                setSubmitted(true)
                try {
                    const responseTwo = await fetch(`/pickup_games/${currentGame?.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            total_attendees: currentGame?.total_attendees + 1
                        })
                    })
                    if (responseTwo.ok) {
                        const newGame = await responseTwo.json()
                        updateGameAttendees(newGame)
                    } else {
                        throw new Error(`Error updating attendance number. Status code: ${responseTwo.status}`)
                    }
                } catch (err) {
                    console.error('Error:', err)
                }
            } catch (error) {
                console.error('Error:', error)
                alert('Sorry, signup was unsuccessful. Please try again')
            } finally {
                setSignupName('')
                setPosition('')
            }
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
                    <input type='text' name='position' value={position} onChange={handlePosition}></input>
                </div>
                <button className='submit-button green' type='submit'>Register</button>
            </form>
            {submitted ? <p>Signup Complete!</p> : null}
        </div>
    )
}

export default SignupForm