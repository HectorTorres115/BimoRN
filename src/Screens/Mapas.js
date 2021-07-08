import React, {useState, useRef} from 'react'
import { Button } from 'react-native'
import gql from 'graphql-tag'
//Maps
import MapView, {Marker} from 'react-native-maps'
// import darkStyle from '../Maps/mapstyle'
import { DriverLocationUpdated } from '../Listeners/DriverLocationUpdated'
import { useUsuario } from '../Context/UserContext'
import { useLazyQuery, useQuery } from 'react-apollo'
import Geolocation from '@react-native-community/geolocation'

const QUERY_DRIVERS = gql`
query{
    GetCities{
      lat, lng, indexH3, driver{name, email}
    }
  }
`

export const Mapas = () => {
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
    const [driverLocation,setDriverLocation] = useState({longitude: -107.45220333333332,latitude: 24.82172166666667});
    const {usuario,setUser} = useUsuario([]);
    const [query_drivers] = useLazyQuery(QUERY_DRIVERS,{
        fetchPolicy:'no-cache',
        onCompleted:({GetCities})=>{
            console.log(GetCities);
            setDrivers(GetCities)
          },
          onError:(error)=>{
            console.log(error);
          }
    })
    
    Geolocation.watchPosition(async (info) => {
         console.log(info.coords);
            await query_drivers()
        }, (error) => console.log(error),
        {enableHighAccuracy: true, distanceFilter: 0, useSignificantChanges: false, maximumAge: 0})

    async function drawMarkers(object){
        if(location.length < 1){
            setLocation([...location, {color: "#00FF00", ...object}])
        } else if (location.length == 1) {
            setLocation([...location, {color: "#0000FF", ...object}])
        } else {
            setLocation([]);
        }
    }

    function animateMarker() {
        let duration = 1000
        globalMarker.current.animateMarkerToCoordinate(location[0], duration)
    }

    // setInterval(async () => {
    //     await query_drivers()
    //     console.log('imprimiendo conductores')
    // }, 4000);

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
                return <Marker coordinate = {{latitude:coord.lat,longitude:coord.lng}} pinColor={coord.color}/>
            })}
            <Marker ref = {driverMarker} coordinate = {driverLocation} tracksViewChanges={true} image={require('../../assets/images/delorean.png')} rotation={(240)} />
        </MapView>
        <Button title = "Animate marker" onPress = {() => animateMarker()}/>
        <Button title = "Usuario" onPress = {() => setUser(null)}/>
        <DriverLocationUpdated setter={setDriverLocation} driverId={2} driverMarker= {driverMarker} duration={4000} />
        </>
    )
}