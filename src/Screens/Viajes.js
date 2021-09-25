import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { DateFetcher } from '../Components/DateFetcher'
import {Fab} from '../Components/Fab'
 
export const Viajes = (props) => {
    return (
        <>
        <View>
            <DateFetcher/>
        </View>
            <Fab navigation = {props.navigation}/>
        </>
    )
}

const styles = StyleSheet.create({

})
