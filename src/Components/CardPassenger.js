import React , {useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native'

export const CardPassenger = (props) => {
    useEffect(() => {
        // console.log(props.trip)
        console.log('Component did mount');
        // const shortAddressOri = props.trip.originVincity.split(',')
        // const shortAddressDes = props.trip.destinationVincity.split(',')
        // setOrigin(shortAddressOri[0])
        // setDestination(shortAddressDes[1])
    }, [])

    const [tripAccepted, setTripAccepted] = useState(false);

    async function crearViaje() {
        // setTripAccepted(true)
        // await props.accept_trip({variables: {
        //     id: props.trip.id,
        //     tripStatus: 1,
        //     driverId: props.userId
        // }})  
    }

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
            {/* <Text style = {styles.text}>Passenger Card</Text> */}
            {/* <EvaluateTrip/> */}
            <ScrollView>

            </ScrollView>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    serviceSelector: {
        
    },
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
