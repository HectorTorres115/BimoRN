import React, {useState, useEffect} from 'react'
import {Marker} from 'react-native-maps';
import { Animated, Easing, Button, StyleSheet } from 'react-native'
import { FAB } from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';

export const Animation = () => {
    //State
    const [animacion, setAnimacion] = useState(new Animated.Value(0));
    const [compassHeading, setCompassHeading] = useState(0);
    //Animation states
    const spinRight = animacion.interpolate({inputRange: [0, 1], outputRange: ['0deg', `90deg`]})
    const spinLeft = animacion.interpolate({inputRange: [0, 1], outputRange: ['0deg', `-90deg`]})
    const spinTotalRight = animacion.interpolate({inputRange: [0, 1], outputRange: ['0deg', `360deg`]})
    const spinTotalLeft = animacion.interpolate({inputRange: [0, 1], outputRange: ['0deg', `-360deg`]})
    const animationReference = Animated.timing(animacion, {
        toValue: 1, 
        duration: 500, 
        easing: Easing.linear, 
        useNativeDriver: true
    })
    //Heading
    Geolocation.watchPosition((info) => {
        setCompassHeading(info.coords.heading)
    }, (error) => console.log(error),
    {enableHighAccuracy: true, distanceFilter: 0, useSignificantChanges: false, maximumAge: 0})

    //React render
    return (
    // <Animated.View style={{transform: [{rotate: spin}]}, {perspective: 1000}}>
    <Animated.View style= {{perspective: 1000}}>
        <Animated.Image
        style={{transform: [{rotate: spinRight}] }}
        // style={{transform: [{rotate: `${360 - compassHeading}deg`}]}}
        source = {require('../../assets/images/map-taxi.png')}
        />
        <Button title = 'Init animation' onPress = {() => animationReference.start()}/>
        <Button title = 'End animation' onPress = {() => {
            animationReference.stop()
            setAnimacion(new Animated.Value(0))
        }}/>
    </Animated.View>
    )
}

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  })
  