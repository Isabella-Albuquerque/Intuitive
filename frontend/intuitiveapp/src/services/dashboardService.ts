import api from './api'

export interface DashboardData {
  mediaRefeicoesDiarias: number
  distracao: {
    dados: Array<{
      value: number
      label: string
      color: string
    }>
    mensagem: string
  }
  emocoesAntes: Array<{
    value: number
    label: string
    color: string
  }>
  emocoesDepois: Array<{
    value: number
    label: string
    color: string
  }>
}

export const dashboardService = {
  async getDados7Dias(usuarioId: number): Promise<DashboardData> {
    try {
      const [media, distracao, emocoesAntes, emocoesDepois] = await Promise.all([
        this.getMedia7Dias(usuarioId),
        this.getDistracao7Dias(usuarioId),
        this.getEmocoesAntes7Dias(usuarioId),
        this.getEmocoesDepois7Dias(usuarioId)
      ])

      return {
        mediaRefeicoesDiarias: media,
        distracao: {
          dados: this.formatarDistracao(distracao[0]),
          mensagem: distracao[0].mensagem
        },
        emocoesAntes: this.formatarEmocoes(emocoesAntes[0]),
        emocoesDepois: this.formatarEmocoes(emocoesDepois[0])
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar dados dos últimos 7 dias')
    }
  },

  async getDadosMensais(usuarioId: number): Promise<DashboardData> {
    try {
      const [media, distracao, emocoesAntes, emocoesDepois] = await Promise.all([
        this.getMedia30Dias(usuarioId),
        this.getDistracao30Dias(usuarioId),
        this.getEmocoesAntes30Dias(usuarioId),
        this.getEmocoesDepois30Dias(usuarioId)
      ])

      return {
        mediaRefeicoesDiarias: media,
        distracao: {
          dados: this.formatarDistracao(distracao[0]),
          mensagem: distracao[0].mensagem
        },
        emocoesAntes: this.formatarEmocoes(emocoesAntes[0]),
        emocoesDepois: this.formatarEmocoes(emocoesDepois[0])
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao carregar dados mensais')
    }
  },

  async getMedia7Dias(usuarioId: number): Promise<number> {
    const response = await api.get('/relatorios/mediarefeicoes/ultimos7dias', {
      params: { idUsuario: usuarioId }
    })
    return response.data || 0
  },

  async getMedia30Dias(usuarioId: number): Promise<number> {
    const response = await api.get('/relatorios/mediarefeicoes/ultimos30dias', {
      params: { idUsuario: usuarioId }
    })
    return response.data || 0
  },

  async getDistracao7Dias(usuarioId: number) {
    const response = await api.get(`/relatorios/distracoes/ultimos7dias/${usuarioId}`)
    return response.data
  },

  async getDistracao30Dias(usuarioId: number) {
    const response = await api.get(`/relatorios/distracoes/ultimos30dias/${usuarioId}`)
    return response.data
  },

  async getEmocoesAntes7Dias(usuarioId: number) {
    const response = await api.get(`/relatorios/emocoes-antes/ultimos7dias/${usuarioId}`)
    return response.data
  },

  async getEmocoesAntes30Dias(usuarioId: number) {
    const response = await api.get(`/relatorios/emocoes-antes/ultimos30dias/${usuarioId}`)
    return response.data
  },

  async getEmocoesDepois7Dias(usuarioId: number) {
    const response = await api.get(`/relatorios/emocoes-depois/ultimos7dias/${usuarioId}`)
    return response.data
  },

  async getEmocoesDepois30Dias(usuarioId: number) {
    const response = await api.get(`/relatorios/emocoes-depois/ultimos30dias/${usuarioId}`)
    return response.data
  },

  formatarDistracao(distracao: any) {
    const total = distracao.countSim + distracao.countNao
    return [
      {
        value: total > 0 ? Math.round((distracao.countSim / total) * 100) : 50,
        label: 'Sim',
        color: '#FF6B6B'
      },
      {
        value: total > 0 ? Math.round((distracao.countNao / total) * 100) : 50,
        label: 'Não',
        color: '#4ECDC4'
      }
    ]
  },

  formatarEmocoes(emocoes: any) {
    const cores = {
      countFeliz: '#FFD93D',
      countTriste: '#1f72e5ff',
      countCalmo: '#6BCF7F',
      countAnsioso: '#FF6B6B',
      countEstressado: '#a96dc1ff',
      countNeutro: '#95A5A6',
      countCulpado: '#E74C3C',
      countFrustrado: '#8131a3ff',
      countCansado: '#34495E',
      countRelaxado: '#4badefff',
      countEntediado: '#7F8C8D'
    }

    const emojis = {
      countFeliz: '😊',
      countTriste: '😞',
      countCalmo: '😌',
      countAnsioso: '😰',
      countEstressado: '😣',
      countNeutro: '😐',
      countCulpado: '😔',
      countFrustrado: '😤',
      countCansado: '😴',
      countRelaxado: '😎',
      countEntediado: '🥱'
    }

    return Object.entries<number>(emocoes)
      .filter(([key, value]) => key.startsWith('count') && value > 0)
      .map(([key, value]) => ({
        value: value as number,
        label: emojis[key as keyof typeof emojis] || '😐',
        color: cores[key as keyof typeof cores] || '#95A5A6'
      }))
      .sort((a, b) => b.value - a.value)
  }
}