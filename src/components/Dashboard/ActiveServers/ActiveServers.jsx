import styles from './ActiveServers.module.css'
import ServerBox from './ServerBox/ServerBox.jsx'

function ActiveServers(){
    //Заменить на запрос из бд
    const data = [
        {img: 'src/assets/ubuntu.svg', name: 'MineCraftServer', cpu: '11%', ram: '32%', hdd: '44%'},
        {img: 'src/assets/debian.svg', name: 'MyWebsite', cpu: '50%', ram: '25%', hdd: '15%'},
        {img: 'src/assets/winserver.svg', name: 'asfger_asd111', cpu: '45%', ram: '15%', hdd: '86%'}
    ]
    return(
        <div className={styles.div}>
            <ServerBox data={data}/>
        </div>
    )
}

export default ActiveServers