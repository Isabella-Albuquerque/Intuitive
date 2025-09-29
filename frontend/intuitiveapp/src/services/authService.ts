import api from './api'

export interface Usuario {
  id?: number
  nome: string
  email: string
  senha: string
  sexo: string
  dtNascimento: string
}

export const authService = {
  async login(email: string, senha: string): Promise<Usuario> {
    try {
      const response = await api.post('/login', { email, senha })
      return response.data
    } catch (error: any) {
      console.log('erro completo:', error)

      let errorMessage = 'Erro ao fazer login'

      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        errorMessage = 'Problema de conexão. Tente novamente.'
      }
      else if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data
        }
        else if (error.response.data.message) {
          errorMessage = error.response.data.message
        }
        else {
          errorMessage = JSON.stringify(error.response.data)
        }
      }
      else if (error.message) {
        errorMessage = error.message
      }

      throw new Error(errorMessage)
    }
  },

  async register(usuario: Usuario): Promise<void> {
    try {
      await api.post('/', usuario)
    } catch (error: any) {
      let errorMessage = 'Erro ao registrar'

      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        errorMessage = 'Problema de conexão. Tente novamente.'
      }
      else if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data
        }
        else if (error.response.data.message) {
          errorMessage = error.response.data.message
        }
        else {
          errorMessage = JSON.stringify(error.response.data)
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      throw new Error(errorMessage)
    }
  },

  async updateUser(email: string, usuario: Usuario): Promise<void> {
    try {
      await api.put(`/?email=${encodeURIComponent(email)}`, usuario)
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data)
      }
      throw new Error(error.message || 'Erro ao atualizar usuário')
    }
  },

  async deleteUser(email: string): Promise<void> {
    try {
      await api.delete(`/?email=${encodeURIComponent(email)}`)
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data)
      }
      throw new Error(error.message || 'Erro ao deletar usuário')
    }
  }
}