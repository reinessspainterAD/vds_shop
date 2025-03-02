import styles from './ServerBox.module.css';

function ServerBox({ data }) {
    return (
        <div className={styles.serverbox}>
            <h2>Активные сервера</h2>
            {data.map((item, index) => {
                return (
                    <div className={styles.serveritem} key={index}>
                        <img src={item.img} alt="img" />
                        <p>{item.name}</p>
                        <div className={styles.props}>
                            <div className={styles.cpu}>
                                {/* <img src="" alt="" /> */}
                                {item.cpu}
                            </div>
                            <div className={styles.ram}>
                                {/* <img src="" alt="" /> */}
                                {item.ram}
                            </div>
                            <div className={styles.hdd}>
                                {/* <img src="" alt="" /> */}
                                {item.hdd}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ServerBox;