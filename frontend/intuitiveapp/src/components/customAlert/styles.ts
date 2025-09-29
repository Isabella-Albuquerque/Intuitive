import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    alertBox: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        minWidth: 300,
        maxWidth: '80%'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        fontFamily: 'Poppins-Bold'
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        color: '#666',
        fontFamily: 'Poppins-Regular'
    },
    button: {
        backgroundColor: '#2e6480',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Poppins-Medium'
    },
})