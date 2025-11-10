import { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, Dimensions, ViewStyle, DimensionValue } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { styles } from './styles'

interface DropdownOption<T = string> {
    label: string
    value: T
}

interface CustomDropdownProps<T = string> {
    options: DropdownOption<T>[]
    selectedValue: T | null
    onValueChange: (value: T) => void
    placeholder?: string
    disabled?: boolean
    style?: ViewStyle
    testID?: string
    width?: DimensionValue
}

export function CustomDropdown<T = string>({
    options,
    selectedValue,
    onValueChange,
    placeholder = "Selecionar",
    disabled = false,
    style,
    testID,
    width = 'auto'
}: CustomDropdownProps<T>) {
    const [modalVisible, setModalVisible] = useState(false)
    const selectedOption = options.find(opt => opt.value === selectedValue)
    const handleSelect = (value: T) => {
        onValueChange(value)
        setModalVisible(false)
    }
    const containerStyle = {
        ...styles.container,
        width,
        ...style
    }
    const maxModalHeight = Dimensions.get('window').height * 0.9

    return (
        <View style={containerStyle}>
            <TouchableOpacity
                testID={testID}
                style={[
                    styles.dropdownButton,
                    disabled && styles.dropdownButtonDisabled
                ]}
                onPress={() => !disabled && setModalVisible(true)}
                disabled={disabled}
            >
                <Text
                    style={[
                        styles.dropdownButtonText,
                        selectedValue ? styles.dropdownButtonTextSelected : null
                    ]}
                    numberOfLines={1}
                >
                    {selectedOption?.label || placeholder}
                </Text>
                <Ionicons
                    name="chevron-down"
                    size={16}
                    color={disabled ? "#999" : "#666"}
                />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={[styles.modalContent, { maxHeight: maxModalHeight }]}>
                        <View>
                            {options.map((option, index) => (
                                <TouchableOpacity
                                    key={String(option.value)}
                                    style={[
                                        styles.optionItem,
                                        selectedValue === option.value && styles.optionItemSelected,
                                        index === 0 && styles.optionItemFirst,
                                        index === options.length - 1 && styles.optionItemLast,
                                    ]}
                                    onPress={() => handleSelect(option.value)}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        selectedValue === option.value && styles.optionTextSelected
                                    ]}>
                                        {option.label}
                                    </Text>
                                    {selectedValue === option.value && (
                                        <Ionicons name="checkmark" size={16} color="#2e6480" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}