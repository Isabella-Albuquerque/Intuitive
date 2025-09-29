import { useState } from 'react'
import { TextInput, TextInputProps, TouchableOpacity, View, StyleProp, TextStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { styles } from './styles'

interface CustomInputProps extends TextInputProps {
    multilineHeight?: number
}

export function Input({ secureTextEntry, multilineHeight, style, ...rest }: CustomInputProps) {
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev)
    }

    // CORREÇÃO: Inclui o style passado como prop
    const inputStyle = [
        styles.input,
        multilineHeight ? { height: multilineHeight } : null,
        style // ← ADICIONADO: mescla com estilos customizados
    ].filter(Boolean) // Remove valores null/undefined

    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={inputStyle}
                secureTextEntry={secureTextEntry && !showPassword}
                placeholderTextColor="#a08d80"
                autoCorrect={true}
                autoCapitalize="none"
                keyboardType="default"
                {...rest}
            />
            {secureTextEntry && (
                <TouchableOpacity
                    onPress={togglePasswordVisibility}
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