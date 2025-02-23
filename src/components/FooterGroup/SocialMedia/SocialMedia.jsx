import styles from './SocialMedia.module.css'

function SocialMedia(){
    return(
        <div className={styles.socialMedia}>
            <img src="src/assets/vkIcon.svg" alt="VKIcon" />
            <img src="src/assets/telegramIcon.svg" alt="TGIcon" />
            <img src="src/assets/whatsappIcon.svg" alt="WAIcon" />
        </div>
    )
}

export default SocialMedia