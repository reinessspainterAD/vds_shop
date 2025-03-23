import styles from './UserReviews.module.css'
import ReviewList from '../ReviewList/ReviewList.jsx'

function UserReviews(){
    const reviewsData = [
        {id: 1, name:'Андрей Смирнов', spec:'веб-разработчик', text:'С CloudSphere работаю уже второй месяц, и пока нареканий нет. Сервера стабильные, техподдержка отвечает быстро. Особенно порадовала возможность быстрого масштабирования ресурсов — это очень помогает при тестировании новых проектов.', image:'src/assets/user1.svg'},
        {id: 2, name:'Мария Кузнецова', spec:'владелец интернет-магазина', text:'Долго выбирала сервис для размещения нашего магазина, остановилась на CloudSphere. Всё работает быстро, сайт не ложится даже во время больших распродаж. Отдельное спасибо за доступные цены — бюджет позволяет!', image:'src/assets/user2.svg'},
        {id: 3, name:'Игорь Петров', spec:'системный администратор', text:'CloudSphere — отличный выбор для тех, кто ценит надежность и удобство управления. Панель интуитивно понятная, а документация подробная. За всё время использования ни одного сбоя — рекомендую профессионалам.', image:'src/assets/user4.svg'},
        {id: 4, name:'Екатерина Васильева', spec:'начинающий блогер', text:'Как новичок в сфере IT, я боялась, что не разберусь с настройками сервера. Но благодаря простому интерфейсу CloudSphere всё получилось с первого раза! Также приятно, что есть доступные тарифы для маленьких проектов.', image:'src/assets/user3.svg'},
        {id: 5, name:'test5', spec:'??????', text:'Отличный программный продукт', image:'none'},
        {id: 6, name:'test6', spec:'??????', text:'Отличный программный продукт', image:'none'},
        {id: 7, name:'test7', spec:'??????', text:'Отличный программный продукт', image:'none'}
    ]
    return(
        <div className={styles.userReviews}>
            <div className={styles.label}>
                <h2>Отзывы наших клиентов</h2>
                <img src="src/assets/ReviewsLiner1.svg" alt="ReviewsLiner1" />
            </div>
            <ReviewList reviews={reviewsData} />
            <div className={styles.lines}>
                <img src="src/assets/ReviewsLiner2.svg" alt="ReviewsLiner2" />
                <img src="src/assets/ReviewsLiner3.svg" alt="ReviewsLiner3" />
            </div>
            
        </div>
    )
}

export default UserReviews
