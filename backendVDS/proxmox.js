const axios = require("axios");
const qs = require("qs");
//0c4409e8-bcff-46ff-98bc-e805b2f1f52a
//e1e50bd0-ed5e-46ef-8f29-8939bcbcaf97
// const PROXMOX_API_URL = 'https://pve.starovoytov.online/api2/json'
// const PROXMOX_USER = 'api-user@pve'
// const PROXMOX_TOKEN_ID = 'test-api-token'
// const PROXMOX_SECRET = '027c8550-648d-4de5-9e85-051c5d5f4a48'

// Формируем токен

const PROXMOX_API_URL = "https://pve.starovoytov.online/api2/json";
const PROXMOX_API_TOKEN = `PVEAPIToken=api-user@pve!test-api-token=027c8550-648d-4de5-9e85-051c5d5f4a48`

// Функция для запросов к Proxmox API
async function proxmoxRequest(method, path, data) {
    console.log("Отправляем запрос:", method, path);
    console.log("Данные запроса:", data);
    
    try {
        
        const response = await axios({
            method,
            url: `${PROXMOX_API_URL}${path}`,
            headers: {
                Authorization: PROXMOX_API_TOKEN,
                "Content-Type": "application/x-www-form-urlencoded", // <--- Обязательно!
            },
            data: qs.stringify(data), // <--- Переводим объект в строку
        });

        console.log("Ответ от Proxmox:", response.data);
        return response.data;
    } catch (error) {
        console.error("Ошибка запроса к Proxmox:", error.response?.data || error.message);
        throw error;
    }
}

// Создание ВМ
async function createVM(vmConfig) {
    return proxmoxRequest('POST', `/nodes/pve/qemu`, vmConfig);
}

// Получение статуса ВМ
async function getVMStatus(vmid) {
    return proxmoxRequest('GET', `/nodes/pve/qemu/${vmid}/status/current`);
}

// Остановка ВМ
async function stopVM(vmid) {
    return proxmoxRequest('POST', `/nodes/pve/qemu/${vmid}/status/stop`);
}

// Удаление ВМ
async function deleteVM(vmid) {
    return proxmoxRequest('DELETE', `/nodes/pve/qemu/${vmid}`);
}

module.exports = {
    // createVM,
    // getVMStatus,
    // stopVM,
    // deleteVM
    proxmoxRequest
};