import { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../hooks/useAuth'
import { refeicaoService, Refeicao } from '../../services/refeicaoService'
import { CardRefeicao } from '../../components/refeicao/cardRefeicao'
import { useFocusEffect } from '@react-navigation/native'
import { CustomAlert } from '../../components/customAlert'
import { useAlert } from '../../hooks/useAlert'

export default function Home() {
    const { showAlert, hideAlert, alertVisible, alertConfig } = useAlert()
    const { usuario } = useAuth()
    const [refeicoes, setRefeicoes] = useState<Refeicao[]>([])
    const [carregando, setCarregando] = useState(true)

    useFocusEffect(
        useCallback(() => {
            if (usuario?.id) {
                carregarHistorico()
            }
        }, [usuario?.id])
    )

    const carregarHistorico = async () => {
        if (!usuario?.id) {
            console.log('usuário não disponivel ainda')
            return
        }

        try {
            setCarregando(true)
            const hoje = new Date()
            const historico = await refeicaoService.getHistoricoMensal(
                usuario.id,
                hoje.getMonth() + 1,
                hoje.getFullYear()
            )
            setRefeicoes(historico)
        } catch (error) {
            console.error('Erro ao carregar histórico:', error)
            showAlert('Erro', 'Não foi possível carregar o histórico')
        } finally {
            setCarregando(false)
        }
    }

    const navegarParaCadastro = () => {
        router.push('/registroRefeicao')
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <View style={styles.topSection}>
                    <TouchableOpacity style={styles.btnAdicionar} onPress={navegarParaCadastro}>
                        <Ionicons name="add-circle" size={32} color="#2e6480" />
                        <Text style={styles.btnText}>Registrar Refeição</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomSection}>
                    <Text style={styles.sectionTitle}>Histórico de Refeições</Text>
                    <ScrollView style={styles.historicoContainer}>
                        {carregando ? (
                            <Text style={styles.carregandoText}>Carregando...</Text>
                        ) : refeicoes.length === 0 ? (
                            <View style={styles.vazioContainer}>
                                <Ionicons name="nutrition-outline" size={64} color="#ccc" />
                                <Text style={styles.vazioText}>Nenhuma refeição registrada</Text>
                                <Text style={styles.vazioSubtext}>Clique em "Registrar Refeição" para começar</Text>
                            </View>
                        ) : (
                            refeicoes.map((refeicao) => (
                                <CardRefeicao
                                    key={refeicao.idRefeicao}
                                    refeicao={refeicao}
                                    onPress={() => router.push(`/detalhesRefeicao?id=${refeicao.idRefeicao}`)}
                                />
                            ))
                        )}
                    </ScrollView>

                    <CustomAlert
                        visible={alertVisible}
                        title={alertConfig.title}
                        message={alertConfig.message}
                        onClose={hideAlert}
                    />
                </View>
            </View>
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
        backgroundColor: '#fafafa'
    },
    topSection: {
        padding: 20,
        marginTop: 25,
        alignItems: 'center'
    },
    bottomSection: {
        flex: 1,
        padding: 16,
        marginTop: 4
    },
    btnAdicionar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#2e6480',
        borderStyle: 'dashed'
    },
    btnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e6480',
        marginLeft: 12,
        fontFamily: 'Poppins-Italic'
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5c503a',
        marginBottom: 16,
        fontFamily: 'Poppins-Bold'
    },
    historicoContainer: {
        flex: 1
    },
    carregandoText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
        fontFamily: 'Poppins-Regular'
    },
    vazioContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40
    },
    vazioText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
    },
    vazioSubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
    }
})