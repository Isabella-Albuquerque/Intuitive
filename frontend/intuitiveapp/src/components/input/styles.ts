import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    width: '100%'
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    fontSize: 16,
    paddingRight: 45
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 15,
    padding: 4
  }
})