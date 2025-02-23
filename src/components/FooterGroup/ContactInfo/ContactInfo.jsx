import styles from './ContactInfo.module.css'

function ContactInfo(){
    return(
        <div className={styles.contactInfo}>
            <label className={styles.cIP}>Контактная информация</label>
            <p>cloudspheretech@gmail.com</p>
            <p>+8(999)-323-32-32</p>
        </div>
    )
}

export default ContactInfo