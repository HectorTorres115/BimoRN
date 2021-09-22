import React, {useState, useRef, useEffect } from 'react'
import { Button, StyleSheet, Text, View} from 'react-native'
import { DataTable } from 'react-native-paper'
import { useTrip } from '../Context/TripContext'
import { handleAndroidBackButton, backAction } from '../Functions/BackHandler'

export const ResumenViaje = ({navigation}) => {

    useEffect(() => {
        handleAndroidBackButton(() => navigation.goBack())
      }, []) 

    const {trip, setTrip} = useTrip();

    return (

        trip !== null ? <View style = {styles.container}>
            <Text style = {styles.text}>De: {trip.originVincity}</Text>
            <Text style = {styles.text}>Hasta: {trip.destinationVincity}</Text>
            <DataTable style = {styles.tablecontainer}> 
                <DataTable.Row>
                    <DataTable.Cell style = {styles.text1}>Distancia:</DataTable.Cell>
                    <DataTable.Cell style = {styles.text2}>{trip.distance}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell style = {styles.text1}>Subtotal:</DataTable.Cell>
                    <DataTable.Cell style = {styles.text2}>{trip.fee}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell style = {styles.text1}>rawfee:</DataTable.Cell>
                    <DataTable.Cell style = {styles.text2}>{trip.rawfee}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell style = {styles.text1}>Total:</DataTable.Cell>
                    <DataTable.Cell style = {styles.text2}>{trip.feeTaxed}</DataTable.Cell>
                </DataTable.Row>
            </DataTable>            
            <Button title = 'Cerrar' color = 'red' onPress = {() => {
                navigation.navigate('MapasDriver') 
                setTrip(null)
                }}/> 
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

