import { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PieChart } from 'react-native-gifted-charts'
import { useAuth } from '../../hooks/useAuth'
import { useAlert } from '../../hooks/useAlert'
import { dashboardService, DashboardData } from '../../services/dashboardService'
import { useFocusEffect } from '@react-navigation/native'

function isValidPieArray(arr: any): arr is { value: number; label?: string; color?: string }[] {
    if (!Array.isArray(arr)) return false
    if (arr.length === 0) return false
    let total = 0
    for (const it of arr) {
        if (!it || typeof it.value === 'undefined') return false
        const n = Number(it.value)
        if (Number.isNaN(n)) return false
        total += n
    }
    return total > 0
}

type Periodo = '7dias' | 'mes'

export default function Dashboard() {
    const { usuario } = useAuth()
    const { showAlert } = useAlert()
    const [periodoSelecionado, setPeriodoSelecionado] = useState<Periodo>('7dias')
    const [dados, setDados] = useState<DashboardData | null>(null)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        carregarDados()
    }, [periodoSelecionado, usuario?.id])

    const carregarDados = async () => {
        if (!usuario?.id) return

        try {
            setCarregando(true)
            let dadosBackend: DashboardData | null = null

            if (periodoSelecionado === '7dias') {
                dadosBackend = await dashboardService.getDados7Dias(usuario.id)
            } else {
                dadosBackend = await dashboardService.getDadosMensais(usuario.id)
            }

            if (!dadosBackend) {
                dadosBackend = {
                    mediaRefeicoesDiarias: 0,
                    distracao: { dados: [], mensagem: 'Sem dados' },
                    emocoesAntes: [],
                    emocoesDepois: []
                }
            }

            dadosBackend.emocoesAntes = dadosBackend.emocoesAntes || []
            dadosBackend.emocoesDepois = dadosBackend.emocoesDepois || []
            dadosBackend.distracao = dadosBackend.distracao || { dados: [], mensagem: 'Sem dados' }

            setDados(dadosBackend)
        } catch (error: any) {
            console.error('Erro ao carregar dashboard:', error)
            setDados({
                mediaRefeicoesDiarias: 0,
                distracao: { dados: [], mensagem: 'Sem dados' },
                emocoesAntes: [],
                emocoesDepois: []
            })

            showAlert('Erro', 'Não foi possível carregar os dados do dashboard.')
        } finally {
            setCarregando(false)
        }
    }


    useFocusEffect(
        useCallback(() => {
            carregarDados()
        }, [periodoSelecionado, usuario?.id])
    )

    if (carregando) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#2e6480" />
                    <Text style={{ marginTop: 16, color: '#666' }}>Carregando dashboard...</Text>
                </View>
            </SafeAreaView>
        )
    }

    if (!dados) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: '#666', textAlign: 'center' }}>
                        Não foi possível carregar os dados do dashboard
                    </Text>
                </View>
            </SafeAreaView>
        )
    }

    const nomeEmocoes: Record<string, string> = {
        '😊': 'Feliz',
        '😌': 'Calmo',
        '😞': 'Triste',
        '😰': 'Ansioso',
        '😣': 'Estressado',
        '😐': 'Neutro',
        '😔': 'Culpado',
        '😤': 'Frustrado',
        '😴': 'Cansado',
        '😎': 'Relaxado',
        '🥱': 'Entediado',
    }

    const getNomeEmocao = (emoji: string) => nomeEmocoes[emoji] || ''


    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView style={styles.container}>
                {/* nav período */}
                <View style={styles.navegacaoContainer}>
                    <TouchableOpacity
                        style={[
                            styles.botaoPeriodo,
                            periodoSelecionado === '7dias' && styles.botaoPeriodoSelecionado
                        ]}
                        onPress={() => setPeriodoSelecionado('7dias')}
                    >
                        <Text style={[
                            styles.botaoPeriodoTexto,
                            periodoSelecionado === '7dias' && styles.botaoPeriodoTextoSelecionado
                        ]}>
                            Últimos 7 dias
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.botaoPeriodo,
                            periodoSelecionado === 'mes' && styles.botaoPeriodoSelecionado
                        ]}
                        onPress={() => setPeriodoSelecionado('mes')}
                    >
                        <Text style={[
                            styles.botaoPeriodoTexto,
                            periodoSelecionado === 'mes' && styles.botaoPeriodoTextoSelecionado
                        ]}>
                            Mês
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* média refeições diarias */}
                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>Média de Refeições Diárias</Text>
                    <Text style={styles.mediaTexto}>{dados.mediaRefeicoesDiarias.toFixed(1)}</Text>
                    <Text style={styles.cardSubtitulo}>
                        {periodoSelecionado === '7dias'
                            ? 'Sua média nos últimos 7 dias'
                            : 'Sua média nos últimos 30 dias'
                        }
                    </Text>
                </View>

                {/* % distração */}
                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>Distração</Text>
                    <View style={styles.graficoContainer}>
                        {isValidPieArray(dados.distracao?.dados) ? (
                            <PieChart
                                data={dados.distracao.dados.map(item => ({
                                    ...item,
                                    value: Number(item.value),
                                    text: item.label,
                                    textSize: 15,
                                }))}
                                donut
                                radius={100}
                                showText
                                textColor="#000000"
                                textSize={15}
                                showValuesAsLabels
                                centerLabelComponent={() => {
                                    const arr = dados.distracao.dados
                                    const total = arr.reduce((s, it) => s + Number(it.value), 0)
                                    const maior = arr.reduce((prev, cur) => (Number(cur.value) > Number(prev.value) ? cur : prev))
                                    const percentual = Math.round((Number(maior.value) / total) * 100)
                                    return (
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 20, fontWeight: '700', color: '#2e6480' }}>
                                                {maior.label}
                                            </Text>
                                            <Text style={{ fontSize: 16, color: '#444' }}>{percentual}%</Text>
                                        </View>
                                    )
                                }}
                            />
                        ) : (
                            <View style={{ alignItems: 'center', justifyContent: 'center', height: 200 }}>
                                <Text style={{ color: '#999' }}>{dados.distracao?.mensagem || 'Sem dados'}</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.cardSubtitulo}>
                        {dados.distracao?.mensagem}
                    </Text>
                </View>


                {/* % emoção antes */}
                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>Suas Emoções Antes</Text>
                    <View style={styles.graficoContainer}>
                        {isValidPieArray(dados.emocoesAntes) ? (
                            <PieChart
                                data={dados.emocoesAntes.map(emocao => ({
                                    value: Number(emocao.value),
                                    color: emocao.color,
                                    text: emocao.label,
                                    textSize: 18,
                                }))}
                                donut
                                showText
                                textColor="#000000"
                                radius={100}
                                centerLabelComponent={() => {
                                    const arr = dados.emocoesAntes
                                    const total = arr.reduce((s, it) => s + Number(it.value), 0)
                                    const maior = arr.reduce((prev, cur) => (Number(cur.value) > Number(prev.value) ? cur : prev))
                                    const percentual = Math.round((Number(maior.value) / total) * 100)
                                    return (
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 22, fontWeight: '700', color: '#2e6480' }}>
                                                {maior.label}
                                            </Text>
                                            <Text style={{ fontSize: 16, fontWeight: '500', color: '#333' }}>
                                                {percentual}%
                                            </Text>
                                        </View>
                                    )
                                }}
                            />
                        ) : (
                            <View style={{ alignItems: 'center', justifyContent: 'center', height: 200 }}>
                                <Text style={{ color: '#999' }}>Sem dados</Text>
                            </View>
                        )}
                    </View>
                    {/* legenda */}
                    <View style={styles.legendaContainer}>
                        {dados.emocoesAntes.map(emocao => (
                            <View key={emocao.label} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 6 }}>
                                <Text style={{ fontSize: 18 }}>{emocao.label}</Text>
                                <Text style={{ marginLeft: 4, color: '#333' }}>{getNomeEmocao(emocao.label)}</Text>
                            </View>
                        ))}
                    </View>

                </View>


                {/* % emoção depois */}
                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>Suas Emoções Depois</Text>
                    <View style={styles.graficoContainer}>
                        {isValidPieArray(dados.emocoesDepois) ? (
                            <PieChart
                                data={dados.emocoesDepois.map(emocao => ({
                                    value: Number(emocao.value),
                                    color: emocao.color,
                                    text: emocao.label,
                                    textSize: 18,
                                }))}
                                donut
                                showText
                                textColor="#000000"
                                radius={100}
                                centerLabelComponent={() => {
                                    const arr = dados.emocoesDepois
                                    const total = arr.reduce((s, it) => s + Number(it.value), 0)
                                    const maior = arr.reduce((prev, cur) => (Number(cur.value) > Number(prev.value) ? cur : prev))
                                    const percentual = Math.round((Number(maior.value) / total) * 100)
                                    return (
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 22, fontWeight: '700', color: '#2e6480' }}>
                                                {maior.label}
                                            </Text>
                                            <Text style={{ fontSize: 16, fontWeight: '500', color: '#333' }}>
                                                {percentual}%
                                            </Text>
                                        </View>
                                    )
                                }}
                            />
                        ) : (
                            <View style={{ alignItems: 'center', justifyContent: 'center', height: 200 }}>
                                <Text style={{ color: '#999' }}>Sem dados</Text>
                            </View>
                        )}
                    </View>
                    {/* legenda */}
                    <View style={styles.legendaContainer}>
                        {dados.emocoesDepois.map(emocao => (
                            <View key={emocao.label} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 6 }}>
                                <Text style={{ fontSize: 18 }}>{emocao.label}</Text>
                                <Text style={{ marginLeft: 4, color: '#333' }}>{getNomeEmocao(emocao.label)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    container: {
        flex: 1,
        padding: 16
    },
    navegacaoContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    botaoPeriodo: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8
    },
    botaoPeriodoSelecionado: {
        backgroundColor: '#2e6480'
    },
    botaoPeriodoTexto: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666'
    },
    botaoPeriodoTextoSelecionado: {
        color: '#ffffff'
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    cardTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e6480',
        marginBottom: 8,
        fontFamily: 'Poppins-Bold'
    },
    mediaTexto: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#5c503a',
        textAlign: 'center',
        marginVertical: 8
    },
    cardSubtitulo: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
    },
    graficoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
    legendaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8
    },
    legendaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        marginVertical: 4
    },
    legendaCor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 4
    },
    legendaTexto: {
        fontSize: 14,
        color: '#333'
    }
})