import api from './api'

export interface DashboardData {
  mediaRefeicoesDiarias: number
  mediaFome: number
  mediaSaciedade: number
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
    const segura = async <T>(fn: () => Promise<T>, fallback: T) => {
      try {
        return await fn()
      } catch (err) {
        console.warn('Falha em uma das requisições do dashboard:', err)
        return fallback
      }
    }

    const [media, mediaFome, mediaSaciedade, distracao, emocoesAntes, emocoesDepois] = await Promise.all([
      segura(() => this.getMedia7Dias(usuarioId), 0),
      segura(() => this.getMediaFome7Dias(usuarioId), 0),
      segura(() => this.getMediaSaciedade7Dias(usuarioId), 0),
      segura(() => this.getDistracao7Dias(usuarioId), [{ countSim: 0, countNao: 0, mensagem: 'Sem dados' }]),
      segura(() => this.getEmocoesAntes7Dias(usuarioId), [{}]),
      segura(() => this.getEmocoesDepois7Dias(usuarioId), [{}]),
    ])

    return {
      mediaRefeicoesDiarias: media,
      mediaFome,
      mediaSaciedade,
      distracao: {
        dados: this.formatarDistracao(distracao[0]) ?? [],
        mensagem: distracao[0].mensagem
      },

      emocoesAntes: this.formatarEmocoes(emocoesAntes[0]),
      emocoesDepois: this.formatarEmocoes(emocoesDepois[0])
    }
  },

  async getDadosMensais(usuarioId: number): Promise<DashboardData> {
    const segura = async <T>(fn: () => Promise<T>, fallback: T) => {
      try {
        return await fn()
      } catch {
        return fallback
      }
    }

    const [
      media,
      mediaFome,
      mediaSaciedade,
      distracao,
      emocoesAntes,
      emocoesDepois
    ] = await Promise.all([
      segura(() => this.getMedia30Dias(usuarioId), 0),
      segura(() => this.getMediaFome30Dias(usuarioId), 0),
      segura(() => this.getMediaSaciedade30Dias(usuarioId), 0),
      segura(() => this.getDistracao30Dias(usuarioId), [
        { countSim: null, countNao: null, mensagem: 'Sem dados' }
      ]),
      segura(() => this.getEmocoesAntes30Dias(usuarioId), [{}]),
      segura(() => this.getEmocoesDepois30Dias(usuarioId), [{}])
    ])

    return {
      mediaRefeicoesDiarias: media,
      mediaFome,
      mediaSaciedade,
      distracao: {
        dados: this.formatarDistracao(distracao[0]) ?? [],
        mensagem: distracao[0].mensagem
      },

      emocoesAntes: this.formatarEmocoes(emocoesAntes[0]),
      emocoesDepois: this.formatarEmocoes(emocoesDepois[0])
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

  async getMediaFome7Dias(usuarioId: number): Promise<number> {
    const response = await api.get('/relatorios/media-fome/ultimos7dias', {
      params: { idUsuario: usuarioId }
    })
    return response.data || 0
  },

  async getMediaFome30Dias(usuarioId: number): Promise<number> {
    const response = await api.get('/relatorios/media-fome/ultimos30dias', {
      params: { idUsuario: usuarioId }
    })
    return response.data || 0
  },

  async getMediaSaciedade7Dias(usuarioId: number): Promise<number> {
    const response = await api.get('/relatorios/media-saciedade/ultimos7dias', {
      params: { idUsuario: usuarioId }
    })
    return response.data || 0
  },

  async getMediaSaciedade30Dias(usuarioId: number): Promise<number> {
    const response = await api.get('/relatorios/media-saciedade/ultimos30dias', {
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
    if (!distracao || distracao.countSim == null || distracao.countNao == null) {
      return null
    }

    const total = distracao.countSim + distracao.countNao
    if (total === 0) {
      return null
    }

    return [
      {
        value: Math.round((distracao.countSim / total) * 100),
        label: 'Sim',
        color: '#E57373'
      },
      {
        value: Math.round((distracao.countNao / total) * 100),
        label: 'Não',
        color: '#3A7291'
      }
    ]
  },

  formatarEmocoes(emocoes: any) {
    const paleta = [
      '#2E6480', '#3A7291', '#4A83A2', '#5D94B3', '#73A6C4', '#8BB8D5', '#A5CAE6', '#C0DCF7', '#D6E8FF', '#E7F2FF', '#F5FAFF',
    ]

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
      countEntediado: '🥱',
    }

    const emocoesPresentes = Object.entries<number>(emocoes)
      .filter(([_, value]) => value > 0)
      .sort((a, b) => b[1] - a[1])

    return emocoesPresentes.map(([key, value], index) => {
      const paletaIndex = Math.floor((index / (emocoesPresentes.length - 1 || 1)) * (paleta.length - 1))
      return {
        value,
        label: emojis[key as keyof typeof emojis] || '😐',
        color: paleta[paletaIndex]
      }
    })
  }
}