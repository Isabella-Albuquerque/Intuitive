import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useState } from 'react'
import { router } from 'expo-router'
import { Input } from '../components/input'
import { Button } from '../components/button'
import { CustomAlert } from '../components/customAlert'
import { useAlert } from '../hooks/useAlert'

export default function ForgotPassword() {
    const { showAlert, hideAlert, alertVisible, alertConfig } = useAlert()

    const [email, setEmail] = useState('')
    const [carregando, setCarregando] = useState(false)

    const handleRecuperarSenha = async () => {
        if (!email) {
            showAlert('Erro', 'Por favor, informe seu e-mail')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            showAlert('Erro', 'Por favor, insira um email válido')
            return
        }

        setCarregando(true)

        try {
            // simula o envio do email
            showAlert('Pronto',
                'Se seu email estiver na base de dados, você receberá um link de recuperação.',
                () => router.back()
            )
        } catch (error) {
            showAlert('Erro', 'Não foi possível enviar o email de recuperação. Tente novamente.')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recuperar Senha</Text>
            <Text style={styles.subtitle}>
                Informe seu e-mail para receber o link de recuperação
            </Text>

            <Input
                placeholder="E-mail"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!carregando}
            />

            <Button
                title={carregando ? "Enviando..." : "Enviar link"}
                onPress={handleRecuperarSenha}
                style={styles.enviarButton}
                disabled={carregando}
            />

            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
                disabled={carregando}
            >
                <Text style={[styles.backText, carregando && styles.disabledText]}>
                    Voltar para Login
                </Text>
            </TouchableOpacity>

            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={hideAlert}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 32,
        color: '#2e6480',
        marginBottom: 8,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold'
    },
    subtitle: {
        fontSize: 16,
        color: '#8a705c',
        marginBottom: 32,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
    },
    enviarButton: {
        marginTop: 20,
        backgroundColor: '#2e6480',
        width: '100%'
    },
    backButton: {
        marginTop: 20,
        padding: 16
    },
    backText: {
        color: '#8a705c',
        fontSize: 16,
        fontFamily: 'Poppins-Regular'
    },
    disabledText: {
        opacity: 0.5
    }
})