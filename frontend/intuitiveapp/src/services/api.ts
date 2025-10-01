import axios from 'axios'

const API_BASE_URL = 'https://backend-production-c678d.up.railway.app'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api