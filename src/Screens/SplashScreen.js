import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native'

export default function SplashScreen() {
    return (
        <View style = {styles.container}>
            <Image source={require('../../assets/images/bimosplash.jpeg')} style={styles.container} />
            {/* <ActivityIndicator size = 'large' color = 'green'/> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        width:'100%'
    }
})
