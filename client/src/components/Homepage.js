import sportlogo3 from '../img/sportlogo3.jpg'
import sportlogo2 from '../img/sportlogo2.jpg'

function Homepage() {
    return(
        <div>
            <h1 className= 'welcome-message'>Welcome to PickupPal</h1>
            <div className= 'logo-three-image-containter'>
                <img id= 'logo-three' src={sportlogo3} alt='sports logo'/>
            </div>
            <div className= 'logo-two-image-container'>
                <img id= 'logo-two' src={sportlogo2} alt= 'sports logo'/>
            </div>
        </div>
    )
}

export default Homepage