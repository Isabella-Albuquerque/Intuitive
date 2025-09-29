import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authService, Usuario } from '../services/authService'

interface LoginCredentials {
  email: string
  senha: string
}

export const useAuth = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

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

  const login = async (credentials: LoginCredentials) => {
    setCarregando(true)
    setErro(null)

    try {
      const usuarioAutenticado = await authService.login(credentials.email, credentials.senha)
      setUsuario(usuarioAutenticado)
      await AsyncStorage.setItem('@usuario', JSON.stringify(usuarioAutenticado))
      setCarregando(false)
      return { success: true, data: usuarioAutenticado }
    } catch (error: any) {
      const mensagemErro = error.message || 'Erro ao fazer login'
      setErro(mensagemErro)
      setCarregando(false)
      return { success: false, error: mensagemErro }
    }
  }

  const register = async (novoUsuario: Omit<Usuario, 'id'>) => {
    setCarregando(true)
    setErro(null)

    try {
      await authService.register(novoUsuario)
      const usuarioAutenticado = await authService.login(novoUsuario.email, novoUsuario.senha)
      setUsuario(usuarioAutenticado)
      await AsyncStorage.setItem('@usuario', JSON.stringify(usuarioAutenticado))
      setCarregando(false)
      return { success: true }
    } catch (error: any) {
      const mensagemErro = error.message || 'Erro ao registrar usuário'
      setErro(mensagemErro)
      setCarregando(false)
      return { success: false, error: mensagemErro }
    }
  }

  const updateUser = async (usuarioAtualizado: Usuario) => {
    setUsuario(usuarioAtualizado)
    await AsyncStorage.setItem('@usuario', JSON.stringify(usuarioAtualizado))
  }

  const logout = async () => {
    setUsuario(null)
    await AsyncStorage.removeItem('@usuario')
  }

  return { usuario, carregando, erro, login, register, logout, updateUser }
}