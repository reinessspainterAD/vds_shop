import styles from './Landing.module.css'
import Header from '../../../HeaderGroup/Header/Header.jsx'
import Banner from '../Banner/Banner.jsx'
import HowItWorks from '../HowItWorks/HowItWorks.jsx'
import QaA from '../QaA/QaA.jsx'
import UserReviews from '../UserReviews/UserReviews.jsx'
import Footer from '../../../FooterGroup/Footer/Footer.jsx'

function Body(){
    return(
        <section className={styles.body}>
            <img className={styles.crl1} src="src/assets/circle1.svg" alt="circle1" />
            <img className={styles.crl2} src="src/assets/circle2.svg" alt="circle2" />
            <img className={styles.crl3} src="src/assets/circle3.svg" alt="circle3" />
            <img className={styles.crl4} src="src/assets/circle4.svg" alt="circle4" />
            <div className={styles.container}>
                <Header />
                <Banner />
                <HowItWorks />
                <QaA />
                <UserReviews />
                <Footer />
            </div>
            
            
        </section>
    )
}

export default Body