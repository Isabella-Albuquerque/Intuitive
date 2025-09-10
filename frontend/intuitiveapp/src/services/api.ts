import axios from 'axios'

// ip para emulador Android http://10.0.2.2:8080
const API_BASE_URL = 'http://10.0.2.2:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api