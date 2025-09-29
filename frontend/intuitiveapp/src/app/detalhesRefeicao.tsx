import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, SafeAreaView, Platform, StatusBar } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useAuth } from '../hooks/useAuth'
import { refeicaoService, Refeicao } from '../services/refeicaoService'
import { Button } from '../components/button'
import { Input } from '../components/input'
import { CustomAlert } from '../components/customAlert'
import { CustomConfirm } from '../components/customConfirm'
import { useAlert } from '../hooks/useAlert'

interface DropdownEmocoesProps {
    visible: boolean
    onClose: () => void
    onSelect: (value: string) => void
    valorAtual: string
}

interface OpcaoEmocao {
    label: string
    value: string
}

export default function DetalhesRefeicao() {
    const { showAlert, hideAlert, alertVisible, alertConfig } = useAlert()
    const { showConfirm, hideConfirm, confirmVisible, confirmConfig } = useAlert()

    const { id } = useLocalSearchParams()
    const { usuario } = useAuth()
    const [editMode, setEditMode] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const [carregandoDados, setCarregandoDados] = useState(true)

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

    const [showEmocoesAntesDropdown, setShowEmocoesAntesDropdown] = useState(false)
    const [showEmocoesDepoisDropdown, setShowEmocoesDepoisDropdown] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)

    const opcoesEmocoes: OpcaoEmocao[] = [
        { label: '😊 Feliz', value: 'Feliz' },
        { label: '😞 Triste', value: 'Triste' },
        { label: '😌 Calmo', value: 'Calmo' },
        { label: '😰 Ansioso', value: 'Ansioso' },
        { label: '😣 Estressado', value: 'Estressado' }
    ]

    const opcoesRefeicao = ['Café da manhã', 'Almoço', 'Jantar', 'Lanche']

    useEffect(() => {
        carregarRefeicao()
    }, [id])

    const carregarRefeicao = async () => {
        if (!id) return

        try {
            setCarregandoDados(true)
            const refeicao = await refeicaoService.consultarPorId(Number(id))

            if (refeicao) {
                setData(new Date(refeicao.data + 'T00:00:00'))
                setHorario(new Date(`2000-01-01T${refeicao.horario}`))
                setTipo(refeicao.tipo)
                setDescricao(refeicao.descricao || '')
                setNivelFome(refeicao.nivelFome)
                setNivelSaciedade(refeicao.nivelSaciedade)
                setCompanhia(refeicao.companhia || '')
                setDistracoes(refeicao.distracoes || '')
                setEmocoesAntes(refeicao.emocoesAntes || '')
                setEmocoesDepois(refeicao.emocoesDepois || '')
            }
        } catch (error: any) {
            showAlert('Erro', error.message || 'Não foi possível carregar os dados da refeição')
        } finally {
            setCarregandoDados(false)
        }
    }

    const handleAtualizarRefeicao = async () => {
        if (!usuario?.id || !id) {
            showAlert('Erro', 'Usuário ou refeição não identificada')
            return
        }

        if (!tipo.trim()) {
            showAlert('Atenção', 'Informe o tipo de refeição')
            return
        }

        try {
            setCarregando(true)

            const refeicaoAtualizada: Refeicao = {
                idRefeicao: Number(id),
                data: data.toISOString().split('T')[0],
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

            await refeicaoService.atualizar(Number(id), refeicaoAtualizada)

            showAlert('Sucesso', 'Refeição atualizada com sucesso!', () => {
                setEditMode(false)
                carregarRefeicao()
            })

        } catch (error: any) {
            showAlert('Erro', error.message || 'Erro ao atualizar refeição')
        } finally {
            setCarregando(false)
        }
    }

    const handleExcluirRefeicao = () => {
        showConfirm(
            'Excluir Refeição',
            'Tem certeza que deseja excluir esta refeição?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel' as const,
                    onPress: () => console.log('Cancelado')
                },
                {
                    text: 'Excluir',
                    style: 'destructive' as const,
                    onPress: async () => {
                        try {
                            await refeicaoService.excluir(Number(id))
                            showAlert('Sucesso', 'Refeição excluída com sucesso!', () => router.back())
                        } catch (error: any) {
                            showAlert('Erro', error.message || 'Erro ao excluir refeição')
                        }
                    }
                }
            ]
        )
    }

    const DropdownEmocoes = ({ visible, onClose, onSelect, valorAtual }: DropdownEmocoesProps) => (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.dropdownOverlay}
                onPress={onClose}
            >
                <View style={styles.dropdownContainer}>
                    {opcoesEmocoes.map((opcao) => (
                        <TouchableOpacity
                            key={opcao.value}
                            style={[
                                styles.dropdownItem,
                                valorAtual === opcao.value && styles.dropdownItemSelected
                            ]}
                            onPress={() => {
                                onSelect(opcao.value)
                                onClose()
                            }}
                        >
                            <Text style={styles.dropdownItemText}>
                                {opcao.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>
    )

    if (carregandoDados) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Carregando...</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#2e6480" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.editButtonHeader}
                        onPress={() => setEditMode(!editMode)}
                        disabled={carregando}
                    >
                        <Text style={styles.editButtonText}>
                            {editMode ? 'Cancelar' : 'Editar'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>
                    {editMode ? 'Editar Refeição' : 'Detalhes da Refeição'}
                </Text>

                {/* data e hora */}
                <View style={styles.rowCompact}>
                    <View style={styles.halfInputCompact}>
                        <Text style={styles.label}>Data *</Text>
                        <TouchableOpacity
                            onPress={() => editMode && setShowDatePicker(true)}
                            style={[
                                styles.dataHorarioButtonCompact,
                                !editMode && styles.disabledField
                            ]}
                            disabled={!editMode}
                        >
                            <Text style={styles.dataHorarioText}>
                                {data.toLocaleDateString('pt-BR')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.halfInputCompact}>
                        <Text style={styles.label}>Horário *</Text>
                        <TouchableOpacity
                            onPress={() => editMode && setShowTimePicker(true)}
                            style={[
                                styles.dataHorarioButtonCompact,
                                !editMode && styles.disabledField
                            ]}
                            disabled={!editMode}
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
                                tipo === opcao && styles.tipoButtonSelected,
                                !editMode && styles.disabledField
                            ]}
                            onPress={() => editMode && setTipo(opcao)}
                            disabled={!editMode}
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
                <Input
                    placeholder="Escreva brevemente o que você comeu"
                    value={descricao}
                    onChangeText={setDescricao}
                    multiline
                    numberOfLines={3}
                    multilineHeight={100}
                    textAlignVertical="top"
                    textAlign="left"
                    editable={editMode}
                    style={!editMode ? styles.disabledInput : undefined}
                />

                {/* níveis de fome/saciedade */}
                <Text style={styles.label}>Nível de fome antes*</Text>
                <View style={styles.nivelContainer}>
                    {[1, 2, 3, 4, 5].map((nivel) => (
                        <TouchableOpacity
                            key={nivel}
                            style={[
                                styles.nivelButton,
                                nivelFome === nivel && styles.nivelButtonSelected,
                                !editMode && styles.disabledField
                            ]}
                            onPress={() => editMode && setNivelFome(nivel)}
                            disabled={!editMode}
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
                    {[1, 2, 3, 4, 5].map((nivel) => (
                        <TouchableOpacity
                            key={nivel}
                            style={[
                                styles.nivelButton,
                                nivelSaciedade === nivel && styles.nivelButtonSelected,
                                !editMode && styles.disabledField
                            ]}
                            onPress={() => editMode && setNivelSaciedade(nivel)}
                            disabled={!editMode}
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
                        <TouchableOpacity
                            style={[
                                styles.dropdownButtonCompact,
                                !editMode && styles.disabledField
                            ]}
                            onPress={() => editMode && setShowEmocoesAntesDropdown(true)}
                            disabled={!editMode}
                        >
                            <Text style={emocoesAntes ? styles.dropdownButtonTextSelected : styles.dropdownButtonText}>
                                {emocoesAntes ? opcoesEmocoes.find(e => e.value === emocoesAntes)?.label : 'Selecionar'}
                            </Text>
                            <Ionicons name="chevron-down" size={16} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.emocoesColumn}>
                        <Text style={styles.emocoesLabel}>Depois</Text>
                        <TouchableOpacity
                            style={[
                                styles.dropdownButtonCompact,
                                !editMode && styles.disabledField
                            ]}
                            onPress={() => editMode && setShowEmocoesDepoisDropdown(true)}
                            disabled={!editMode}
                        >
                            <Text style={emocoesDepois ? styles.dropdownButtonTextSelected : styles.dropdownButtonText}>
                                {emocoesDepois ? opcoesEmocoes.find(e => e.value === emocoesDepois)?.label : 'Selecionar'}
                            </Text>
                            <Ionicons name="chevron-down" size={16} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>

                <DropdownEmocoes
                    visible={showEmocoesAntesDropdown}
                    onClose={() => setShowEmocoesAntesDropdown(false)}
                    onSelect={setEmocoesAntes}
                    valorAtual={emocoesAntes}
                />

                <DropdownEmocoes
                    visible={showEmocoesDepoisDropdown}
                    onClose={() => setShowEmocoesDepoisDropdown(false)}
                    onSelect={setEmocoesDepois}
                    valorAtual={emocoesDepois}
                />

                {/* companhia */}
                <Text style={styles.label}>Companhia</Text>
                <View style={styles.opcaoContainer}>
                    <TouchableOpacity
                        style={[
                            styles.opcaoButton,
                            companhia === 'Sim' && styles.opcaoButtonSelected,
                            !editMode && styles.disabledField
                        ]}
                        onPress={() => editMode && setCompanhia('Sim')}
                        disabled={!editMode}
                    >
                        <Text style={[
                            styles.opcaoText,
                            companhia === 'Sim' && styles.opcaoTextSelected
                        ]}>
                            Sim
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.opcaoButton,
                            companhia === 'Não' && styles.opcaoButtonSelected,
                            !editMode && styles.disabledField
                        ]}
                        onPress={() => editMode && setCompanhia('Não')}
                        disabled={!editMode}
                    >
                        <Text style={[
                            styles.opcaoText,
                            companhia === 'Não' && styles.opcaoTextSelected
                        ]}>
                            Não
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* distrações */}
                <Text style={styles.label}>Distrações</Text>
                <View style={styles.opcaoContainer}>
                    <TouchableOpacity
                        style={[
                            styles.opcaoButton,
                            distracoes === 'Sim' && styles.opcaoButtonSelected,
                            !editMode && styles.disabledField
                        ]}
                        onPress={() => editMode && setDistracoes('Sim')}
                        disabled={!editMode}
                    >
                        <Text style={[
                            styles.opcaoText,
                            distracoes === 'Sim' && styles.opcaoTextSelected
                        ]}>
                            Sim
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.opcaoButton,
                            distracoes === 'Não' && styles.opcaoButtonSelected,
                            !editMode && styles.disabledField
                        ]}
                        onPress={() => editMode && setDistracoes('Não')}
                        disabled={!editMode}
                    >
                        <Text style={[
                            styles.opcaoText,
                            distracoes === 'Não' && styles.opcaoTextSelected
                        ]}>
                            Não
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* atualizar/excluir */}
                {editMode ? (
                    <Button
                        title={carregando ? "Atualizando..." : "Atualizar Refeição"}
                        onPress={handleAtualizarRefeicao}
                        style={styles.updateButton}
                        disabled={carregando}
                    />
                ) : (
                    <TouchableOpacity
                        onPress={handleExcluirRefeicao}
                        style={styles.deleteButton}
                    >
                        <Text style={styles.deleteButtonText}>Excluir Refeição</Text>
                    </TouchableOpacity>
                )}

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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fafafa'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    backButton: {
        padding: 8
    },
    editButtonHeader: {
        padding: 8
    },
    editButtonText: {
        color: '#2e6480',
        fontSize: 16,
        fontFamily: 'Poppins-Medium'
    },
    title: {
        fontSize: 22,
        color: '#5c503a',
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        paddingTop: 2,
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
    disabledField: {
        opacity: 0.6,
    },
    disabledInput: {
        backgroundColor: '#f0f0f0',
        opacity: 0.7,
    },
    updateButton: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#4CAF50'
    },
    deleteButton: {
        alignItems: 'center',
        padding: 16,
        marginTop: 20,
    },
    deleteButtonText: {
        color: '#f44336',
        fontSize: 16,
        textDecorationLine: 'underline',
        fontFamily: 'Poppins-Regular'
    },
    rowCompact: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    halfInputCompact: {
        width: '48%',
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
        minWidth: 100,
    },
    dataHorarioText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
    tipoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
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
        marginBottom: 12,
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
        justifyContent: 'space-between',
        marginBottom: 10
    },
    nivelButton: {
        width: 50,
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
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
        fontWeight: 'bold',
        fontSize: 16,
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
    dropdownButtonCompact: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
        minHeight: 44
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 10
    },
    dropdownButtonText: {
        color: '#666',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    dropdownButtonTextSelected: {
        color: '#333',
        fontSize: 16,
        fontFamily: 'Poppins-Regular'
    },
    dropdownOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dropdownContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
        width: 'auto',
        minWidth: 180,
        maxWidth: 220,
        alignSelf: 'center'
    },
    dropdownItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    dropdownItemSelected: {
        backgroundColor: '#e8f4fd'
    },
    dropdownItemText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular'
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
        fontFamily: 'Poppins-Bold',
    },
    registerButton: {
        marginTop: 20,
        marginBottom: 40,
        backgroundColor: '#2e6480'
    }
})