import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Touchable } from 'react-native'

export default function DriverPanel() {
    return (
        <ScrollView contentContainerStyle = {styles.container}>
            <TouchableOpacity style = {styles.button}>
                <Text style = {styles.text}>Iniciar viaje</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.button}>
                <Text style = {styles.text}>Terminar viaje</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.button}>
                <Text style = {styles.text}>Cancelar viaje</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '30%'
    },
    text: {
        fontSize: 20,
        color: 'black'
    },
    button: {
        height: 100,
        width: 100,
        borderColor: 'white',
        borderWidth: 2
    }
})