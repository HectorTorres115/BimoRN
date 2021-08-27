import React , {useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { Card, Title, Paragraph } from 'react-native-paper'

export const CardTripInfo = (props) => {
    useEffect(() => {
        console.log(props.trip)
        const shortAddressOri = props.trip.originVincity.split(',')
        const shortAddressDes = props.trip.destinationVincity.split(',')
        setOrigin(shortAddressOri[0])
        setDestination(shortAddressDes[1])
    }, [])

    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');

    async function aceptarViaje() {
        await props.accept_trip({variables: {
            id: props.trip.id,
            tripStatus: 1,
            driverId: props.userId
        }})  
    }

    return (
        <View style = {styles.card}>

            <Text style = {styles.text}>Pasajero: {props.trip.passenger.name}</Text>
            <Text style = {styles.text}>Origen: {origin}</Text>
            <Text style = {styles.text}>Destino: {destination}</Text>
            <Text style = {styles.text}>Distancia: {props.trip.distance}</Text>
            <Text style = {styles.text}>Precio: {props.trip.distance * 10}</Text>

            <View style = {styles.buttonContainer}>
                <Button style = {styles.button} title = 'Aceptar' color = 'blue' onPress = {() => aceptarViaje()}/>
                <Button style = {styles.button} title = 'Rechazar' color = 'red'/>
            </View>

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
        // height: "33%",
        width: "98%"
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
    }
})
