import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:1337/api',
})

export const createVM = (config) => api.post('/vms/create', config)
export const getVMStatus = (vmId) => api.get(`/vms/${vmId}/status`)
export const getVms = () => api.get('/vms', config)
export const stopVM = (vmId) => api.post(`/vms/${vmId}/stop`)
export const deleteVM = (vmId) => api.delete(`/vms/${vmId}`)
export const getVMMetrics = (vmId) => api.get(`/vms/${vmId}/metrics`)