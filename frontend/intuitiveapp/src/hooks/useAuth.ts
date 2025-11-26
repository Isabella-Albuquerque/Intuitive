import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authService, Usuario } from '../services/authService'

interface LoginCredentials {
  email: string
  senha: string
}

interface AuthResponseSuccess<T> {
  success: true
  data: T
}

interface AuthResponseError {
  success: false
  error: string
}

type AuthResponse<T = undefined> = AuthResponseSuccess<T> | AuthResponseError

export const useAuth = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const iniciarAcao = () => {
    setCarregando(true)
    setErro(null)
  }

  const tratarErro = <T,>(error: any, mensagemPadrao: string): AuthResponse<T> => {
    const mensagem = error?.message || mensagemPadrao
    setErro(mensagem)
    setCarregando(false)
    return { success: false, error: mensagem }
  }

  const salvarUsuario = async (user: Usuario) => {
    setUsuario(user)
    await AsyncStorage.setItem('@usuario', JSON.stringify(user))
  }

  const limparUsuario = async () => {
    setUsuario(null)
    await AsyncStorage.removeItem('@usuario')
  }

  useEffect(() => {
    const carregarUsuarioSalvo = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem('@usuario')
        if (usuarioSalvo) {
          setUsuario(JSON.parse(usuarioSalvo))
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
      } finally {
        setCarregando(false)
      }
    }

    carregarUsuarioSalvo()
  }, [])

  const login = async ({ email, senha }: LoginCredentials): Promise<AuthResponse<Usuario>> => {
    iniciarAcao()

    try {
      const usuarioAutenticado = await authService.login(email, senha)
      await salvarUsuario(usuarioAutenticado)
      setCarregando(false)
      return { success: true, data: usuarioAutenticado }
    } catch (error) {
      return tratarErro<Usuario>(error, 'Erro ao fazer login')
    }
  }

  const register = async (novoUsuario: Omit<Usuario, 'id'>): Promise<AuthResponse> => {
    iniciarAcao()

    try {
      await authService.register(novoUsuario)
      const usuarioAutenticado = await authService.login(novoUsuario.email, novoUsuario.senha)

      await salvarUsuario(usuarioAutenticado)
      setCarregando(false)
      return { success: true, data: undefined }
    } catch (error) {
      return tratarErro(error, 'Erro ao registrar usuário')
    }
  }

  const updateUser = async (usuarioAtualizado: Usuario) => {
    try {
      await salvarUsuario(usuarioAtualizado)
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      setErro('Erro ao atualizar usuário')
    }
  }

  const logout = async () => {
    try {
      await limparUsuario()
    } catch (error) {
      console.error('Erro ao remover usuário do armazenamento:', error)
      setErro('Erro ao fazer logout')
    }
  }

  return {
    usuario,
    carregando,
    erro,
    login,
    register,
    logout,
    updateUser,
  }
}
