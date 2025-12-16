import sportlogo3 from '../img/sportlogo3.jpg'
import sportlogo2 from '../img/sportlogo2.jpg'

function Homepage() {
    return (
        <div className='relative'>
            <div className='text-center'>
                <h3 className='welcome-message'>PickupPal</h3>
            </div>
            <div className='absolute top-[40px] left-5 h-[150px]'>
                <img className='max-w-[300%] max-h-[300%] opacity-100' src={sportlogo3} alt='sports logo' />
            </div>
            <div className='absolute top-[40px] right-5 h-[150px]'>
                <img className='max-w[300%] max-h-[300%] opacity-100' src={sportlogo2} alt='sports logo' />
            </div>
        </div>
    )
}

export default Homepage