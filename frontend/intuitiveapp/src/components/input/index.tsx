import { useState } from 'react'
import { TextInput, TextInputProps, TouchableOpacity, View } from 'react-native'
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

  const inputStyle = [
    styles.input,
    multilineHeight ? { height: multilineHeight } : null,
    style
  ].filter(Boolean)

  return (
    <View style={styles.inputContainer}>
      <TextInput
        key={showPassword ? "visible" : "hidden"}
        style={inputStyle}
        secureTextEntry={secureTextEntry && !showPassword}
        placeholderTextColor="#a08d80"
        autoCorrect={false}
        autoCapitalize="none"
        autoComplete={secureTextEntry ? "password" : "off"}
        textContentType={secureTextEntry ? "password" : "none"}
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