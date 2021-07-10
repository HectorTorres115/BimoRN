import React, {useState, useRef, useEffect} from 'react'
import { Button } from 'react-native'
import gql from 'graphql-tag'
//Maps
import MapView, {Marker} from 'react-native-maps'
// import darkStyle from '../Maps/mapstyle'
import { DriverLocationUpdated } from '../Listeners/DriverLocationUpdated'
import { useUsuario } from '../Context/UserContext'
import { useLazyQuery, useQuery } from 'react-apollo'
//Animated marker
import {DriverMarker} from '../Components/DriverMarker'
import { Animated, Easing } from 'react-native'

const QUERY_DRIVERS = gql`
query{
    GetCities{
      lat, lng, indexH3, driver{name, email}
    }
  }
`

export const Mapas = () => {
    //Animacion
    const [animacion] = useState(new Animated.Value(0));
    const spin = animacion.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })
    //Lifecycle methods
    useEffect(() => {
        console.log('Component did mount')
        Animated.loop(
            Animated.timing(animacion, {
                toValue: 1, 
                duration: 3000, 
                easing: Easing.linear, 
                useNativeDriver: true
            })
        ).start();
    }, [])
    //Global state
    const {setUser} = useUsuario();
    //State
    const globalMarker = useRef(React.Component);
    const driverMarker = useRef(React.Component);
    const [location, setLocation] = useState([]);
    const [region] = useState({
        longitude: -107.45220333333332,
        latitude: 24.82172166666667,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08
    });
    const [drivers, setDrivers] = useState([]);
    const [driverLocation, setDriverLocation] = useState({
        longitude: -107.45220333333332,
        latitude: 24.82172166666667
    });
    //Server requests
    useQuery(QUERY_DRIVERS, {
        partialRefetch: true,
        pollInterval: 4000,
        fetchPolicy:'no-cache',
        onCompleted:({GetCities})=>{
            console.log('Polled');
            setDrivers(GetCities)
          },
          onError:(error)=>{
            console.log(error);
          }
    })

    async function drawMarkers(object){
        if(location.length < 1){
            setLocation([...location, {color: "#00FF00", ...object}])
        } else if (location.length == 1) {
            setLocation([...location, {color: "#0000FF", ...object}])
        } else {
            setLocation([]);
        }
    }

    return(
        <>
        <MapView
        onPoiClick = {(e) => drawMarkers(e.nativeEvent.coordinate)}
        onPress = {(e) => drawMarkers(e.nativeEvent.coordinate)}
        // customMapStyle={darkStyle}
        style={{ flex: 1, width: '100%', height: '100%', zIndex: -1 }}
        initialRegion = {region}>
            {location.map(coord => {
                return <Marker ref = {globalMarker} coordinate = {coord} pinColor={coord.color}/>
            })} 
            {drivers.map(coord => {
                return <Marker coordinate = {{latitude:coord.lat, longitude:coord.lng}} pinColor={coord.color}/>
            })}
            <MapView.Marker.Animated
            style={{transform: [{rotate: spin}] }}
            ref = {driverMarker} 
            coordinate = {driverLocation} 
            image={require('../../assets/images/map-taxi.png')} 
            />
        </MapView>
        <Button title = "Animate marker" onPress = {() => animateMarker()}/>
        <Button title = "Rotate" onPress = {() => rotateMarker()}/>
        <DriverLocationUpdated 
        setter={setDriverLocation} 
        driverId={2} 
        driverMarker= {driverMarker} 
        duration={4000} />
        </>
    )
}