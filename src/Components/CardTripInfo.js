import React , {useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native'
import {useTrip} from '../Context/TripContext'
import {DeleteTrip} from '../Functions/TripStorage'
import { useUsuario } from '../Context/UserContext'
import MotionSlider from 'react-native-motion-slider';

export const CardTripInfo = (props) => {
    const {trip, setTrip} = useTrip();
    const {usuario, setUsuario} = useUsuario();

    useEffect(() => {
        //  console.log(trip.trip.passenger.name);
        const shortAddressOri = trip.originVincity.split(',')
        const shortAddressDes = trip.destinationVincity.split(',')
        setOrigin(shortAddressOri[0])
        setDestination(shortAddressDes[1])

    }, [])

    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');

    async function actualizarViaje(tripStatus) {
        await props.acceptTrip({variables: {
            id: trip.id,
            tripStatus,
            driverId: usuario.id
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

    function EvaluateTripStatus() {
        if(trip.tripStatus.tripStatus == 'deal'){
            return (
                <>
                <Button title = 'Aceptar Viaje' color = 'blue' onPress = {() => actualizarViaje(1)}/>
                <Button title = 'Rechazar Viaje' color = 'red' onPress = {() => console.log(3)}/>
                <Button title = 'Delete' color = 'red' onPress = {() => deleteFromStorage()}/>
                </>
            )
        } else if (trip.tripStatus.tripStatus == 'En Camino') {
            return (
                <>
                <Button title = 'Esperar al pasajero' color = 'blue' onPress = {() => actualizarViaje(4)}/> 
                <Button title = 'Cancelar Viaje' color = 'red' onPress = {() => console.log(3)}/>
                <Button title = 'Delete' color = 'red' onPress = {() => deleteFromStorage()}/>
                </>
            )
        } else if (trip.tripStatus.tripStatus == 'Esperando') {
            return (
                <>
                <Button title = 'Empezar Viaje' color = 'blue' onPress = {() => actualizarViaje(6)}/> 
                <Button title = 'Cancelar Viaje' color = 'red' onPress = {() => console.log(3)}/>
                <Button title = 'Delete' color = 'red' onPress = {() => deleteFromStorage()}/>
                </>
            )
        } else if (trip.tripStatus.tripStatus == 'Iniciado') {
            return (
                <>
                {/* <Button title = 'Terminar Viaje' color = 'red' onPress = {() => {
                    actualizarViaje(2)
                    props.navigation.navigate('ResumenViaje')    
                }}/> */}
                <MotionSlider
                        min={0} 
                        max={40}
                        value={0} 
                        decimalPlaces={10}
                        units={'º'}
                        backgroundColor={['#16A0DB', '#e3d912', '#32a852']}
                        firstMessage = {'Teminar Viaje'}
                        secondMessage = {'Terminando Viaje'}
                        finalMessage = {'Viaje Terminado'}
                        onValueChanged={(value) => {
                        if(value == 40){
                            actualizarViaje(2)
                            deleteFromStorage()
                            props.navigation.navigate('ResumenViaje')  
                        }}}
                        // onDrag={() => console.log('Dragging')}
                />
                <Button title = 'Cancelar Viaje' color = 'red' onPress = {() => console.log(3)}/>
                <Button title = 'Delete' color = 'red' onPress = {() => deleteFromStorage()}/>
                </>
            )
        } else if (trip.tripStatus.tripStatus == 'Terminado') {
            return (
                <>
                <MotionSlider
                        min={0} 
                        max={40}
                        value={0} 
                        decimalPlaces={10}
                        units={'º'}
                        backgroundColor={['#16A0DB', '#e3d912', '#32a852']}
                        firstMessage = {'Teminar Viaje'}
                        secondMessage = {'Terminando Viaje'}
                        finalMessage = {'Viaje Terminado'}
                        onValueChanged={(value) => {
                        if(value == 40){
                            deleteFromStorage()
                            props.navigation.navigate('ResumenViaje')  
                        }}}
                        // onDrag={() => console.log('Dragging')}
                />
                {/* <Button title = 'Terminar Viaje' color = 'red' onPress = {() => {
                    // actualizarViaje(2)
                    props.navigation.navigate('ResumenViaje')    
                }}/> */}
                {/* <Button title = 'Cancelar Viaje' color = 'red' onPress = {() => console.log(3)}/> */}
                {/* <Button title = 'Delete' color = 'red' onPress = {() => deleteFromStorage()}/> */}
                </>
            )
        } else
        {
            return null
        }
    }

    async function deleteFromStorage() {
        // setTrip(null)
        await DeleteTrip()
    }

    // return (
    //     <View style = {styles.card}>
    //         <Text style = {styles.text}>Pasajero: {trip.passenger.name}</Text> 
    //         <Text style = {styles.text}>Origen: {origin}</Text>
    //         <Text style = {styles.text}>Destino: {destination}</Text>
    //         <View style = {styles.buttonContainer}>
    //             <Button 
    //             style = {styles.button}
    //             title = 'Aceptar Viaje' 
    //             color = 'green' 
    //             onPress = {() => aceptarViaje()}/>
    //             <Button 
    //             style = {styles.button}
    //             title = 'Delete from storage' 
    //             color = 'red' 
    //             onPress = {() => deleteFromStorage()}/>
    //         </View>
    //     </View>
    // )

    return (
        <View style = {styles.card}>
            {/* {props.children} */}
            <Text style = {styles.text}>Pasajero: {trip.passenger.name}</Text> 
             <Text style = {styles.text}>Origen: {trip.originVincity.split(',')[0]}</Text>
             <Text style = {styles.text}>Destino: {trip.destinationVincity.split(',')[1]}</Text>

             <View style = {styles.buttonContainer}>
                {/* <Button 
                style = {styles.button}
                title = 'Aceptar Viaje' 
                color = 'green' 
                onPress = {() => aceptarViaje()}/>
                <Button 
                style = {styles.button}
                title = 'Delete from storage' 
                color = 'red' 
                onPress = {() => deleteFromStorage()}/> */}
                <EvaluateTripStatus/>
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
