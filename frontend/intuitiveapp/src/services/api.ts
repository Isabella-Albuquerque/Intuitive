import axios from 'axios'
import Constants from 'expo-constants'

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api