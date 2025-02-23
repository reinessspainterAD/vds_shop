import styles from './Footer.module.css'
import Logo from '../Logo/Logo.jsx'
import Links from '../Links/Links.jsx'
import ContactInfo from '../ContactInfo/ContactInfo.jsx'
import SocialMedia from '../SocialMedia/SocialMedia.jsx'

function Footer(){
    return(
        <section className={styles.footer}>
            <div className={styles.logo}><Logo/></div>
            <div className={styles.links}><Links /></div>
            <div className={styles.contactInfo}><ContactInfo/></div>
            <div className={styles.socialMedia}><SocialMedia /></div>
        </section>
    )
}

export default Footer