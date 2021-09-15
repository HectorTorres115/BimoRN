import React , {useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native'

export const CardPassenger = (props) => {
    useEffect(() => {
        console.log('Component did mount');
    }, [])

    const [tripAccepted, setTripAccepted] = useState(false);

    function EvaluateTrip() {
        if(tripAccepted){
            return <Text style = {styles.textTrip}>Viaje aceptado.</Text>
        } else {
            return (
            <View style = {styles.buttonContainer}>
                <Button style = {styles.button} title = 'Aceptar' color = 'blue' onPress = {() => aceptarViaje()}/>
                <Button style = {styles.button} title = 'Rechazar' color = 'red'/>
            </View>
            )
        }
    }

    return (
        <View style = {styles.card}>
            {props.children}
            {/* {EvaluateTrip()} */}
        </View>
    )
}

const styles = StyleSheet.create({
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
    button :{
        margin: 10
    },
    textTrip: {
        fontSize: 20,
        color: 'green'
    }
})
