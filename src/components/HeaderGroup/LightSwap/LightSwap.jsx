import styles from './LightSwap.module.css'
import Arrow from '../../../assets/LightBalb.svg'
import { useState, useEffect } from 'react';

function LightSwap(){
    const [darkMode, setDarkMode] = useState(() =>{
        return localStorage.getItem('theme') === 'dark';
    })

    useEffect(() => {
        if (darkMode) {
          document.body.classList.add('dark-mode');
          localStorage.setItem('theme', 'dark');
        } else {
          document.body.classList.remove("dark-mode");
          localStorage.setItem('theme', 'light');
        }
      }, [darkMode]);

    return(
        <div className={styles.lightSwap}>
            <button
                onClick={() => setDarkMode(!darkMode)}
            >
                <img src={Arrow} alt='LightBalb' />
            </button>
        </div>
    )
    
}

export default LightSwap