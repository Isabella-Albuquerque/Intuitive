import { Modal, View, Text, TouchableOpacity } from 'react-native'
import { styles } from './styles'

interface CustomAlertProps {
    visible: boolean
    title: string
    message: string
    onClose: () => void
}

export function CustomAlert({ visible, title, message, onClose }: CustomAlertProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}