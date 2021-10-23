import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 10,
        height: "100%",
        width: "100%",
    },
    text: {
        fontSize: 20,
        color: 'black',
        margin: 5
    },
    buttonContainer: {
        height: '20%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        margin: 10
    },
    textTrip: {
        fontSize: 20,
        color: 'green'
    },
    payentPanel: {
        flex: 1 / 2,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '90%',
        // borderWidth: 2,
        // borderColor: 'yellow',
    },
    servicesPanel: {
        flex: 1 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        flexDirection: 'row',
        // borderWidth: 2,
        // borderColor: 'green',
    },
    tripPanel: {
        flex: 1 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // borderWidth: 2,
        // borderColor: 'red',
        width: '90%',
    },
    serviceItemStyle: {
        height: '100%',
        borderRadius: 5
    },
    serviceButton: {
        backgroundColor: '#16A0DB',
        margin: 10
    },
    paymentButton: {
        backgroundColor: '#329239',
        margin: 10
    },
    //Card
    displayDriver: {
        flex: 1 / 2,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        // borderWidth: 2,
        // borderColor: 'green'
    },
    tripOptions: {
        flex: 1 / 2,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        // borderWidth: 2,
        // borderColor: 'blue'
    },
    driverName: {
        fontSize: 20,
        color: 'black'
    },
    placa: {
        fontSize: 25,
        fontWeight: 'bold'
    },
})