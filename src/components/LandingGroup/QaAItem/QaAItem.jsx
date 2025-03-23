import styles from './QaAItem.module.css'

function QaAItem({qaa}){
    // Проверяем, что qaa существует и является массивом
    if (!Array.isArray(qaa)) {
        return <div>Нет данных для отображения</div>;
    }
    return(
        <div className={styles.qaaContainer}>
            {qaa.map((item, index) =>(
                <div key={index} className={styles.qaaItem}>
                    {/* Вопрос */}
                    <label className={styles.qaaQuestion}>{item.question}</label>
                    
                    {/* Ответ */}
                    {Array.isArray(item.answer) ? (
                        // Если ответ - массив, отображаем его как список
                        <ul className={styles.qaaAnswerList}>
                            {item.answer.map((answerItem, answerIndex) => (
                                <li key={answerIndex} className={styles.qaaAnswerItem}>
                                    {answerItem}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        // Если ответ - строка, отображаем его как параграф
                        <p className={styles.qaaAnswer}>{item.answer}</p>
                    )}
                </div>
            ))}
        </div>
    )
}

export default QaAItem