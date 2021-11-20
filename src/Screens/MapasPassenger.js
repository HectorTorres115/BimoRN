import React, { useState, useRef, useEffect } from 'react'
import { Button, StyleSheet, View, TextInput, Alert, Text } from 'react-native'
import gql from 'graphql-tag'
import { useMutation, useQuery, useLazyQuery } from 'react-apollo'
//Maps
import MapView, { Marker, Polyline } from 'react-native-maps'
import decodePolyline from '../Functions/DecodePolyline'
//Back handler
import { backAction, handleAndroidBackButton } from '../Functions/BackHandler'
//Context
import { useUsuario } from '../Context/UserContext'
import { useTrip } from '../Context/TripContext'
import { useViaje } from '../Context/ViajeContext'
import { useAddress } from '../Context/AddressContext'
//Custom componentss
import { TripUpdated } from '../Listeners/TripUpdated'
import { DriverLocationUpdated } from '../Listeners/DriverLocationUpdated'
import { CardPassenger } from '../Components/CardPassenger'
import { Fab } from '../Components/Fab'
//Local storage
import { viajeDefaultState } from '../Context/ViajeContext'
import { SetViaje as SetViajeStorage, DeleteViaje as DeleteViajeStorage } from '../Functions/ViajeStorage'
import { SetTrip as SetTripStorage, DeleteTrip as DeleteTripStorage } from '../Functions/TripStorage'
//Location
import ReduxLocationStore from '../Redux/Redux-location-store'

export function MapasPassenger(props) {

    const initialCameraConfig = {
        center: {
            longitude: ReduxLocationStore.getState().longitude,
            latitude: ReduxLocationStore.getState().latitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08
        },
        pitch: 1,
        heading: 0,
        zoom: 12,
        altitude: 0
    }

    const globalMapView = useRef(React.Component);
    const driverMarker = useRef(React.Component);

    const [driver, setDriver] = useState({
        longitude: -107.45220333333332,
        latitude: 24.82172166666667,
    });

    //Lifecycle methods
    useEffect(() => {
        handleAndroidBackButton(() => backAction(setUser))
    }, [])

    function IsDriverActive() {
        if(driver !== null){
            return (
                <Marker
                ref={driverMarker}
                key={115}
                coordinate={driver}
                icon={require('../../assets/images/map-taxi.png')} />
            )
        } else {
            return null
        }
    }

    function MoveMarker() {
        if(driver !== null){
            driverMarker.current.animateMarkerToCoordinate({
                longitude: -107.4520,
                latitude: 24.8223
            });
        } else {
            throw Error('El marcador no esta instanciado')
        }
    }

    return (
        <>
            <MapView
                ref={globalMapView}
                showsCompass={false}
                style={styles.map}
                initialCamera={initialCameraConfig}>
                    <IsDriverActive/>
            </MapView>

            <View style={styles.buttonDivider}>
                <Button title='Driver converge' onPress={() => setDriver({
                    longitude: -107.45220333333332,
                    latitude: 24.82172166666667,
                })} />
                <Button title='Driver diverge' onPress={() => setDriver(null)} color = 'red'/>
                <Button title='Change timeline' onPress={() => MoveMarker()} color = 'green'/>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1, width: '100%', height: '100%', zIndex: -1
    },
    buttonDivider: {
        width: '100%',
        flexDirection: 'column'
    }
})
