import React , {useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native'
import {useTrip} from '../Context/TripContext'
import {DeleteTrip} from '../Functions/TripStorage'

export const CardTripInfo = () => {
    const {trip, setTrip} = useTrip();

    useEffect(() => {
        console.log(trip.tripStatus.tripStatus);
        const shortAddressOri = trip.originVincity.split(',')
        const shortAddressDes = trip.destinationVincity.split(',')
        setOrigin(shortAddressOri[0])
        setDestination(shortAddressDes[1])
    }, [])

    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');

    async function aceptarViaje() {
        setTripAccepted(true)
        await props.accept_trip({variables: {
            id: props.trip.id,
            tripStatus: 1,
            driverId: props.userId
        }})  
    }

    // function EvaluateSlider() {
    //     console.log('card')
    //     console.log(props.trip.tripStatusId)
    //     if(props.trip.tripStatusId == 2){
    //         return <MotionSlider
    //         title={'Choose the desired temperature'} 
    //         min={0} 
    //         max={40}
    //         value={0} 
    //         decimalPlaces={10}
    //         units={'º'}
    //         backgroundColor={['rgb(3, 169, 244)', 'rgb(255, 152, 0)', 'rgb(255, 87, 34)']}
    //         onValueChanged={(value) => console.log(value)}
    //         onPressIn={() => console.log('Pressed in')}
    //         onPressOut={() => console.log('Pressed out')}
    //         onDrag={() => console.log('Dragging')}
    //     />
    //     } else {
    //         return (
    //             <Text style = {styles.textTrip}>Aun no puedes terminar el viaje</Text>
    //         )
    //     }
    // }

    async function deleteFromStorage() {
        setTrip(null)
        await DeleteTrip()
    }

    return (
        <View style = {styles.card}>
            <Text style = {styles.text}>Pasajero: {trip.passenger.name}</Text>
            <Text style = {styles.text}>Origen: {origin}</Text>
            <Text style = {styles.text}>Destino: {destination}</Text>
            <View style = {styles.buttonContainer}>
                <Button 
                style = {styles.button}
                title = 'Delete from storage' 
                color = 'red' 
                onPress = {() => deleteFromStorage()}/>
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
        width: "98%",
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
