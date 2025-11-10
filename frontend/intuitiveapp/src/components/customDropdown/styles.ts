import { StyleSheet, Dimensions } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start'
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#fff',
        minHeight: 44,
        minWidth: 150
    },
    dropdownButtonDisabled: {
        backgroundColor: '#f5f5f5',
        borderColor: '#eee'
    },
    dropdownButtonText: {
        flex: 1,
        color: '#666',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        marginRight: 8
    },
    dropdownButtonTextSelected: {
        color: '#333'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        maxHeight: Dimensions.get('window').height * 0.6,
        width: '80%',
        maxWidth: 300,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden'
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff'
    },
    optionItemSelected: {
        backgroundColor: '#e8f4fd'
    },
    optionItemFirst: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12
    },
    optionItemLast: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderBottomWidth: 0
    },
    optionText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#333',
        flex: 1
    },
    optionTextSelected: {
        color: '#2e6480',
        fontFamily: 'Poppins-Medium'
    }
})

