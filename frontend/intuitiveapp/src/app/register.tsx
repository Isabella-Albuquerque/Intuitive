import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch, SafeAreaView, Platform, StatusBar } from 'react-native'
import { router } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { Button } from '../components/button'
import { Input } from '../components/input'
import { CustomModal } from '../components/modal'
import { useAuth } from '../hooks/useAuth'
import { CustomAlert } from '../components/customAlert'
import { useAlert } from '../hooks/useAlert'

export default function Register() {
    const { showAlert, hideAlert, alertVisible, alertConfig } = useAlert()

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [dataNascimento, setDataNascimento] = useState<Date | null>(new Date(2000, 0, 1))
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [sexo, setSexo] = useState('')
    const [aceitouTermos, setAceitouTermos] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const { register, carregando } = useAuth()
    const [modalVisible, setModalVisible] = useState(false)
    const [modalContent, setModalContent] = useState('')
    const [modalTitle, setModalTitle] = useState('')

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false)
        if (selectedDate) {
            setDataNascimento(selectedDate)
        }
    }

    const formatarData = (date: Date | null) => {
        if (!date) return 'Data de Nascimento'
        return date.toLocaleDateString('pt-BR')
    }

    const handleRegister = async () => {
        if (!aceitouTermos) {
            showAlert('Erro', 'Você deve aceitar os Termos de Uso e Política de Privacidade')
            return
        }

        if (senha !== confirmarSenha) {
            showAlert('Erro', 'As senhas não coincidem')
            return
        }

        const resultado = await register({
            nome,
            email,
            senha,
            sexo,
            dtNascimento: dataNascimento ? dataNascimento.toISOString().split('T')[0] : ''
        })

        if (resultado.success) {
            showAlert('Sucesso', 'Conta criada com sucesso!', () => router.back())
        } else {
            showAlert('Erro no cadastro', resultado.error as string)
        }
    }

    const mostrarTermosUso = () => {
        setModalTitle('Termos de Uso')
        setModalContent(termosUsoTexto)
        setModalVisible(true)
    }

    const mostrarPoliticaPrivacidade = () => {
        setModalTitle('Política de Privacidade')
        setModalContent(politicaPrivacidadeTexto)
        setModalVisible(true)
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.simpleBackButton}
                    disabled={carregando}
                >
                    <Ionicons name="arrow-back" size={32} color="#2e6480" />
                </TouchableOpacity>

                <Text style={styles.title}>Intuitive</Text>
                <Text style={styles.subtitle}>Cadastro</Text>

                <View style={styles.form}>
                    {/* nome */}
                    <Text style={styles.sectionTitle}>Nome</Text>
                    <Input
                        placeholder="Nome"
                        onChangeText={setNome}
                        value={nome}
                        editable={!carregando}
                    />

                    {/* email */}
                    <Text style={styles.sectionTitle}>E-mail</Text>
                    <Input
                        placeholder="E-mail"
                        onChangeText={setEmail}
                        value={email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!carregando}
                    />

                    {/* data de nascimento */}
                    <Text style={styles.sectionTitle}>Data de Nascimento</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        disabled={carregando}
                    >
                        <Input
                            placeholder="Data de Nascimento"
                            placeholderTextColor="#a08d80"
                            value={dataNascimento ? formatarData(dataNascimento) : ''}
                            editable={false}
                            pointerEvents="none"
                        />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={dataNascimento || new Date()}
                            mode="date"
                            display="spinner"
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                        />
                    )}

                    {/* sexo */}
                    <Text style={styles.sectionTitle}>Sexo</Text>
                    <View style={styles.sexoContainer}>
                        <TouchableOpacity
                            style={[styles.sexoButton, sexo === 'M' && styles.sexoButtonSelected]}
                            onPress={() => setSexo('M')}
                            disabled={carregando}
                        >
                            <Text style={[styles.sexoText, sexo === 'M' && styles.sexoTextSelected]}>
                                Masculino
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.sexoButton, sexo === 'F' && styles.sexoButtonSelected]}
                            onPress={() => setSexo('F')}
                            disabled={carregando}
                        >
                            <Text style={[styles.sexoText, sexo === 'F' && styles.sexoTextSelected]}>
                                Feminino
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* senha */}
                    <Text style={styles.sectionTitle}>Senha</Text>
                    <Input
                        placeholder="Senha"
                        onChangeText={setSenha}
                        value={senha}
                        secureTextEntry
                        editable={!carregando}
                    />

                    {/* confirmar senha */}
                    <Text style={styles.sectionTitle}>Confirme a senha</Text>
                    <Input
                        placeholder="Confirme sua senha"
                        onChangeText={setConfirmarSenha}
                        value={confirmarSenha}
                        secureTextEntry
                        editable={!carregando}
                    />

                    {/* termos de uso */}
                    <View style={styles.termosContainer}>
                        <Switch
                            value={aceitouTermos}
                            onValueChange={setAceitouTermos}
                            disabled={carregando}
                            thumbColor={aceitouTermos ? '#2e6480' : '#f4f3f4'}
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                        />
                        <Text style={styles.termosText}>
                            Eu li e concordo com os{' '}
                            <Text style={styles.link} onPress={mostrarTermosUso}>
                                Termos de Uso
                            </Text>{' '}
                            e{' '}
                            <Text style={styles.link} onPress={mostrarPoliticaPrivacidade}>
                                Política de Privacidade
                            </Text>
                        </Text>
                    </View>
                    <CustomModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        title={modalTitle}
                    >
                        <Text style={styles.modalText}>{modalContent}</Text>
                    </CustomModal>

                    <Button
                        title={carregando ? "Criando conta..." : "Criar conta"}
                        onPress={handleRegister}
                        style={styles.registerButton}
                        disabled={carregando}
                    />

                    <TouchableOpacity
                        onPress={() => router.back()}
                        disabled={carregando}
                    >
                        <Text style={[styles.backText, carregando && styles.disabledText]}>
                            Já tem uma conta? Faça login
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
        </SafeAreaView>
    )
}

const termosUsoTexto = `
TERMOS DE USO DO INTUITIVE

1. ACEITAÇÃO DOS TERMOS
Ao criar uma conta no Intuitive, você concorda com estes Termos de Uso e com nossa Política de Privacidade.

2. SERVIÇOS OFERECIDOS
----------------------
3. CADASTRO
----------------------
4. RESPONSABILIDADES
----------------------
5. PROPRIEDADE INTELECTUAL
----------------------
6. LIMITAÇÃO DE RESPONSABILIDADE
----------------------
7. ALTERAÇÕES NOS TERMOS
----------------------
8. LEI APLICÁVEL
----------------------
`

const politicaPrivacidadeTexto = `
POLÍTICA DE PRIVACIDADE DO INTUITIVE

1. INFORMAÇÕES COLETADAS
----------------------
2. USO DAS INFORMAÇÕES
----------------------
3. COMPARTILHAMENTO DE INFORMAÇÕES
----------------------
4. SEGURANÇA
----------------------
5. SEUS DIREITOS
----------------------
6. RETENÇÃO DE DADOS
----------------------
7. ALTERAÇÕES
----------------------
8. CONTATO
----------------------
`

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
    simpleBackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    title: {
        fontSize: 52,
        color: '#2e6480',
        textAlign: 'center',
        fontFamily: 'Poppins-Italic',
    },
    subtitle: {
        fontSize: 22,
        color: '#5c503a',
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        marginBottom: 10
    },
    form: {
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#5c503a',
        marginBottom: 4,
        fontFamily: 'Poppins-Medium'
    },
    sexoContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    sexoButton: {
        flex: 1,
        padding: 16,
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    sexoButtonSelected: {
        borderColor: '#2e6480',
        backgroundColor: '#e8f4fd'
    },
    sexoText: {
        color: '#666',
        fontWeight: '500',
        fontFamily: 'Poppins-Regular'
    },
    sexoTextSelected: {
        color: '#2e6480',
        fontWeight: 'bold'
    },
    termosContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginVertical: 16,
        borderRadius: 8
    },
    link: {
        color: '#8a705c',
        textDecorationLine: 'underline',
        fontFamily: 'Poppins-Bold'
    },
    modalText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
    termosText: {
        flex: 1,
        color: '#666',
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Poppins-Regular'
    },
    registerButton: {
        marginTop: 8,
        backgroundColor: '#2e6480'
    },
    backText: {
        color: '#5c503a',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14
    },
    disabledText: {
        opacity: 0.5,
    }
})