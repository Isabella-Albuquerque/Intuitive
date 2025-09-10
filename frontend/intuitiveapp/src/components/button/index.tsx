import { TouchableOpacity, TouchableOpacityProps, Text, StyleProp, ViewStyle } from 'react-native'
import { styles } from './styles'

interface ButtonProps extends TouchableOpacityProps {
  title: string
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<ViewStyle>
}

export function Button({ title, style, disabled, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      disabled={disabled}
      {...rest}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}