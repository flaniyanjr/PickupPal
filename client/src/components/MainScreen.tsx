import Signup from "./Signup.tsx"
import Homepage from "./Homepage.tsx"
import { useOutletContext } from "react-router-dom"
import { User } from "../types"

interface OutletContext {
    user: User
}

function MainScreen() {
    const { user } = useOutletContext<OutletContext>()

    return (
        user ? <Homepage /> : <Signup />
    )
}

export default MainScreen