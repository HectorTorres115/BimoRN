import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
//Geolocation
import Geolocation from 'react-native-geolocation-service'
import ReduxLocationStore from '../Redux/Redux-location-store';
import { useAddress } from '../Context/AddressContext';
import { set_location } from '../Redux/Redux-actions';

export default function SplashScreen() {
    const { address, setAddress } = useAddress();

    Geolocation.watchPosition(
        // ({coords}) => {setAddress(coords)},
        ({ coords }) => {
            ReduxLocationStore.dispatch(set_location(coords))
            setAddress(coords)
        },
        (error) => { console.log(error) },
        {
            enableHighAccuracy: true,
            distanceFilter: 0,
            useSignificantChanges: false,
            maximumAge: 0,
            forceRequestLocation: true,
      forceLocationManager: true

        }
    )

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/bimosplash.jpeg')} style={styles.container} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    }
})
