import api from './api'

export interface Usuario {
  id?: number
  nome: string
  email: string
  senha: string
  sexo: string
  dtNascimento: string
}

export const extrairMensagemErro = (error: any, mensagemPadrao = 'Erro desconhecido'): string => {
  console.error('Erro completo:', error)

  if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
    return 'Problema de conexão. Tente novamente.'
  }

  if (error.response?.data) {
    if (typeof error.response.data === 'string') return error.response.data
    if (error.response.data.message) return error.response.data.message
    return JSON.stringify(error.response.data)
  }

  return error.message || mensagemPadrao
}

export const authService = {
  async login(email: string, senha: string): Promise<Usuario> {
    try {
      const response = await api.post('/login', { email, senha })
      return response.data
    } catch (error: any) {
      throw new Error(extrairMensagemErro(error, 'Erro ao fazer login'))
    }
  },

  async register(usuario: Usuario): Promise<void> {
    try {
      await api.post('/', usuario)
    } catch (error: any) {
      throw new Error(extrairMensagemErro(error, 'Erro ao registrar usuário'))
    }
  },

  async updateUser(email: string, usuario: Usuario): Promise<void> {
    try {
      await api.put(`/?email=${encodeURIComponent(email)}`, usuario)
    } catch (error: any) {
      throw new Error(extrairMensagemErro(error, 'Erro ao atualizar usuário'))
    }
  },

  async deleteUser(email: string): Promise<void> {
    try {
      await api.delete('/', { params: { email } })
    } catch (error: any) {
      throw new Error(extrairMensagemErro(error, 'Erro ao deletar usuário'))
    }
  }
}