import { Modal, View, Text, TouchableOpacity } from 'react-native'
import { styles } from './styles'

interface ButtonConfig {
    text: string
    style?: 'default' | 'cancel' | 'destructive'
    onPress?: () => void
}

interface CustomConfirmProps {
    visible: boolean
    title: string
    message: string
    buttons: ButtonConfig[]
    onClose: () => void
}

export function CustomConfirm({ visible, title, message, buttons, onClose }: CustomConfirmProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.confirmBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    
                    <View style={styles.buttonsContainer}>
                        {buttons.map((button, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.button,
                                    button.style === 'destructive' && styles.destructiveButton,
                                    button.style === 'cancel' && styles.cancelButton
                                ]}
                                onPress={() => {
                                    if (button.onPress) button.onPress()
                                    onClose()
                                }}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    button.style === 'destructive' && styles.destructiveText,
                                    button.style === 'cancel' && styles.cancelText
                                ]}>
                                    {button.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    )
}