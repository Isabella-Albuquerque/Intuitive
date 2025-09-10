import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Button } from '../../components/button'
import { Input } from '../../components/input'
import { useAuth } from '../../hooks/useAuth'
import { authService, Usuario } from '../../services/authService'

export default function Profile() {
    const [editMode, setEditMode] = useState(false)
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senhaAtual, setSenhaAtual] = useState('')
    const [novaSenha, setNovaSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [carregando, setCarregando] = useState(false)
    const { usuario, logout, carregando: carregandoAuth, updateUser } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
            router.replace('/')
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível fazer logout')
        }
    }

    useEffect(() => {
        if (usuario && typeof usuario === 'object') {
            setNome(usuario.nome || '')
            setEmail(usuario.email || '')
            setSenhaAtual(usuario.senha ? '********' : 'Não definida')
        } else {
            setNome('')
            setEmail('')
            setSenhaAtual('')
        }
    }, [usuario])

    if (carregandoAuth) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Carregando...</Text>
                </View>
            </SafeAreaView>
        )
    }

    const handleSave = async () => {
        // validações
        if (!nome || !email) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            Alert.alert('Erro', 'Por favor, insira um email válido')
            return
        }

        if (novaSenha) {
            if (novaSenha.length < 6) {
                Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres')
                return
            }

            if (novaSenha !== confirmarSenha) {
                Alert.alert('Erro', 'As novas senhas não coincidem')
                return
            }
        }

        setCarregando(true)

        try {
            const dadosAtualizados: Usuario = {
                nome,
                email,
                senha: novaSenha || usuario?.senha || '',
                sexo: usuario?.sexo || '',
                dtNascimento: usuario?.dtNascimento || ''
            }

            await authService.updateUser(usuario?.email || '', dadosAtualizados)

            updateUser({
                ...usuario,
                ...dadosAtualizados
            } as Usuario)

            Alert.alert('Sucesso', 'Dados atualizados com sucesso!')
            setEditMode(false)
            setNovaSenha('')
            setConfirmarSenha('')
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Não foi possível atualizar os dados. Tente novamente.')
        } finally {
            setCarregando(false)
        }
    }

    const handleDeleteAccount = () => {
        Alert.alert(
            'Excluir Conta',
            'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        setCarregando(true)
                        try {
                            await authService.deleteUser(usuario?.email || '')
                            Alert.alert('Conta excluída', 'Sua conta foi excluída com sucesso.')
                            logout()
                            router.replace('/')
                        } catch (error: any) {
                            Alert.alert('Erro', error.message || 'Não foi possível excluir a conta. Tente novamente.')
                        } finally {
                            setCarregando(false)
                        }
                    }
                }
            ]
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                        disabled={carregando}
                    >
                        <Ionicons name="arrow-back" size={24} color="#2e6480" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleLogout}
                        disabled={carregando}
                        style={styles.logoutButton}
                    >
                        <View style={styles.logoutContainer}>
                            <Text style={styles.logoutText}>Sair</Text>
                            <Ionicons name="log-out-outline" size={18} color="#2e6480" />
                        </View>
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>Meu Perfil</Text>

                <View style={styles.form}>
                    {/* nome */}
                    <Text style={styles.sectionTitle}>Nome</Text>
                    <Input
                        placeholder="Seu nome completo"
                        onChangeText={setNome}
                        value={nome}
                        editable={editMode}
                        style={!editMode ? styles.disabledInput : styles.input}
                    />

                    {/* email */}
                    <Text style={styles.sectionTitle}>E-mail</Text>
                    <Input
                        placeholder="Seu e-mail"
                        onChangeText={setEmail}
                        value={email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={editMode}
                        style={!editMode ? styles.disabledInput : styles.input}
                    />

                    {/* senha atual (só visualização) */}
                    <Text style={styles.sectionTitle}>Senha Atual</Text>
                    <Input
                        placeholder="Senha"
                        value={senhaAtual}
                        editable={false}
                        style={styles.disabledInput}
                    />

                    {/* nova senha (só p/ modo edição) */}
                    {editMode && (
                        <>
                            <Text style={styles.sectionTitle}>Nova Senha</Text>
                            <Input
                                placeholder="Digite a nova senha (mínimo 6 caracteres)"
                                onChangeText={setNovaSenha}
                                value={novaSenha}
                                secureTextEntry
                                style={styles.input}
                            />

                            <Text style={styles.sectionTitle}>Confirmar Nova Senha</Text>
                            <Input
                                placeholder="Confirme a nova senha"
                                onChangeText={setConfirmarSenha}
                                value={confirmarSenha}
                                secureTextEntry
                                style={styles.input}
                            />
                        </>
                    )}

                    {editMode ? (
                        <View style={styles.buttonContainer}>
                            <Button
                                title={carregando ? "Salvando..." : "Salvar Alterações"}
                                onPress={handleSave}
                                style={styles.saveButton}
                                disabled={carregando}
                            />
                            <Button
                                title="Cancelar"
                                onPress={() => {
                                    setEditMode(false)
                                    setNovaSenha('')
                                    setConfirmarSenha('')
                                    if (usuario) {
                                        setNome(usuario.nome || '')
                                        setEmail(usuario.email || '')
                                    }
                                }}
                                style={styles.cancelButton}
                                disabled={carregando}
                            />
                        </View>
                    ) : (
                        <Button
                            title="Alterar Cadastro"
                            onPress={() => setEditMode(true)}
                            style={styles.editButton}
                            disabled={carregando}
                        />
                    )}

                    <TouchableOpacity
                        onPress={handleDeleteAccount}
                        disabled={carregando}
                        style={styles.deleteContainer}
                    >
                        <Text style={[styles.deleteText, carregando && styles.disabledText]}>
                            Excluir minha conta
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fafafa',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flexGrow: 1,
        padding: 24,
        backgroundColor: '#fafafa'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Poppins-Regular'
    },
    errorText: {
        color: '#f44336',
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 20,
        fontFamily: 'Poppins-Medium'
    },
    loginButton: {
        backgroundColor: '#2e6480',
        marginTop: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
        position: 'relative',
    },
    backButton: {
        padding: 8,
        position: 'absolute',
        left: 0,
        zIndex: 1,
    },
    backText: {
        color: '#2e6480',
        marginLeft: 8,
        fontSize: 16,
        fontFamily: 'Poppins-Regular'
    },
    title: {
        fontSize: 22,
        color: '#5c503a',
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        paddingTop: 46,
    },
    form: {
        gap: 10,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#5c503a',
        marginBottom: 4,
        fontFamily: 'Poppins-Medium'
    },
    disabledInput: {
        backgroundColor: '#f0f0f0',
        opacity: 0.7,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        backgroundColor: '#FFF',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    buttonContainer: {
        gap: 12,
        marginTop: 16,
    },
    editButton: {
        backgroundColor: '#2e6480',
        marginTop: 16,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    deleteContainer: {
        alignItems: 'center',
        marginTop: 24,
        padding: 16,
    },
    deleteText: {
        color: '#f44336',
        fontSize: 14,
        textDecorationLine: 'underline',
        fontFamily: 'Poppins-Regular'
    },
    logoutButton: {
        padding: 8,
        position: 'absolute',
        right: 0,
        zIndex: 1,
    },
    logoutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    logoutText: {
        color: '#2e6480',
        fontSize: 14,
        fontFamily: 'Poppins-Regular'
    },
    disabledText: {
        opacity: 0.5,
    }
})