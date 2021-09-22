import React , {useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import {Button as ButtonPaper} from 'react-native-paper'

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

            <Text style = {styles.textCard}>Metodos de pago</Text>
            <View style ={styles.payentPanel}>
            <ButtonPaper icon="credit-card" mode="contained" onPress={() => console.log('Pressed')}>card</ButtonPaper>
            <ButtonPaper style = {{backgroundColor: '#329239'}} icon="cash" mode="contained" onPress={() => console.log('Pressed')}>cash</ButtonPaper>
            <ButtonPaper style = {{backgroundColor: '#f7931a'}} icon="bitcoin" mode="contained" onPress={() => console.log('Pressed')}>bitcoin</ButtonPaper>
          </View>

          {/* <Text style = {styles.textCard}>Servicios</Text> */}
          <View style ={styles.servicesPanel}>
            <FlatList horizontal = {true}
            data = {props.services}
            renderItem = {({item}) => (
                <View style = {styles.serviceItemStyle}>
                <ButtonPaper 
                style = {styles.serviceButton} 
                icon={item.icon}
                mode="contained" 
                onPress={() => console.log(item)}>
                    {item.name}
                </ButtonPaper>
                </View>    
            )}/>
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
    },
    payentPanel: {
        flex: 1/2, 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexDirection: 'row'
    },
    servicesPanel: {
        flex: 1/2, 
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 2,
        // borderColor: 'green',
        width: '90%',
        flexDirection: 'row'
    },
    tripPanel: {
        flex: 1/2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
    },
    serviceItemStyle: {
        height: '100%',
        borderRadius: 5
    },
    serviceButton: {
        backgroundColor: '#16A0DB',
        margin: 10
    }
})