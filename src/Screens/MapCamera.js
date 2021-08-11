import React, { useState, useEffect, useRef } from 'react'
import { View, Button, StyleSheet } from 'react-native'
import MapView, {Marker, Polyline} from 'react-native-maps'
import Geolocation from 'react-native-geolocation-service'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import { useUsuario } from '../Context/UserContext'
import { backAction, handleAndroidBackButton } from '../Functions/BackHandler'

const DRAW_HEXAGONS = gql`
mutation draw_hexagons($jumps: Int!, $resolution: Int!, $longitude: Float!, $latitude: Float!){
  GetHexagons(input: {
    jumps: $jumps,
    resolution: $resolution,
    longitude: $longitude,
    latitude: $latitude
  }) {
    index, boundaries {latitude, longitude}
  }
}
`

export const MapCamera = (props) => {
    //Config objects
    const geolocationConfig = {
        enableHighAccuracy: true, 
        distanceFilter: 0, 
        useSignificantChanges: false, 
        maximumAge: 0
    }
    const initialCameraConfig = {
        center: {
            longitude: -107.45220333333332, 
            latitude: 24.82172166666667, 
            latitudeDelta: 0.08, 
            longitudeDelta: 0.08
        },
        pitch: 1,
        heading: 0,
        zoom: 12,
        altitude: 0
    }
    //Screens states
    const [currentCoords, setCurrentCoords] = useState({});
    const [hexagons, setHexagons] = useState([]);
    const {setUser} = useUsuario();
    //Refs components
    const mapReference = useRef(React.Component);
    //Lifecycle methods
    useEffect(() => {
        handleAndroidBackButton(() => props.navigation.goBack())
        return () => {
            handleAndroidBackButton(() => backAction(setUser))
        }
      }, [])
    //Geolocation
    Geolocation.watchPosition(
        ({coords}) => {setCurrentCoords(coords)},
        (error) => {console.log(error)},
        {options: geolocationConfig}
    )
    //Server requests
    const [draw_hexagons] = useMutation(DRAW_HEXAGONS, {
        fetchPolicy: "no-cache",
        variables: {jumps: 2, resolution: 7, longitude: currentCoords.longitude, latitude: currentCoords.latitude},
        onCompleted: ({GetHexagons}) => {
            setHexagons(GetHexagons)
        },
        onError: (err) => {
            console.log(err)
        }
    });
    //Callback functions
    async function setMapCamera() {
        mapReference.current.animateCamera({
            center: {
            latitude: currentCoords.latitude,
            longitude: currentCoords.longitude
            },
            pitch: 1,
            heading: 0,
            zoom: 15,
            altitude: 0
        }, 1000)   
    }

    return(
    <>
        <MapView
        ref = {mapReference}
        style = {styles.map}
        initialCamera = {initialCameraConfig}
        onMapReady = {() => console.log(currentCoords)}>
            {hexagons.map(hexagon => {
                return (
                <Polyline
                key = {hexagon.index} 
                coordinates = {hexagon.boundaries} 
                strokeWidth = {6}
                strokeColor = "#FF00FF"
                strokeColors={['#7F0000','#00000000', '#B24112','#E5845C','#238C23','#7F0000']}
                />
                )
            })}
            {hexagons.map(hexagons => {
            return hexagons.boundaries.map(coords => {
                return (
                <Marker
                coordinate = {coords} 
                pinColor = "#FF00FF" 
                icon = {require('../../assets/images/map-taxi.png')}
                />
                )
            });
            })}
        </MapView>
        <Button title = 'Set new camera' onPress = {() => setMapCamera()}/>
        <Button title = 'Draw polygons' onPress = {async () => await draw_hexagons()}/>
    </>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
        width: '100%', 
        height: '100%', 
        zIndex: -1
    }
})