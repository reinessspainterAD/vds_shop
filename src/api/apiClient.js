import axios from 'axios'

// Создаем инстанс Axios с базовым URL нашего API
const apiClient = axios.create({
    baseURL: 'http://localhost:1337',
});

// Добавляем перехватчик для добавления токена в заголовки
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = ` Bearer ${token}`;
    }
    return config
}, (error)  => {
    return Promise.reject(error)
})

export default apiClient