import React, {useState, useRef, useEffect } from 'react'
import { Button, StyleSheet, Text, View} from 'react-native'
import { DataTable } from 'react-native-paper'
import { useTrip } from '../Context/TripContext'
import { handleAndroidBackButton, backAction } from '../Functions/BackHandler'
import {Fab} from '../Components/Fab'
import { useViaje, viajeDefaultState } from '../Context/ViajeContext'
import { DeleteTrip } from '../Functions/TripStorage'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import ReduxLocationStore from '../Redux/Redux-location-store'

const CURRENT_ADDRESS = gql`
mutation get_address($lat: Float!, $lng: Float!){
  GetAddress(lat: $lat, lng: $lng){
    name, placeId, direction
  }
}
`

export const ResumenViaje = (props) => {

    useEffect(() => {
        handleAndroidBackButton(() => props.navigation.goBack())
        return () => {
            handleAndroidBackButton(() => backAction())
        }
      }, []) 

    const {trip, setTrip} = useTrip();
    const {viaje, setViaje} = useViaje();

    function CutAddress(address) {
        if(address !== null) {
          return address.split(',')[0]
        } else {
          return 'Dirección'
        }
      }

    const [get_address] = useMutation(CURRENT_ADDRESS, {
        fetchPolicy: "no-cache",
        onCompleted: ({ GetAddress }) => {
          setViaje({...viajeDefaultState, origin: {...viaje.origin, name: CutAddress(GetAddress.name)}})
        },
        onError: (error) => {
          console.log(error);
        }
    })

    function DestroyTrip() {
        DeleteTrip();
        setTrip(null);
        // setViaje(viajeDefaultState);
    }

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
                get_address({
                    variables: {
                        lat: ReduxLocationStore.getState().latitude,
                        lng: ReduxLocationStore.getState().longitude,
                    }
                }).then(() => {
                    props.navigation.goBack()
                    DeleteTrip();
                    setTrip(null);
                    // DestroyTrip();
                })
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

