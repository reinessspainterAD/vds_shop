import styles from './QaA.module.css'
import { useState } from "react";
import plus from '../../../assets/plus.png'
import minus from '../../../assets/minus.png'

function QaA(){
    const data = [
        {
            question: 'Что такое VDS?', 
            answer: 'VDS (виртуальный выделенный сервер) — это полноценный виртуальный сервер с выделенными ресурсами (процессор, память, дисковое пространство), который предоставляет полный контроль и изоляцию для пользователя. Это идеальный выбор для размещения сайтов, приложений, баз данных и других онлайн-проектов с повышенными требованиями к производительности.'
        },
        {
            question: 'В чем преимущества использования VDS от CloudSphere?', 
            answer: [
                'Полная изоляция от других пользователей', 
                'Высокая производительность благодаря выделенным ресурсам',
                'Прозрачное масштабирование — вы платите только за то, что используете',
                'Удобная панель управления',
                'Поддержка 24/7 для решения любых вопросов'
            ]
        },
        {
            question: 'Как выбрать подходящий тариф?',
            answer: [
                'Для тестовых проектов или небольших наработок выбирайте конфигурацию меньшей мощьности',
                'Если ваш проект растет не по дням, а по часам, то выберайте конфигурацию средней мощьности',
                'Для крупного бизнеса или ресурсоемких приложений идеально подойдут конфигурация высокой мощности'
            ]
        }
    ]

    const [activeIndex, setActiveIndex] = useState(null)
    const toggle = (index) => {
        setActiveIndex(index === activeIndex? null : index)
    }
    return(
        <div className={styles.accordion}>
            <h2 className={styles.h2}>Часто задаваемые вопросы</h2>
            {data.map((item, index) => (
                <div key={index} className={styles.item}>
                    <div className={styles.header} onClick={() => toggle(index)}>
                        <img src={activeIndex === index ? minus : plus} alt="toggle icon" />
                        <span>{item.question}</span>
                    </div>
                    <div className={`${styles.content} ${activeIndex === index ? styles.open : ""}`}>
                        {Array.isArray(item.answer) ? (
                            <ul>
                                {item.answer.map((line, i) => (
                                    <li key={i}>{line}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>{item.answer}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default QaA