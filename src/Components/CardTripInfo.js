import React , {useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native'
import { Card, Title, Paragraph } from 'react-native-paper'
import MotionSlider from 'react-native-motion-slider';
import AsyncStorage from '@react-native-community/async-storage'

export const CardTripInfo = (props) => {
    useEffect(() => {
        // console.log(props.trip)
        const shortAddressOri = props.trip.originVincity.split(',')
        const shortAddressDes = props.trip.destinationVincity.split(',')
        setOrigin(shortAddressOri[0])
        setDestination(shortAddressDes[1])

        AsyncStorage.getItem('@trip_key').then((data)=>{
            const json = JSON.parse(data)

            setTrip(json.trip)
    
          }).catch((error)=>{console.log(error)})
    }, [])

    // useEffect(() => {
    //      console.log(props.trip.tripStatusId)
    // })

    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [tripAccepted, setTripAccepted] = useState(false);
    const [statusid, setStatusId] = useState(props.trip.tripStatusId);
    const [trip, setTrip] = useState(null);

    async function aceptarViaje() {
        setTripAccepted(true)
        await props.accept_trip({variables: {
            id: props.trip.id,
            tripStatus: 1,
            driverId: props.userId
        }})  
    }

    async function deleteStorage(){
        try {
          await AsyncStorage.removeItem('@trip_key')
          setTrip(null)
            props.setsetter({trip:null})
        } catch (error) {

          console.log(error)        
        }
        
      }
      
    function EvaluateTrip() {
        if(trip !== null && trip.tripStatusId !== 5){
            return null
        } else {
            return (
            <View style = {styles.buttonContainer}>
                <Button style = {styles.button} title = 'Aceptar' color = 'blue' onPress = {() => aceptarViaje()}/>
                <Button style = {styles.button} title = 'Rechazar' color = 'red'/>
            </View>
            )
        }
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

    return (
        <View style = {styles.card}>
            <Text style = {styles.text}>Pasajero: {props.trip.passenger.name}</Text>
            <Text style = {styles.text}>Origen: {origin}</Text>
            {/* <Text style = {styles.text}>Destino: {destination}</Text>
            <Text style = {styles.text}>Distancia: {props.trip.distance}</Text>
            <Text style = {styles.text}>Precio: {props.trip.distance * 10}</Text> */}
            <EvaluateTrip/>
            <Button style = {styles.button} title = 'Cancelar Viaje' color = 'red' onPress = {() => deleteStorage()}/>
            {props.children}
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
    },
    textTrip: {
        fontSize: 20,
        color: 'green'
    }
})
