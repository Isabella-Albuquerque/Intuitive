import api from './api'

export interface Refeicao {
  idRefeicao?: number
  data: string
  horario: string
  tipo: string
  descricao?: string
  nivelFome: number
  nivelSaciedade: number
  companhia?: string
  distracoes?: string
  emocoesAntes?: string
  emocoesDepois?: string
  usuario: UsuarioRef
}

export interface UsuarioRef {
  id: number
  nome?: string
  email?: string
}

export const refeicaoService = {
  async cadastrar(refeicao: Omit<Refeicao, 'idRefeicao'>): Promise<Refeicao> {
    try {
      const response = await api.post('/refeicao', refeicao)
      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        const erroBackend = error.response.data

        if (typeof erroBackend === 'string') {
          throw new Error(erroBackend)
        }
        else if (erroBackend.message) {
          throw new Error(erroBackend.message)
        }
        else {
          throw new Error('Erro ao cadastrar refeição')
        }
      }
      throw new Error(error.message || 'Erro ao cadastrar refeição')
    }
  },

  async consultarPorId(id: number): Promise<Refeicao> {
    try {
      const response = await api.get(`/refeicao/${id}`)
      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data)
      }
      throw new Error(error.message || 'Erro ao consultar refeição')
    }
  },

  async getHistoricoMensal(usuarioId: number, mes: number, ano: number): Promise<Refeicao[]> {
    try {
      const response = await api.get('/refeicao/historico', {
        params: { idUsuario: usuarioId, mes, ano }
      })
      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data)
      }
      throw new Error(error.message || 'Erro ao carregar histórico')
    }
  },

  async atualizar(id: number, refeicao: Refeicao): Promise<Refeicao> {
    try {
      const response = await api.put(`/refeicao/${id}`, refeicao)
      return response.data
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data)
      }
      throw new Error(error.message || 'Erro ao atualizar refeição')
    }
  },

  async excluir(idRefeicao: number): Promise<void> {
    try {
      await api.delete(`/refeicao/${idRefeicao}`)
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data)
      }
      throw new Error(error.message || 'Erro ao excluir refeição')
    }
  }
}