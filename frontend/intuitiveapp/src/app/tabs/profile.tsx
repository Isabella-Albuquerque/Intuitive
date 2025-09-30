import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Button } from '../../components/button'
import { Input } from '../../components/input'
import { useAuth } from '../../hooks/useAuth'
import { authService, Usuario } from '../../services/authService'
import { CustomAlert } from '../../components/customAlert'
import { CustomConfirm } from '../../components/customConfirm'
import { useAlert } from '../../hooks/useAlert'

export default function Profile() {
    const { showAlert, hideAlert, alertVisible, alertConfig } = useAlert()
    const { showConfirm, hideConfirm, confirmVisible, confirmConfig } = useAlert()

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
            showAlert('Erro', 'Não foi possível fazer logout')
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
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Carregando...</Text>
                </View>
            </SafeAreaView>
        )
    }

    const handleSave = async () => {
        if (!nome.trim() || !email.trim()) {
            showAlert('Atenção', 'Nome e e-mail são obrigatórios')
            return
        }

        if (novaSenha && novaSenha !== confirmarSenha) {
            showAlert('Atenção', 'As senhas não coincidem')
            return
        }

        setCarregando(true)

        try {
            const dadosAtualizados: Usuario = {
                nome: nome.trim(),
                email: email.trim(),
                senha: novaSenha || usuario?.senha || '',
                sexo: usuario?.sexo || '',
                dtNascimento: usuario?.dtNascimento || ''
            }

            await authService.updateUser(usuario?.email || '', dadosAtualizados)

            updateUser({
                ...usuario,
                ...dadosAtualizados
            } as Usuario)

            showAlert('Sucesso', 'Dados atualizados com sucesso!')
            setEditMode(false)
            setNovaSenha('')
            setConfirmarSenha('')
        } catch (error: any) {
            showAlert('Erro', error.message || 'Não foi possível atualizar os dados.')
        } finally {
            setCarregando(false)
        }
    }

    const handleDeleteAccount = () => {
        showConfirm(
            'Excluir Conta',
            'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel' as const
                },
                {
                    text: 'Excluir',
                    style: 'destructive' as const,
                    onPress: async () => {
                        setCarregando(true)
                        try {
                            await authService.deleteUser(usuario?.email || '')
                            showAlert('Conta excluída', 'Sua conta foi excluída com sucesso.')
                            logout()
                            router.replace('/')
                        } catch (error: any) {
                            showAlert('Erro', error.message || 'Não foi possível excluir a conta.')
                        } finally {
                            setCarregando(false)
                        }
                    }
                }
            ]
        )
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.navigate('/tabs/home')}
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
                                placeholder="Digite a nova senha (opcional)"
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

            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={hideAlert}
            />

            <CustomConfirm
                visible={confirmVisible}
                title={confirmConfig.title}
                message={confirmConfig.message}
                buttons={confirmConfig.buttons}
                onClose={hideConfirm}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fafafa',
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
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 22,
        color: '#5c503a',
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        paddingTop: 0
    },
    form: {
        gap: 10
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
        padding: 8
    },
    logoutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    logoutText: {
        color: '#2e6480',
        fontSize: 14,
        fontFamily: 'Poppins-Regular'
    },
    disabledText: {
        opacity: 0.5
    }
})