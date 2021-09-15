import React, {useState, useRef, useEffect, useLayoutEffect} from 'react'
import { Button, StyleSheet, View, TextInput, Alert, ScrollView, Text } from 'react-native'
import gql from 'graphql-tag'
//Maps
import MapView, {Marker, Polyline} from 'react-native-maps'
import { DriverLocationUpdated } from '../Listeners/DriverLocationUpdated'
import { useUsuario } from '../Context/UserContext'
import { useAddress } from '../Context/AddressContext'
import { useMutation, useQuery } from 'react-apollo'
import { FAB } from 'react-native-paper';
import decodePolyline from '../Functions/DecodePolyline'
// import Geolocation from '@react-native-community/geolocation'
import Geolocation from 'react-native-geolocation-service'
import ReduxLocationStore from '../Redux/Redux-location-store';
import { set_location } from '../Redux/Redux-actions';
import { backAction, handleAndroidBackButton } from '../Functions/BackHandler'
import { TripUpdated } from '../Listeners/TripUpdated'
// import DriverPanel from '../Components/DriverPanel'
import { CardPassenger } from '../Components/CardPassenger'
import darkStyle from '../Styles/darkStyle'


const QUERY_DRIVERS = gql`
query{
    GetCities{
      lat, lng, indexH3, driver{name, email, isOnline}
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
mutation get_address($lat: Float!, $lng: Float!){
  GetAddress(lat: $lat, lng: $lng)
}
`
const CREATE_TRIP = gql`
mutation create_trip($passengerId: Int!, $origin: JSON!, $destination: JSON!, $paymentMethod: Int!, $note: String!){
    CreateTrip(input:{
      passengerId:$passengerId
      tripStatusId:5
      promocodeId:1
      commissionTypeId:1
      origin: $origin
      destination: $destination
      paymentMethodId:$paymentMethod
      note:$note
    })
    {
      id
      opt
      driverId
      passengerId
      driver{
        id
        name
      }
      passenger{
        id
        name
      }
      tripStatus{
        id
        tripStatus
      }
      commissionType{
        id
        commissionType
      }
      paymentMethod{
        id
        paymentMethod
      }
      promocode{
        id
        code
        discount
      }
      commission
      commissionValue
      createdAt
      currency
      originVincity
      originLocationLat
      originLocationLng
      destinationVincity
      destinationLocationLat
      destinationLocationLng
      discount
      distance
      pickedUpAt
      droppedOffAt
      fee
      feeTaxed
      feedback
      note
      rating
      rawfee
      tax
      tripPolyline
    }
  }
`
const CREATE_CHAT = gql`
mutation create_chat($tripId: Int!,$driverId: Int!,$passengerId: Int!){
  CreateChat(input:{
    tripId:$tripId
    driverId:$driverId
    passengerId:$passengerId
  }){
    id
    createdAt
    status
    driverId
    passengerId
    driver{
      id
      name
      email
    }
    passenger
    {
      id
      name
      email
    }
    messages{
      id
      message
      sender
    }
  }
}
`

export const Mapas = ({navigation}) => {
    //Config objects
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
        handleAndroidBackButton(() => backAction(setUser))
    }, [])
    //Referencias
    const globalMarker = useRef(React.Component);
    const globalMapView = useRef(React.Component);
    const driverMarker = useRef(React.Component);
    //Global states
    const {usuario, setUser} = useUsuario();
    const {address, setAddress} = useAddress();
    //State
    const [coords, setCoords] = useState(ReduxLocationStore.getState());
    const [location, setLocation] = useState([]);
    const [search, setSearch] = useState({});
    const [origin, setOrigin] = useState({});
    const [destination, setDestination] = useState({});
    const [region, setRegion] = useState({longitude: -107.45220333333332, latitude: 24.82172166666667, latitudeDelta: 0.08, longitudeDelta: 0.08});
    const [driverLocation, setDriverLocation] = useState({longitude: -107.45220333333332,latitude: 24.82172166666667});
    const [drivers, setDrivers] = useState([]);
    const [route, setRoute] = useState({});
    const [polyline, setPolyline] = useState([]);
    const [driverPolyline, setDriverPolyline] = useState([]);
    const [startsuscription, setStartSuscription] = useState(false);
    const [currenttrip, setCurrentTrip] = useState(null);
    const [chat, setChat] = useState(null);
    const [driverState, setDriverState] = useState(null);

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
        // console.log(GetRouteInfo)
        setRoute(GetRouteInfo)
        setPolyline(decodePolyline(GetRouteInfo.polyline))
        animateCameraToPolylineCenter(decodePolyline(GetRouteInfo.polyline))
        },
        onError:(error)=>{
          console.log(error);
        }
    })

    const [get_address] = useMutation(CURRENT_ADDRESS, {
        fetchPolicy: "no-cache",
        onCompleted:({GetAddress})=>{
          console.log(GetAddress)
          console.log(ReduxLocationStore.getState())
            const shortAddress = GetAddress.split(',')
            setOrigin({name: shortAddress[0]})
        },
        onError: (error)=>{
          console.log(error);
        }
    })

    const [create_trip] = useMutation(CREATE_TRIP, {
        fetchPolicy: "no-cache",
        onCompleted:(data)=>{

          console.log(data.CreateTrip.destinationLocationLat)
          console.log(data.CreateTrip.destinationLocationLng)
          setCurrentTrip(data.CreateTrip)
          setPolyline(decodePolyline(data.CreateTrip.tripPolyline))
          animateCameraToPolylineCenter(decodePolyline(data.CreateTrip.tripPolyline))

          
        },
        onError: (error)=>{
          console.log(error);
        }
    })

    const [create_chat] = useMutation(CREATE_CHAT, {
      fetchPolicy: "no-cache",
      onCompleted:({CreateChat})=>{
          console.log(CreateChat)
          setChat(CreateChat)
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
                  "start": ReduxLocationStore.getState(), 
                  "end": destination.placeId
                }
              }

            });
        }
    }

    async function createTrip(){
      if(origin == null || destination == null){
          Alert.alert("No se ha asignado localizacion")
      } else{
        create_trip({variables:{
              passengerId: usuario.id,
              "origin": ReduxLocationStore.getState(),
              "destination":  destination.placeId,
              paymentMethod:1,
              note:""
            }
          });
      }
    }

    async function getCurrentDirection() {
        if(ReduxLocationStore.getState() !== null){
          get_address({variables: {lat: ReduxLocationStore.getState().latitude, lng: ReduxLocationStore.getState().longitude}})
          return ReduxLocationStore.getState()
        } else{
            setOrigin({name:"Ubicacion Actual"})
        }

    }

    async function animateCameraToPolylineCenter(polyline){
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
        }, {duration: 1000}) 
    }

    function EvaluateStartSuscription() {
        if(currenttrip !== null){
            return <TripUpdated 
            // setDriverPolyline ={setDriverPolyline}
            trip={currenttrip} setTrip = {setCurrentTrip}
            driverState={driverState} setDriverState = {setDriverState}
            />
        } else {
          return null 
        }
    }

    function EvaluateStartChat() {
      if(currenttrip !== null){
          return <Button title = "Chat" onPress = {() => navigation.navigate("Chat", { trip: currenttrip })}/> 
      } else{
          return null
      }
    }

    function EvaluateCityDriver() {
      if(driverState !== null){
        // console.log(driverState)
        return (
          <DriverLocationUpdated 
          setter={setDriverLocation} 
          driverId={driverState.id} 
          driverMarker= {driverMarker} 
          duration={4000} />
        )
      } else {
        return null
      }
    }

    return (
        <>
        <MapView
        // customMapStyle = {darkStyle}
        ref = {globalMapView}
        onMapReady = { () => getCurrentDirection() }
        showsUserLocation = {true}
        showsMyLocationButton = {false}
        style={{ flex: 1, width: '100%', height: '100%', zIndex: -1 }}
        initialCamera = {initialCameraConfig}>
            {location.map(coord => {
                return <Marker key = {coord.lat} ref = {globalMarker} coordinate = {coord} pinColor={coord.color}/>
            })} 
            {drivers.map(coord => {
                return <Marker key = {coord.lat} coordinate = {{latitude:coord.lat, longitude:coord.lng}} pinColor={coord.color}/>
            })}
            {/* //Driver marker */}
            <Marker ref  = {driverMarker} key = {115} coordinate = {driverLocation} icon = {require('../../assets/images/map-taxi.png')}/>
            {/* //Trip polyline */}
            <Polyline coordinates={polyline} strokeWidth={6} strokeColor ={"#16A1DC"} strokeColors={['#7F0000','#00000000', '#B24112','#E5845C','#238C23','#7F0000']} />
            <Polyline coordinates={driverPolyline} strokeWidth={6} strokeColor ={"#000000"} strokeColors={['#7F0000','#00000000', '#B24112','#E5845C','#238C23','#7F0000']} />
        </MapView>

        <EvaluateStartSuscription />
        <EvaluateStartChat />

        {/* <Button title = "Perfil" onPress = {() => navigation.navigate("Perfil")}/>  */}
        {/* <Button title = "Draw Route" onPress = {() => drawRoute()}/> 
        <Button title = "Crear Viaje" onPress = {() => createTrip()}/>  */}
        
        <View style = {styles.cardContainer}>
          <CardPassenger>
            <ScrollView contentContainerStyle = {styles.scroll}>
              <Button title = 'Draw route'></Button>
              <Button title = 'Profile'></Button>
              <Button title = 'Idk'></Button>
            </ScrollView>
          </CardPassenger>
        </View>

        <View style={styles.fabContainer}>
            <FAB
            style={styles.fab}
            icon="menu"
            onPress={() => navigation.navigate('MapCamera')}
            />
        </View>    

        <View style={styles.inputsContainer}>
            <TextInput 
            placeholder="Origen" 
            placeholderTextColor="gray" 
            value= {origin.name}
            style={styles.input} 
            onPressIn= {()=> {navigation.navigate("FindAddress", {setter:setOrigin, setter_search: setSearch, search, drawRoute: drawRoute})}}/>
            <TextInput 
            placeholder="Destino" 
            placeholderTextColor="gray" 
            value= {destination.name}
            style={styles.input}
            onPressIn= {()=> navigation.navigate("FindAddress", {setter:setDestination, setter_search: setSearch, search, drawRoute: drawRoute})} /> 
        </View>  

        <EvaluateCityDriver/>

        {/* <DriverLocationUpdated 
        setter={setDriverLocation} 
        driverId={2} 
        driverMarker= {driverMarker} 
        duration={4000} /> */}
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
        fontSize: 20,
        color: "black",
        width: '95%',
        // borderRadius:25,
        margin: 5,
        height: "50%",
        paddingLeft: 10
      },
      cardContainer: {
        marginBottom: 10,
        alignSelf: 'center',
        alignContent: 'center',
        position: "relative",
        height: "25%",
        width: "98%"
      },
      scroll: {
        // flex: 1,
        // flexDirection: 'row',
        width: '100%',
        borderWidth: 2,
        borderColor: 'blue'
      }
  })
  