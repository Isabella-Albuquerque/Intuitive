import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirmBox: {
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
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 5,
        minWidth: 80,
        alignItems: 'center'
    },
    cancelButton: {
        backgroundColor: '#f0f0f0'
    },
    destructiveButton: {
        backgroundColor: '#ff4444'
    },
    buttonText: {
        fontWeight: '600',
        fontFamily: 'Poppins-Medium'
    },
    cancelText: {
        color: '#666'
    },
    destructiveText: {
        color: 'white'
    },
})