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
      const response = await api.get(`/?email=${encodeURIComponent(email)}`)
      const usuario = response.data

      if (usuario && usuario.senha === senha) {
        return usuario
      } else {
        throw new Error('Credenciais inválidas')
      }
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('Usuário não encontrado')
      }
      throw new Error('Erro ao fazer login: ' + error.message)
    }
  },

  async register(usuario: Usuario): Promise<void> {
    try {
      await api.post('/', usuario)
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Email já cadastrado')
      }
      throw new Error('Erro ao registrar: ' + error.message)
    }
  },

  async updateUser(email: string, usuario: Usuario): Promise<void> {
    try {
      await api.put(`/?email=${encodeURIComponent(email)}`, usuario)
    } catch (error: any) {
      throw new Error('Erro ao atualizar usuário: ' + error.message)
    }
  },

  async deleteUser(email: string): Promise<void> {
    try {
      await api.delete(`/?email=${encodeURIComponent(email)}`)
    } catch (error: any) {
      throw new Error('Erro ao deletar usuário: ' + error.message)
    }
  }
}