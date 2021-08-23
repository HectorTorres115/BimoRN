import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'

export default function SplashScreen() {
    return (
        <View style = {styles.container}>
            <ActivityIndicator size = 'large' color = 'green'/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
