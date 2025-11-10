import { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../hooks/useAuth'
import { refeicaoService, Refeicao } from '../../services/refeicaoService'
import { CardRefeicao } from '../../components/refeicao/cardRefeicao'
import { useFocusEffect } from '@react-navigation/native'
import { CustomAlert } from '../../components/customAlert'
import { CustomDropdown } from '../../components/customDropdown'
import { useAlert } from '../../hooks/useAlert'

export default function Home() {
    const { showAlert, hideAlert, alertVisible, alertConfig } = useAlert()
    const { usuario } = useAuth()
    const [refeicoes, setRefeicoes] = useState<Refeicao[]>([])
    const [carregando, setCarregando] = useState(true)
    const [carregandoHistorico, setCarregandoHistorico] = useState(false)
    const [mesesDisponiveis, setMesesDisponiveis] = useState<number[]>([])
    const hoje = new Date()
    const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth() + 1)
    const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear())
    const emExecucaoHistorico = useRef(false)
    const nomesMeses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    const opcoesMeses = mesesDisponiveis.map(mes => ({
        label: nomesMeses[mes - 1],
        value: mes
    }))
    const opcoesComPlaceholder = [
        { label: 'Selecionar mês', value: '' },
        ...opcoesMeses
    ]

    useFocusEffect(
        useCallback(() => {
            if (usuario?.id) {
                carregarMesesDisponiveis()
            }
        }, [usuario?.id])
    )

    const carregarMesesDisponiveis = async () => {
        if (!usuario?.id) return

        try {
            const meses = await refeicaoService.getMesesDisponiveis(usuario.id, anoSelecionado)
            setMesesDisponiveis(meses)

            if (!meses.includes(mesSelecionado)) {
                setRefeicoes([])
            }
        } catch (error) {
            console.error('Erro ao carregar meses disponíveis', error)
        }
    }

    useEffect(() => {
        carregarMesesDisponiveis()
    }, [anoSelecionado, usuario?.id])

    const carregarHistorico = async () => {
        if (!usuario?.id) return
        if (emExecucaoHistorico.current) return

        emExecucaoHistorico.current = true
        setCarregandoHistorico(true)
        setCarregando(true)

        try {
            const historico = await refeicaoService.getHistoricoMensal(
                usuario.id,
                mesSelecionado,
                anoSelecionado
            )
            setRefeicoes(historico)
        } catch (error) {
            console.error('Erro ao carregar histórico:', error)
            showAlert('Erro', 'Não foi possível carregar o histórico')
        } finally {
            emExecucaoHistorico.current = false
            setCarregandoHistorico(false)
            setCarregando(false)
        }
    }

    useEffect(() => {
        if (!usuario?.id) return

        if (mesesDisponiveis.includes(mesSelecionado)) {
            carregarHistorico()
        } else {
            setRefeicoes([])
        }
    }, [mesSelecionado, anoSelecionado, usuario?.id, mesesDisponiveis])

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
                    <View style={styles.filtroContainer}>
                        <Text style={styles.filtroLabel}>Mês:</Text>
                        {mesesDisponiveis.length === 0 ? (
                            <Text style={styles.semMesesText}>
                                Nenhum registro disponível neste ano
                            </Text>
                        ) : (
                            <CustomDropdown<number>
                                options={opcoesMeses}
                                selectedValue={mesSelecionado}
                                onValueChange={(value) => setMesSelecionado(value)}
                                placeholder="Selecionar mês"
                                width={160}
                            />
                        )}
                    </View>
                    {carregando ? (
                        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                            <ActivityIndicator size="large" color="#2e6480" />
                            <Text style={{ marginTop: 16, color: '#666' }}>Carregando refeições...</Text>
                        </View>
                    ) : (
                        <ScrollView
                            style={styles.historicoContainer}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {refeicoes.length === 0 ? (
                                <View style={styles.vazioContainer}>
                                    <Ionicons name="nutrition-outline" size={64} color="#ccc" />
                                    <Text style={styles.vazioText}>Nenhuma refeição registrada</Text>
                                    <Text style={styles.vazioSubtext}>
                                        Clique em "Registrar Refeição" para começar
                                    </Text>
                                </View>
                            ) : (
                                refeicoes.map((refeicao) => (
                                    <CardRefeicao
                                        key={refeicao.idRefeicao ?? Math.random().toString()}
                                        refeicao={refeicao}
                                        onPress={() =>
                                            router.push(`/detalhesRefeicao?id=${refeicao.idRefeicao}`)
                                        }
                                    />
                                ))
                            )}
                        </ScrollView>
                    )}

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
        flex: 1,
        backgroundColor: '#fafafa'
    },
    topSection: {
        padding: 2,
        marginTop: 25,
        alignItems: 'center'
    },
    bottomSection: {
        flex: 1,
        padding: 10,
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
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
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
    },
    filtroContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    filtroLabel: {
        fontSize: 16,
        color: '#5c503a',
        marginRight: 12,
        fontFamily: 'Poppins-Regular',
    },
    dropdownWrapper: {
        flex: 1,
        marginLeft: 8,
    },
    customDropdown: {
        flex: 1,
    },
    semMesesText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
        marginVertical: 8,
    }
})