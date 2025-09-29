import { useState } from 'react'

interface AlertButton {
    text: string
    style?: 'default' | 'cancel' | 'destructive'
    onPress?: () => void
}

export function useAlert() {
    const [alertVisible, setAlertVisible] = useState(false)
    const [confirmVisible, setConfirmVisible] = useState(false)
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        onConfirm: null as (() => void) | null
    })
    const [confirmConfig, setConfirmConfig] = useState({
        title: '',
        message: '',
        buttons: [] as AlertButton[]
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
        if (alertConfig.onConfirm) {
            alertConfig.onConfirm()
        }
        setAlertVisible(false)
    }

    const hideConfirm = () => {
        setConfirmVisible(false)
    }

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