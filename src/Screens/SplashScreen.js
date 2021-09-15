import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
//Geolocation
import Geolocation from 'react-native-geolocation-service'
import ReduxLocationStore from '../Redux/Redux-location-store';
import { set_location } from '../Redux/Redux-actions';
import { useAddress } from '../Context/AddressContext'

export default function SplashScreen() {
    const {setAddress} = useAddress();
    Geolocation.watchPosition(
        ({coords}) => {
          ReduxLocationStore.dispatch(set_location(coords))
          setAddress(coords)
        },
        (error) => {console.log(error)},
        {enableHighAccuracy: true, 
          distanceFilter: 0, 
          useSignificantChanges: false, 
          maximumAge: 0
        }
      )

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
