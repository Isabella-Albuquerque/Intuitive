import { useState } from 'react'
import { TextInput, TextInputProps, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { styles } from './styles'

export function Input({ secureTextEntry, ...rest }: TextInputProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                secureTextEntry={secureTextEntry && !showPassword}
                placeholderTextColor="#a08d80"
                {...rest}
            />
            {secureTextEntry && (
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                >
                    <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color="#666"
                    />
                </TouchableOpacity>
            )}
        </View>
    )
}