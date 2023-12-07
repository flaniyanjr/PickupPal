import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function SignupForm() {
    const {user, currentGame, updateGameAttendees}= useOutletContext()

    const [signupName, setSignupName]= useState('')
    const [position, setPosition]= useState('')

    function handleSignupName(e) {
        setSignupName(e.target.value)
    }

    function handlePosition(e) {
        setPosition(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault()
        fetch('/player_signups', {
            method: 'POST', 
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                name: signupName,
                preferred_position: position,
                user_id: user.id,
                pickup_game_id: currentGame.gameObj.id
            })
        })
        .then(r => r.json())
        // fix this line below when you need to
        .then(new_signup => {console.log(new_signup)})
        fetch(`/pickup_games/${currentGame.gameObj.id}`, {
            method: 'PATCH',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                total_attendees: currentGame.gameObj.total_attendees + 1
            })
        })
        .then(r => r.json())
        .then(newGame => updateGameAttendees(newGame))
        setSignupName('')
        setPosition('')
    }


    return(
        <div className= "signup-form">
            <h4>Signup Form</h4>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type= 'text' name= 'name' value= {signupName} onChange= {handleSignupName}></input>
                </div>
                <div>
                    <label>Preferred Position</label>
                    <input type= 'text' name='position' value={position} onChange={handlePosition}></input>
                </div>
                <button type='submit'>Register</button>
            </form>
        </div>
    )
}

export default SignupForm