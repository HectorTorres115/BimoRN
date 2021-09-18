import React, {useState, useRef, useEffect, useLayoutEffect} from 'react'
import { Button, StyleSheet, View, TextInput, Alert, ScrollView, Text, FlatList, Pressable } from 'react-native'
import { Avatar, BottomNavigation  } from 'react-native-paper'
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
import { useTrip } from '../Context/TripContext'
import {DeleteTrip} from '../Functions/TripStorage'
// import darkStyle from '../Styles/darkStyle'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button as ButtonPaper } from 'react-native-paper';

const QUERY_DRIVERS = gql`
query{
    GetCities{
      lat, lng, indexH3, driver{name, email, isOnline}
    }
  }
`
const QUERY_SERVICES = gql`
query{
  GetServices{
    id
    name
    icon
    mapIcon
    seats
    commissionType{
      id
      commissionType
    }
    tarifaBase
    cuotaDeSolicitudPorKm
    tarifaMinima
    costoPorKm
    costoPorTiempo
    tarifaDeCancelacion
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
      note:$note,
      serviceId:1
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
        console.log(trip);
    }, [])
    //Referencias
    const globalMarker = useRef(React.Component);
    const globalMapView = useRef(React.Component);
    const driverMarker = useRef(React.Component);
    //Global states
    const {usuario, setUser} = useUsuario();
    const {address, setAddress} = useAddress();
    const {trip, setTrip} = useTrip();
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
    // const [trip, setTrip] = useState(null);
    const [chat, setChat] = useState(null);
    const [driverState, setDriverState] = useState(null);
    const [services, setServices] = useState([]);

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

    useQuery(QUERY_SERVICES, {
      fetchPolicy:'no-cache',
      onCompleted:({GetServices})=>{
          setServices(GetServices)
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
          setTrip(data.CreateTrip)
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
              paymentMethod: 1,
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
        if(trip !== null){
            return <TripUpdated 
            // setDriverPolyline ={setDriverPolyline}
            trip={trip} setTrip = {setTrip}
            driverState={driverState} setDriverState = {setDriverState}
            />
        } else {
          return null 
        }
    }

    function EvaluateStartChat() {
      if(trip !== null){
          return <Button title = "Chat" onPress = {() => navigation.navigate("Chat", { trip: trip })}/> 
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

    const elegirServicio = (item)=>{
      console.log(item)
    }

    function deleteStorage() {
      setTrip(null);
      setPolyline([])
      DeleteTrip()
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
        {/* <EvaluateStartChat /> */}

        {/* <Button title = "Perfil" onPress = {() => navigation.navigate("Perfil")}/>  */}
        {/* <Button title = "Draw Route" onPress = {() => drawRoute()}/> 
        <Button title = "Crear Viaje" onPress = {() => createTrip()}/>  */}
        
        {/* <View style = {styles.cardContainer}>
          <CardPassenger>
            <FlatList 
              data={services} 
              key = {(item)=> item.id}
              keyExtractor = {(item)=> item.id}
              horizontal= {true}
              renderItem = { ({item}) => (
                <View style = {styles.serviceContainer}>
                  <View >
                    <Pressable onPress={ ()=> elegirServicio(item)}> 
                      <Avatar.Image size={40} source={require('../../assets/images/avatar.jpg')} style= {styles.avatar}/>  
                      <Text style={styles.texto}>Tarifa</Text>
                      <Text style={styles.texto}>{item.name}</Text>
                    </Pressable>
                  </View>
                </View>
              ) }
              >
            </FlatList>
            <ScrollView contentContainerStyle = {styles.scroll} horizontal = {true}>
              <Button title = 'Draw route'></Button>
              <Button title = 'Create Trip' onPress = {() => createTrip()}></Button>
              <Button title = 'Delete Trip' onPress = {() => {
                setTrip(null)
                DeleteTrip()
              }}></Button>
            </ScrollView>
          </CardPassenger>
        </View> */}

        <View style = {styles.cardContainer}>
          <CardPassenger>
          <Text style = {styles.textCard}>Metodos de pago</Text>
          <View style ={{flex: 1/2, justifyContent: 'space-between', alignItems: 'space-between', flexDirection: 'row'}}>
            <ButtonPaper icon="credit-card" mode="contained" onPress={() => console.log('Pressed')}>card</ButtonPaper>
            <ButtonPaper style = {{backgroundColor: '#329239'}} icon="cash" mode="contained" onPress={() => console.log('Pressed')}>cash</ButtonPaper>
            <ButtonPaper style = {{backgroundColor: '#f7931a'}} icon="bitcoin" mode="contained" onPress={() => console.log('Pressed')}>bitcoin</ButtonPaper>
          </View>
          <Text style = {styles.textCard}>Servicios</Text>
          <View style ={{flex: 1/2, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Servicios</Text>
          </View>
          <Text style = {styles.textCard}>Viaje</Text>
          <View style ={{flex: 1/2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
            <ButtonPaper style = {{backgroundColor: '#16A0DB'}} icon="plus" mode="contained" onPress={() => createTrip()}>Viaje</ButtonPaper>
            <ButtonPaper style = {{backgroundColor: '#4d4545'}} icon="highway" mode="contained" onPress={() => drawRoute()}>Ruta</ButtonPaper>
            <ButtonPaper style = {{backgroundColor: '#ad1717'}} icon="delete-circle" mode="contained" onPress={() => deleteStorage()}>Eliminar</ButtonPaper>
          </View>
          </CardPassenger>
        </View>

        <View style={styles.fabContainer}>
            <FAB
            style={styles.fab}
            icon="menu"
            // icon="plus"
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
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        position: "relative",
        height: "30%",
        width: "98%"
      },
      scroll: {
        flex: 1,
        // flexDirection: 'row',
        height: '100%',
        borderWidth: 2,
        borderColor: 'blue'
      },
      serviceContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:2,
        borderColor:"gray",
        margin:10
      },
      avatar:{
        marginTop:10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
      },
      texto:{
        fontSize: 15,
        color: 'black'
      },
      textCard: {
        fontSize: 17,
        color: 'black',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: 35
      }
  })
  