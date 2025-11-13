import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    width: '100%'
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000', 
    width: '100%',
    textAlign: 'left',
    includeFontPadding: true,
    textAlignVertical: 'center',
    fontFamily: 'System',
    fontWeight: '400'
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
    padding: 4
  }
})