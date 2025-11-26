import { useState } from 'react'

interface AlertButton {
    text: string
    style?: 'default' | 'cancel' | 'destructive'
    onPress?: () => void
}

interface AlertConfig {
    title: string
    message: string
    onConfirm: (() => void) | null
}

interface ConfirmConfig {
    title: string
    message: string
    buttons: AlertButton[]
}

export function useAlert() {
    const [alertVisible, setAlertVisible] = useState(false)
    const [confirmVisible, setConfirmVisible] = useState(false)
    const [alertConfig, setAlertConfig] = useState<AlertConfig>({
        title: '',
        message: '',
        onConfirm: null
    })
    const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig>({
        title: '',
        message: '',
        buttons: []
    })

    const showAlert = (title: string, message: string, onConfirm?: () => void) => {
        setAlertConfig({ title, message, onConfirm: onConfirm || null })
        setAlertVisible(true)
    }

    const showConfirm = (title: string, message: string, buttons: AlertButton[]) => {
        setConfirmConfig({ title, message, buttons })
        setConfirmVisible(true)
    }

    const hideAlert = () => {
        if (alertConfig.onConfirm) alertConfig.onConfirm()
        setAlertVisible(false)
    }

    const hideConfirm = () => setConfirmVisible(false)

    return {
        showAlert,
        showConfirm,
        hideAlert,
        hideConfirm,
        alertVisible,
        confirmVisible,
        alertConfig,
        confirmConfig
    }
}
