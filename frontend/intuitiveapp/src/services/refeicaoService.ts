import api from './api'
import { extrairMensagemErro } from './authService'

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
  usuario: {
    id: number
    nome?: string
    email?: string
  }
}

export const refeicaoService = {
  async cadastrar(refeicao: Omit<Refeicao, 'idRefeicao'>): Promise<Refeicao> {
    try {
      const response = await api.post('/refeicao', refeicao)
      return response.data
    } catch (error: any) {
      return Promise.reject({ message: extrairMensagemErro(error, 'Erro ao cadastrar refeição') })
    }
  },

  async consultarPorId(id: number): Promise<Refeicao> {
    try {
      const response = await api.get(`/refeicao/${id}`)
      return response.data
    } catch (error: any) {
      return Promise.reject({ message: extrairMensagemErro(error, 'Erro ao consultar refeição') })
    }
  },

  async getHistoricoMensal(usuarioId: number, mes: number, ano: number): Promise<Refeicao[]> {
    try {
      const response = await api.get('/refeicao/historico', { params: { usuarioId, mes, ano } })
      return response.data
    } catch (error: any) {
      return Promise.reject({ message: extrairMensagemErro(error, 'Erro ao carregar histórico') })
    }
  },

  async getMesesDisponiveis(usuarioId: number, ano: number) {
    try {
      const response = await api.get('/refeicao/meses-disponiveis', { params: { usuarioId, ano } })
      return response.data
    } catch (error: any) {
      return Promise.reject({ message: extrairMensagemErro(error, 'Erro ao carregar meses disponíveis') })
    }
  },

  async atualizar(id: number, refeicao: Refeicao): Promise<Refeicao> {
    try {
      const response = await api.put(`/refeicao/${id}`, refeicao)
      return response.data
    } catch (error: any) {
      return Promise.reject({ message: extrairMensagemErro(error, 'Erro ao atualizar refeição') })
    }
  },

  async excluir(idRefeicao: number): Promise<void> {
    try {
      await api.delete(`/refeicao/${idRefeicao}`)
    } catch (error: any) {
      return Promise.reject({ message: extrairMensagemErro(error, 'Erro ao excluir refeição') })
    }
  }
}