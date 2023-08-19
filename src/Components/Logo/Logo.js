import react from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (
        <div className='ma3 mt0'>
            <Tilt style={{ height: '150px', width: '150px',
             backgroundColor: 'darkgreen' }} className='Tilt br2 shadow-2'>
                <div>
                  <h1 className='Tilt-inner pa3'><img style={{paddingTop: '5px'}}
                  alt='logo' src={brain}/></h1>
                </div>
            </Tilt>

        </div>
    )
}
 export default Logo;