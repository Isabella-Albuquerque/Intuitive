import { View, Text, TouchableOpacity } from 'react-native'
import { Refeicao } from '../../services/refeicaoService'
import { styles } from './styles'

interface CardRefeicaoProps {
    refeicao: Refeicao
    onPress: () => void
}

export function CardRefeicao({ refeicao, onPress }: CardRefeicaoProps) {
    const formatarData = (dataString: string) => {
        try {
            const data = new Date(dataString + 'T00:00:00')
            return data.toLocaleDateString('pt-BR')
        } catch {
            return dataString
        }
    }

    const formatarHorario = (horario: string) => {
        return horario.substring(0, 5)
    }

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.tipo}>{refeicao.tipo}</Text>
                <Text style={styles.data}>
                    {formatarData(refeicao.data)} • {formatarHorario(refeicao.horario)}
                </Text>
            </View>

            {refeicao.descricao && (
                <Text style={styles.descricao} numberOfLines={2}>
                    {refeicao.descricao}
                </Text>
            )}

            <View style={styles.niveis}>
                <View style={styles.nivel}>
                    <Text style={styles.nivelLabel}>Fome: </Text>
                    <Text style={styles.nivelValue}>{refeicao.nivelFome}/5</Text>
                </View>
                <View style={styles.nivel}>
                    <Text style={styles.nivelLabel}>Saciedade: </Text>
                    <Text style={styles.nivelValue}>{refeicao.nivelSaciedade}/5</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}