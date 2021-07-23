import React, {useState, useRef, useEffect, useLayoutEffect} from 'react'
import { Button, StyleSheet, View, TextInput, Alert, Text } from 'react-native'
import gql from 'graphql-tag'
//Maps
import MapView, {Marker, Polyline} from 'react-native-maps'
import { DriverLocationUpdated } from '../Listeners/DriverLocationUpdated'
import { useUsuario } from '../Context/UserContext'
import { useAddress } from '../Context/AddressContext'
import { useMutation, useQuery } from 'react-apollo'
import { FAB } from 'react-native-paper';
import decodePolyline from 'decode-google-map-polyline'
// import Geolocation from '@react-native-community/geolocation'
import Geolocation from 'react-native-geolocation-service'

const QUERY_DRIVERS = gql`
query{
    GetCities{
      lat, lng, indexH3, driver{name, email}
    }
  }
`
const DRAW_ROUTE = gql`
mutation get_route_info($object: JSON){
    GetRouteInfo(object: $object) {
      startAdress
      endAdress
      polyline
      distance
      time
    }
  }
`
const CURRENT_ADDRESS = gql`
mutation get_current_info($object: JSON){
    GetRouteInfo(object: $object) {
      startAdress
    }
  }
`

export const Mapas = ({navigation}) => {
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
    //Lifecycle methods
    useEffect(() => {
        console.log(`Component did mount`)
    }, [])
    //Geolocation
    Geolocation.watchPosition(
        ({coords}) => {setCoords(coords)},
        (error) => {console.log(error)},
        {options: geolocationConfig}
    )
    //Referencias
    const globalMarker = useRef(React.Component);
    const globalMapView = useRef(React.Component);
    const driverMarker = useRef(React.Component);
    //Global states
    const {usuario, setUser} = useUsuario();
    const {address, setAddress} = useAddress();
    //State
    const [coords, setCoords] = useState(null);
    const [location, setLocation] = useState([]);
    const [search, setSearch] = useState({});
    const [origin, setOrigin] = useState({});
    const [destination, setDestination] = useState({});
    const [region, setRegion] = useState({longitude: -107.45220333333332, latitude: 24.82172166666667, latitudeDelta: 0.08, longitudeDelta: 0.08});
    const [driverLocation, setDriverLocation] = useState({longitude: -107.45220333333332,latitude: 24.82172166666667});
    const [drivers, setDrivers] = useState([]);
    const [route, setRoute] = useState({});
    const [polyline, setPolyline] = useState([]);

    //Server requests
    useQuery(QUERY_DRIVERS, {
        fetchPolicy:'no-cache',
        onCompleted:({GetCities})=>{
            setDrivers(GetCities)
          },
          onError:(error)=>{
            console.log(error);
          }
    })

    const [get_route_info] = useMutation(DRAW_ROUTE,{
        fetchPolicy: "no-cache",
        onCompleted:({GetRouteInfo})=>{
        console.log(GetRouteInfo)
        setRoute(GetRouteInfo)
        setPolyline(decodePolyline(GetRouteInfo.polyline))
        animateCameraToPolylineCenter()
        },
        onError:(error)=>{
          console.log(error);
        }
    })

    const [get_current_info] = useMutation(CURRENT_ADDRESS, {
        fetchPolicy: "no-cache",
        onCompleted:({GetRouteInfo})=>{
            const shortAddress = GetRouteInfo.startAdress.split(',')
            setOrigin({name: shortAddress[0]})
        },
        onError: (error)=>{
          console.log(error);
        }
    })
    //Callbacks for components on mapview
    async function drawMarkers(object){
        if(location.length < 1){
            setLocation([...location, {color: "#00FF00", ...object}])
        } else if (location.length == 1) {
            setLocation([...location, {color: "#0000FF", ...object}])
        } else {
            setLocation([]);
        }
    }

    async function drawRoute(){
        if(origin == null || destination == null){
            Alert.alert("No se ha asignado localizacion")
        } else{
            get_route_info({variables:{
                "object":{  
                  "start": coords, 
                  "end": destination.placeId
                }
              }

            });
        }
    }

    async function getCurrentDirection() {
        if(address !== null){
            get_current_info({variables:{
                "object":{  
                    "start": address, 
                    "end": region
                    }
                }
            })
            return address
        } else{
            setOrigin({name:"Ubicacion Actual"})
        }

    }

    async function animateCameraToPolylineCenter(){
        const polylineCenterCoords = polyline[parseInt(polyline.length / 2)];
        globalMapView.current.animateCamera({
            center: {
            latitude: polylineCenterCoords.latitude,
            longitude: polylineCenterCoords.longitude
            },
            pitch: 1,
            heading: 0,
            zoom: 13,
            altitude: 0
        }, 1000) 
    }

    return (
        <>
        <MapView
        ref = {globalMapView}
        onMapReady = { ()=> getCurrentDirection() }
        showsUserLocation = {true}
        onPoiClick = {(e) => drawMarkers(e.nativeEvent.coordinate)}
        onPress = {(e) => drawMarkers(e.nativeEvent.coordinate)}
        style={{ flex: 1, width: '100%', height: '100%', zIndex: -1 }}
        initialCamera = {initialCameraConfig}>
            {location.map(coord => {
                return <Marker key = {coord.lat} ref = {globalMarker} coordinate = {coord} pinColor={coord.color}/>
            })} 
            {drivers.map(coord => {
                return <Marker key = {coord.lat} coordinate = {{latitude:coord.lat, longitude:coord.lng}} pinColor={coord.color}/>
            })}
            <Polyline coordinates={polyline} strokeWidth={6} strokeColor ={"#16A1DC"} strokeColors={['#7F0000','#00000000', '#B24112','#E5845C','#238C23','#7F0000']} />
        </MapView>
        <Button title = "DrawRoute" onPress = {() => drawRoute()}/> 
        <View style={styles.fabContainer}>
            <FAB
            style={styles.fab}
            icon="menu"
            onPress={() => navigation.navigate('MapCamera')}
            />
        </View>    
        <View style={styles.inputsContainer}>
            <TextInput 
            placeholder="   Origen" 
            placeholderTextColor="gray" 
            value= {origin.name}
            style={styles.input} 
            onPressIn= {()=> {navigation.navigate("FindAddress",{setter:setOrigin, setter_search: setSearch, search})}}/>
            <TextInput 
            placeholder="   Destino" 
            placeholderTextColor="gray" 
            value= {destination.name}
            style={styles.input}
            onPressIn= {()=> navigation.navigate("FindAddress",{setter:setDestination, setter_search: setSearch, search})} /> 
        </View> 
        <DriverLocationUpdated 
        setter={setDriverLocation} 
        driverId={2} 
        driverMarker= {driverMarker} 
        duration={4000} />
        </>
    )
}

const styles = StyleSheet.create({
    fab: {
    //   position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: "#16A0DB"
    },
    fabContainer:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        height: "10%",
        width: "20%"
    },
    inputsContainer:{
        height: 120,
        position: "absolute",
        // backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        // borderWidth:2,
        // borderColor: "red",
        width:"100%",
        marginTop:80
    },
    input:{
        backgroundColor:"rgba(255,255,255,0.5)",
        borderRadius:5,
        borderWidth:2,
        borderColor:"gray",
        fontSize:20,
        color: "black",
        width: '90%',
        borderRadius:25,
        margin: 5,
        height: "50%",
      }
  })
  