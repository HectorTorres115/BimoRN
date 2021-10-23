import React from 'react'
import { StyleSheet, View, Image } from 'react-native'

export default function SplashScreen() {
    return (
        <View style = {styles.container}>
            <Image source={require('../../assets/images/bimosplash.jpeg')} style={styles.container}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width:'100%',
    }
})
