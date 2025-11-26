import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Keyboard } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useAuth } from '../hooks/useAuth'
import { refeicaoService, Refeicao } from '../services/refeicaoService'
import { Button } from '../components/button'
import { Input } from '../components/input'
import { CustomAlert } from '../components/customAlert'
import { CustomConfirm } from '../components/customConfirm'
import { useAlert } from '../hooks/useAlert'
import { ScreenContainer } from '../components/screenContainer'
import { CustomDropdown } from '../components/customDropdown'

interface OpcaoEmocao {
    label: string
    value: string
}

export default function RegisterRefeicao() {
    const { showAlert, showConfirm, hideAlert, hideConfirm, alertVisible, confirmVisible, alertConfig, confirmConfig } = useAlert()
    const { usuario } = useAuth()
    const [carregando, setCarregando] = useState(false)
    const [data, setData] = useState(new Date())
    const [horario, setHorario] = useState(new Date())
    const [tipo, setTipo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [nivelFome, setNivelFome] = useState(1)
    const [nivelSaciedade, setNivelSaciedade] = useState(1)
    const [companhia, setCompanhia] = useState('')
    const [distracoes, setDistracoes] = useState('')
    const [emocoesAntes, setEmocoesAntes] = useState('')
    const [emocoesDepois, setEmocoesDepois] = useState('')
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)

    const opcoesEmocoes: OpcaoEmocao[] = [
        { label: '😊 Feliz', value: 'Feliz' },
        { label: '😞 Triste', value: 'Triste' },
        { label: '😌 Calmo', value: 'Calmo' },
        { label: '😰 Ansioso', value: 'Ansioso' },
        { label: '😣 Estressado', value: 'Estressado' },
        { label: '😐 Neutro', value: 'Neutro' },
        { label: '😔 Culpado', value: 'Culpado' },
        { label: '😤 Frustrado', value: 'Frustrado' },
        { label: '😴 Cansado', value: 'Cansado' },
        { label: '😎 Relaxado', value: 'Relaxado' },
        { label: '🥱 Entediado', value: 'Entediado' }
    ]

    const opcoesRefeicao = [
        'Café da manhã',
        'Almoço',
        'Jantar',
        'Lanche'
    ]

    const handleCadastrarRefeicao = async () => {
        if (!usuario?.id) {
            showAlert('Erro', 'Usuário não identificado')
            return
        }

        try {
            setCarregando(true)

            const novaRefeicao: Omit<Refeicao, 'idRefeicao'> = {
                data: data.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' }),
                horario: horario.toTimeString().split(' ')[0],
                tipo: tipo,
                descricao: descricao,
                nivelFome: nivelFome,
                nivelSaciedade: nivelSaciedade,
                companhia: companhia,
                distracoes: distracoes,
                emocoesAntes: emocoesAntes,
                emocoesDepois: emocoesDepois,
                usuario: { id: usuario.id }
            }

            await refeicaoService.cadastrar(novaRefeicao)
            showAlert('Sucesso', 'Refeição registrada!', () => {
                router.back()
            })
        } catch (error: any) {
            showAlert('Erro', error.message || 'Erro ao registrar refeição')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <ScreenContainer>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color="#2e6480" />
            </TouchableOpacity>

            <Text style={styles.title}>Registrar Refeição</Text>

            {/* data e hora */}
            <View style={styles.rowCompact}>
                <View style={styles.halfInputCompact}>
                    <Text style={styles.label}>Data *</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={styles.dataHorarioButtonCompact}
                    >
                        <Text style={styles.dataHorarioText}>
                            {data.toLocaleDateString('pt-BR')}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.halfInputCompact}>
                    <Text style={styles.label}>Horário *</Text>
                    <TouchableOpacity
                        onPress={() => setShowTimePicker(true)}
                        style={styles.dataHorarioButtonCompact}
                    >
                        <Text style={styles.dataHorarioText}>
                            {horario.toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={data}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false)
                        if (selectedDate) setData(selectedDate)
                    }}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={horario}
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedTime) => {
                        setShowTimePicker(false)
                        if (selectedTime) setHorario(selectedTime)
                    }}
                    is24Hour={true}
                />
            )}

            {/* tipo de refeição */}
            <Text style={styles.label}>Tipo de Refeição *</Text>
            <View style={styles.tipoContainer}>
                {opcoesRefeicao.map((opcao) => (
                    <TouchableOpacity
                        key={opcao}
                        style={[
                            styles.tipoButton,
                            tipo === opcao && styles.tipoButtonSelected
                        ]}
                        onPress={() => setTipo(opcao)}
                    >
                        <Text style={[
                            styles.tipoText,
                            tipo === opcao && styles.tipoTextSelected
                        ]}>
                            {opcao}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* descrição */}
            <Text style={styles.label}>O que você comeu?</Text>
            <View style={styles.inputContainer}>
                <Input
                    placeholder="Escreva brevemente o que você comeu"
                    value={descricao}
                    onChangeText={setDescricao}
                    multiline
                    numberOfLines={3}
                    multilineHeight={100}
                    textAlignVertical="top"
                    textAlign="left"
                />
            </View>

            {/* níveis de fome/saciedade */}
            <Text style={styles.label}>Nível de fome antes*</Text>
            <View style={styles.nivelContainer}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((nivel) => (
                    <TouchableOpacity
                        key={nivel}
                        style={[
                            styles.nivelButton,
                            nivelFome === nivel && styles.nivelButtonSelected
                        ]}
                        onPress={() => {
                            Keyboard.dismiss()
                            setNivelFome(nivel)
                        }}
                    >
                        <Text style={[
                            styles.nivelText,
                            nivelFome === nivel && styles.nivelTextSelected
                        ]}>
                            {nivel}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Nível de saciedade após*</Text>
            <View style={styles.nivelContainer}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((nivel) => (
                    <TouchableOpacity
                        key={nivel}
                        style={[
                            styles.nivelButton,
                            nivelSaciedade === nivel && styles.nivelButtonSelected
                        ]}
                        onPress={() => setNivelSaciedade(nivel)}
                    >
                        <Text style={[
                            styles.nivelText,
                            nivelSaciedade === nivel && styles.nivelTextSelected
                        ]}>
                            {nivel}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* emoções */}
            <Text style={styles.label}>Emoções</Text>
            <View style={styles.emocoesRow}>
                <View style={styles.emocoesColumn}>
                    <Text style={styles.emocoesLabel}>Antes</Text>
                    <CustomDropdown
                        options={opcoesEmocoes}
                        selectedValue={emocoesAntes}
                        onValueChange={setEmocoesAntes}
                        placeholder="Selecionar"
                        style={styles.emocaoDropdown}
                    />
                </View>

                <View style={styles.emocoesColumn}>
                    <Text style={styles.emocoesLabel}>Depois</Text>
                    <CustomDropdown
                        options={opcoesEmocoes}
                        selectedValue={emocoesDepois}
                        onValueChange={setEmocoesDepois}
                        placeholder="Selecionar"
                        style={styles.emocaoDropdown}
                    />
                </View>
            </View>

            {/* companhia */}
            <Text style={styles.label}>Companhia</Text>
            <View style={styles.opcaoContainer}>
                <TouchableOpacity
                    style={[styles.opcaoButton, companhia === 'Sim' && styles.opcaoButtonSelected]}
                    onPress={() => setCompanhia('Sim')}
                >
                    <Text style={[styles.opcaoText, companhia === 'Sim' && styles.opcaoTextSelected]}>
                        Sim
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.opcaoButton, companhia === 'Não' && styles.opcaoButtonSelected]}
                    onPress={() => setCompanhia('Não')}
                >
                    <Text style={[styles.opcaoText, companhia === 'Não' && styles.opcaoTextSelected]}>
                        Não
                    </Text>
                </TouchableOpacity>
            </View>

            {/* distrações */}
            <Text style={styles.label}>Distrações</Text>
            <View style={styles.opcaoContainer}>
                <TouchableOpacity
                    style={[styles.opcaoButton, distracoes === 'Sim' && styles.opcaoButtonSelected]}
                    onPress={() => setDistracoes('Sim')}
                >
                    <Text style={[styles.opcaoText, distracoes === 'Sim' && styles.opcaoTextSelected]}>
                        Sim
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.opcaoButton, distracoes === 'Não' && styles.opcaoButtonSelected]}
                    onPress={() => setDistracoes('Não')}
                >
                    <Text style={[styles.opcaoText, distracoes === 'Não' && styles.opcaoTextSelected]}>
                        Não
                    </Text>
                </TouchableOpacity>
            </View>

            <Button
                title={carregando ? "Registrando..." : "Registrar Refeição"}
                onPress={handleCadastrarRefeicao}
                style={styles.registerButton}
                disabled={carregando}
            />
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
        </ScreenContainer>
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
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    backText: {
        color: '#2e6480',
        marginLeft: 8,
        fontSize: 16,
        fontFamily: 'Poppins-Medium'
    },
    title: {
        fontSize: 22,
        color: '#5c503a',
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        paddingTop: 2
    },
    rowCompact: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    halfInputCompact: {
        width: '48%'
    },
    dataHorarioButtonCompact: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 100
    },
    dataHorarioText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center'
    },
    tipoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    tipoButton: {
        width: '48%',
        padding: 14,
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2e6480',
        marginBottom: 12
    },
    tipoButtonSelected: {
        borderColor: '#2e6480',
        backgroundColor: '#e8f4fd'
    },
    tipoText: {
        color: '#ffffff',
        fontWeight: '500',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center'
    },
    tipoTextSelected: {
        color: '#2e6480',
        fontWeight: '500',
        fontFamily: 'Poppins-Bold'
    },
    label: {
        fontSize: 16,
        color: '#5c503a',
        marginBottom: 5,
        marginTop: 10,
        fontFamily: 'Poppins-Medium'
    },
    inputContainer: {
        marginBottom: 10
    },
    nivelContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    nivelButton: {
        width: '18%',
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginVertical: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2e6480'
    },
    nivelButtonSelected: {
        borderColor: '#2e6480',
        backgroundColor: '#e8f4fd'
    },
    nivelText: {
        color: '#ffffff',
        fontWeight: '500',
        fontSize: 16,
        textAlign: 'center',
        includeFontPadding: false,
        fontFamily: 'Poppins-Bold'
    },
    nivelTextSelected: {
        color: '#2e6480',
        fontWeight: '500',
        fontFamily: 'Poppins-Bold'
    },
    emocoesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    emocoesColumn: {
        width: '48%'
    },
    emocoesLabel: {
        fontSize: 14,
        color: '#5c503a',
        marginBottom: 5,
        fontFamily: 'Poppins-Medium'
    },
    emocaoDropdown: {
        width: '100%'
    },
    opcaoContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 10
    },
    opcaoButton: {
        flex: 1,
        padding: 16,
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#2e6480'
    },
    opcaoButtonSelected: {
        borderColor: '#2e6480',
        backgroundColor: '#e8f4fd'
    },
    opcaoText: {
        color: '#ffffff',
        fontWeight: '500',
        fontFamily: 'Poppins-Regular'
    },
    opcaoTextSelected: {
        color: '#2e6480',
        fontWeight: '500',
        fontFamily: 'Poppins-Bold'
    },
    registerButton: {
        marginTop: 20,
        marginBottom: 40,
        backgroundColor: '#2e6480'
    }
})