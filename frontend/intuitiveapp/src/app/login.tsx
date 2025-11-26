import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { Button } from '../components/button'
import { Input } from '../components/input'
import { useAuth } from '../hooks/useAuth'
import { CustomAlert } from '../components/customAlert'
import { useAlert } from '../hooks/useAlert'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
    useFonts,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic
} from '@expo-google-fonts/poppins'

export default function Login() {
    const { showAlert, hideAlert, alertVisible, alertConfig } = useAlert()
    const { login, carregando } = useAuth()
    const [fontsLoaded] = useFonts({
        'Poppins-Light': Poppins_300Light,
        'Poppins-LightItalic': Poppins_300Light_Italic,
        'Poppins-Regular': Poppins_400Regular,
        'Poppins-Italic': Poppins_400Regular_Italic,
        'Poppins-Medium': Poppins_500Medium,
        'Poppins-MediumItalic': Poppins_500Medium_Italic,
        'Poppins-Bold': Poppins_700Bold,
        'Poppins-BoldItalic': Poppins_700Bold_Italic,
    })
    const [email, setEmail] = useState('')
    const [tecladoVisivel, setTecladoVisivel] = useState(false)
    const [senha, setSenha] = useState('')

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setTecladoVisivel(true)
        )
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setTecladoVisivel(false)
        )

        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        }
    }, [])

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2e6480" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        )
    }

    const handleLogin = async () => {
        const resultado = await login({ email, senha})

        if (resultado.success) {
            router.navigate("/tabs/home")
        } else {
            showAlert('Erro de login', resultado.error as string)
        }
    }

    function handleRegister() {
        router.navigate("/register")
    }

    function handleForgotPassword() {
        router.navigate("/forgotPassword")
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="height"
            enabled={tecladoVisivel}
        >
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={styles.container}
                        onStartShouldSetResponder={Platform.OS === 'web' ? undefined : () => true}

                        onResponderRelease={Keyboard.dismiss}
                    >
                        <View style={styles.header}>
                            <Image
                                source={require('../../assets/images/Logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>

                        {/* login */}
                        <View style={styles.form}>
                            <Input
                                placeholder="E-mail"
                                onChangeText={setEmail}
                                value={email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!carregando}
                            />

                            <Input
                                placeholder="Senha"
                                onChangeText={setSenha}
                                value={senha}
                                secureTextEntry
                                editable={!carregando}
                            />

                            <TouchableOpacity onPress={handleForgotPassword} disabled={carregando}>
                                <Text style={[styles.forgotPassword, carregando && styles.disabledText, { fontFamily: 'Poppins-Regular' }]}>
                                    Esqueceu a senha?
                                </Text>
                            </TouchableOpacity>

                            <Button
                                title={carregando ? "Entrando..." : "Entrar"}
                                onPress={handleLogin}
                                style={styles.loginButton}
                                disabled={carregando}
                            />
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Não tem uma conta? </Text>
                            <TouchableOpacity onPress={handleRegister} disabled={carregando}>
                                <Text style={[styles.registerLink, carregando && styles.disabledText]}>
                                    Cadastre-se
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <CustomAlert
                            visible={alertVisible}
                            title={alertConfig.title}
                            message={alertConfig.message}
                            onClose={hideAlert}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    container: {
        flex: 1,
        padding: 32,
        justifyContent: "center",
        backgroundColor: '#fafafa',
        maxWidth: '100%',
        width: '100%'
    },
    scrollContent: {
        flexGrow: 1
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    loadingText: {
        marginTop: 16,
        color: '#2e6480',
        fontSize: 16
    },
    header: {
        alignItems: "center",
        marginBottom: 40
    },
    logo: {
        width: 400,
        height: 250
    },
    form: {
        gap: 16,
        marginBottom: 32,
        width: '100%'
    },
    forgotPassword: {
        color: '#5c503a',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 8
    },
    loginButton: {
        marginTop: 24,
        backgroundColor: '#2e6480'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    footerText: {
        color: '#5c503a',
        fontSize: 16,
        fontFamily: 'Poppins-Regular'
    },
    registerLink: {
        color: '#5c503a',
        fontFamily: 'Poppins-Bold',
        fontSize: 16
    },
    disabledText: {
        opacity: 0.5,
    }
})