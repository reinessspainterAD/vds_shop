import styles from './HowItWorks.module.css'

function HowItWorks(){
    return(
        <div className={styles.howItWorks}>
            <h2>Как это <br />работает?</h2>
            <div className={styles.leftSide}>
                <img src="src/assets/HIT1.svg" alt="HIT1" />
                <p>1. Зарегистрируйтесь, это можно сделать <br />за считанные секунды :)</p>
            </div>
            <div className={styles.rightSide}>
                <p>2. Настройте свой тариф с помощью <br />удобного конструктора конфигурации!</p>
                <img src="src/assets/HIT2.svg" alt="HIT2" />
            </div>
            <div className={styles.leftSide}>
                <img src="src/assets/HIT3.svg" alt="HIT3" />
                <p>3. Начните работать с созданным сервером <br />в личном кабинете.</p>
            </div>
        </div>
    )
}

export default HowItWorks