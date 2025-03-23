import React, { useState } from "react";
import styles from './Banner.module.css'

function Banner(){
    const slides = [
        { id: 1, title: ["Высокая", <br key="line-break"/>, "производительность"], description: "Современные серверы с мощными процессорами и быстрыми накопителями обеспечивают максимальную скорость и стабильность для ваших проектов.", image:"src/assets/Banner1.svg"},
        { id: 2, title: "Гибкие тарифы", description: "Подберите оптимальный тариф под ваши задачи. От минимальных ресурсов для старта до мощных конфигураций для крупных проектов.", image:"src/assets/Banner2.svg"},
        { id: 3, title: "99.9% Аптайм", description: "Надёжная инфраструктура гарантирует бесперебойную работу серверов и высокую доступность ваших сервисов.", image:"src/assets/Banner3.svg"},
        { id: 4, title: "Простое управление", description: "Удобная панель управления с мгновенным доступом к настройкам сервера. Всё под контролем, даже без специальных навыков.", image:"src/assets/Banner4.svg"},
        { id: 5, title: ["Круглосуточная", <br key="line-break"/>, "поддержка"], description: "Наша команда специалистов всегда на связи, чтобы помочь вам в любой ситуации — 24/7.", image:"src/assets/Banner5.svg"},
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    // Функция для перехода к следующему слайду
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    // Функция для перехода к предыдущему слайду
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className={styles.banner}>
            {/* Слайд */}
            <div className={styles.slide_container}>
                <div className={styles.text}>
                    <h2>{slides[currentSlide].title}</h2>
                    <p>{slides[currentSlide].description}</p>
                </div>
                <div className={styles.image}>
                    <img className={styles.banner_svg} src={slides[currentSlide].image} alt="bannerimage" />
                </div>
                

            </div>

            {/* Кнопки навигации */}
            <div className={styles.navigation}>
                <button onClick={prevSlide}><img src="src/assets/leftArrow.svg" alt="left" /></button> {/* Кнопка "влево" */}
                <div className={styles.indicators}>
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={currentSlide === index ? styles.active : ""}
                        ></div>
                    ))}
                </div>
                <button onClick={nextSlide}><img src="src/assets/rightArrow.svg" alt="" /></button> {/* Кнопка "вправо" */}
            </div>
        </div>
    )
}

export default Banner