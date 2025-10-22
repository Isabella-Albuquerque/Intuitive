import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Keyboard, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSegments } from 'expo-router'
import { styles } from './styles'

interface ScreenContainerProps {
  children: React.ReactNode
}

export function ScreenContainer({ children }: ScreenContainerProps) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const segments = useSegments()
  const isInTabs = segments[0] === 'tabs'

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    )
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    )

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior="height"
      enabled={isKeyboardVisible}
    >
      <SafeAreaView
        style={styles.safeArea}
        edges={isInTabs ? ['top'] : ['top', 'bottom']}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingBottom: isKeyboardVisible ? 0 : 30 }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
