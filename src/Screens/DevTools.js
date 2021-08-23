//React imports
import React, {useState, useEffect, useRef} from 'react'
import { StyleSheet, Text, View } from 'react-native'
//React native maps
import MapView, {Marker, Polyline} from 'react-native-maps'

export const DevTools = () => {
    //Local refs
    const globalMapView = useRef(React.Component);
    const driverMarker = useRef(React.Component);
    //Local states
    const [drivers, setDrivers] = useState([]);
    const [routePoints, setRoutePoints] = useState([]);
    return (
        <>
        <MapView
        ref = {globalMapView}
        showsMyLocationButton = {false}
        style={styles.mapStyleConfig}
        initialCamera = {initialCameraConfig}>
            {location.map(coord => {
                return <Marker key = {coord.lat} coordinate = {coord} pinColor={coord.color}/>
            })} 
            {drivers.map(coord => {
                return <Marker key = {coord.lat} coordinate = {{latitude:coord.lat, longitude:coord.lng}} pinColor={coord.color}/>
            })}
            {/* //Driver marker */}
            <Marker ref  = {driverMarker} key = {115} coordinate = {driverLocation} icon = {require('../../assets/images/map-taxi3.png')}/>
            {/* //Trip polyline */}
            <Polyline coordinates={polyline} strokeWidth={6} strokeColor ={"#16A1DC"} strokeColors={['#7F0000','#00000000', '#B24112','#E5845C','#238C23','#7F0000']} />
        </MapView>
        </>
    )
}

const styles = StyleSheet.create({
    mapStyleConfig: {
        flex: 1,
        width: '100%',
        height: '100%', 
        zIndex: -1 
    }
})