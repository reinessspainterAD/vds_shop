import React, { useRef, useState } from "react";
import styles from './ReviewList.module.css'

function ReviewList({reviews}){
    const containerRef = useRef(null)
    const [isScrolling, setIsScrolling] = useState(false)

    const scrollWithDelay = (direction) => {
        if(isScrolling) return
        setIsScrolling(true)

        if (containerRef.current) {
            const block = containerRef.current.querySelector(`.${styles.reviewBlock}`);
            const blockWidth =
                block.getBoundingClientRect().width +
                parseFloat(window.getComputedStyle(block).marginLeft) +
                parseFloat(window.getComputedStyle(block).marginRight);

            const scrollValue = direction === "right" ? blockWidth : -blockWidth;

            containerRef.current.scrollBy({ left: scrollValue, behavior: "smooth" });
        }

        // Сброс блокировки через 2 секунды
        setTimeout(() => setIsScrolling(false), 1000);
    }

    const scrollLeft = () => scrollWithDelay("left");
    const scrollRight = () => scrollWithDelay("right");

    const groupedReviews = []
    for (let i = 0; i < reviews.length; i += 2) {
        groupedReviews.push(reviews.slice(i, i + 2));
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