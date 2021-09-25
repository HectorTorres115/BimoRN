import React, {useState, useRef, useEffect } from 'react'
import { Button, StyleSheet, Text, View} from 'react-native'
import { DataTable } from 'react-native-paper'
import { useTrip } from '../Context/TripContext'
import { handleAndroidBackButton, backAction } from '../Functions/BackHandler'
import {Fab} from '../Components/Fab'

export const ResumenViaje = (props) => {

    useEffect(() => {
        handleAndroidBackButton(() => props.navigation.goBack())
      }, []) 

    const {trip, setTrip} = useTrip();

    return (

        trip !== null ? <View style = {styles.container}>
            <Text style = {styles.text}>De: {trip.originVincity}</Text>
            <Text style = {styles.text}>Hasta: {trip.destinationVincity}</Text>
            <DataTable style = {styles.tablecontainer}> 
                <DataTable.Row>
                    <DataTable.Cell style = {styles.text1}><Text style = {styles.text}>Distancia:</Text></DataTable.Cell>
                    <DataTable.Cell style = {styles.text2}><Text style = {styles.text}>{trip.distance} km</Text></DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell style = {styles.text1}><Text style = {styles.text}>Subtotal:</Text></DataTable.Cell>
                    <DataTable.Cell style = {styles.text2}><Text style = {styles.text}>$ {trip.fee.toFixed(2)}</Text></DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell style = {styles.text1}><Text style = {styles.text}>rawfee:</Text></DataTable.Cell>
                    <DataTable.Cell style = {styles.text2}><Text style = {styles.text}>$ {trip.rawfee.toFixed(2)}</Text></DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell style = {styles.text1}><Text style = {styles.text}>Total:</Text></DataTable.Cell>
                    <DataTable.Cell style = {styles.text2}><Text style = {styles.text}>$ {trip.feeTaxed.toFixed(2)}</Text></DataTable.Cell>
                </DataTable.Row>
            </DataTable>            
            <Button title = 'Cerrar' color = 'red' onPress = {() => {
                props.navigation.goBack()
                setTrip(null)
                }}/> 
                <Fab navigation = {props.navigation}/>
        </View> 
        : null
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        //alignItems: 'center',
        width:'100%'
    },
    tablecontainer: {
        // justifyContent: 'center',
        //alignItems: 'center',
        width:'100%',
        marginTop:20
    },
    text: {
        fontSize: 20,
        color: 'black',
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:20
    },
    text1: {
        fontSize: 20,
        color: 'black',
        margin: 5,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    text2: {
        fontSize: 20,
        color: 'black',
        margin: 5,
        alignItems: 'center',
        justifyContent:'flex-end'
    },
})

