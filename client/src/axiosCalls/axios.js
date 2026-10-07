import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

export const authApi = {
  register: (customer) => api.post('/customer/register', customer),
  login: (credentials) => api.post('/customer/login', credentials),
  me: () => api.get('/customer/me'),
  updateProfile: (customer) => api.put('/customer/profile', customer),
  logout: () => api.post('/customer/logout')
}

export const axiosInstance = api
export default api
