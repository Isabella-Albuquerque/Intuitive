import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    tipo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e6480',
        fontFamily: 'Poppins-Bold',
    },
    data: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    descricao: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        fontFamily: 'Poppins-Regular',
    },
    niveis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nivel: {
        flexDirection: 'row',
    },
    nivelLabel: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    nivelValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2e6480',
        fontFamily: 'Poppins-Bold',
    },
});