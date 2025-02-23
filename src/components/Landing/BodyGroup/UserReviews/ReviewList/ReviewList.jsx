import React, { useRef } from "react";
import styles from './ReviewList.module.css'

function ReviewList({reviews}){
    const containerRef = useRef(null)
    // Функция для прокрутки вправо
    const scrollRight = () => {
        if (containerRef.current) {
            const block = containerRef.current.querySelector(`.${styles.reviewBlock}`);
            const blockWidth = block.getBoundingClientRect().width + 
                               parseFloat(window.getComputedStyle(block).marginLeft) +
                               parseFloat(window.getComputedStyle(block).marginRight);
            containerRef.current.scrollBy({ left: blockWidth, behavior: 'smooth' });
        }
    };
    // Функция для прокрутки влево
    const scrollLeft = () => {
        if (containerRef.current) {
            const block = containerRef.current.querySelector(`.${styles.reviewBlock}`);
            const blockWidth = block.getBoundingClientRect().width + 
                               parseFloat(window.getComputedStyle(block).marginLeft) +
                               parseFloat(window.getComputedStyle(block).marginRight);
            containerRef.current.scrollBy({ left: -blockWidth, behavior: 'smooth' });
        }
    };

    // Разделение отзывов на группы по 2 элемента
    const groupedReviews = []
    for(let i =0; i<reviews.length; i+=2){
        groupedReviews.push(reviews.slice(i, i+2))
    }

    return(
        
        <div className={styles.reviewListContainer}>
            {/* Кнопка влево */}
            <button className={styles.scrollBtnLeft} onClick={scrollLeft}>
                <img src="src/assets/ReviewLeftArrow.svg" alt="ReviewLeftArrow" />
            </button>

            {/* Контейнер с блоками */}
            <div className={styles.reviewList} ref={containerRef}>
                {groupedReviews.map((block, index) => (
                    <div className={styles.reviewBlock} key={index}>
                        {block.map((review) =>(
                            <div className={styles.reviewCard} key={review.id}>
                                <p>{review.text}</p>
                                <div className={styles.helpme}>
                                    <div className={styles.ava}><img src={review.image} alt="photo" /></div>
                                    <div>
                                        <h3>{review.name}</h3>
                                        <p>{review.spec}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Кнопка вправо */}
            <button className={styles.scrollBtnRight} onClick={scrollRight}>
                <img src="src/assets/ReviewRightArrow.svg" alt="ReviewRightArrow" />
            </button>
        </div>
    )
}

export default ReviewList