import styles from './Landing.module.css'
import Header from '../../components/HeaderGroup/Header/Header.jsx'
import Banner from '../../components/LandingGroup/Banner/Banner.jsx'
import HowItWorks from '../../components/LandingGroup/HowItWorks/HowItWorks.jsx'
import QaA from '../../components/LandingGroup/QaA/QaA.jsx'
import UserReviews from '../../components/LandingGroup/UserReviews/UserReviews.jsx'
import Footer from '../../components/FooterGroup/Footer/Footer.jsx'

function Body(){
    return(
        <section className={styles.body}>
            <div className={styles.bg1}></div>
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