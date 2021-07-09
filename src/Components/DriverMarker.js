import React, {useState, useEffect} from 'react'
import {Marker} from 'react-native-maps';
import { Animated, Easing } from 'react-native'

export const DriverMarker = (props) => {
    //State
    const [animacion] = useState(new Animated.Value(0));
    const [rotation, setRotation] = useState(0);
    const spin = animacion.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })
    //Animate config
    Animated.loop(
        Animated.timing(animacion, {
            toValue: 1, 
            duration: 3000, 
            // easing: Easing.linear, 
            useNativeDriver: true
        })
    );
    //React render
    return (
    <Animated.View style={{transform: [{rotate: spin}] }} >
        {/* <Marker 
        ref = {props.driverMarker} 
        coordinate = {props.driverLocation} 
        image={require('../../assets/images/map-taxi.png')} 
        /> */}
        <Animated.Image
        style={{transform: [{rotate: spin}] }}
        source = {require('../../assets/images/map-taxi.png')}
        />
        <Button title = 'Init animation' onPress = {() => Animated.start()}/>
        <Button title = 'End animation' onPress = {() => Animated.stop()}/>
    </Animated.View>
    )
}