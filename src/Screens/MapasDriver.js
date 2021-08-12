import React, {useState, useRef, useEffect } from 'react'
import { Button, StyleSheet, View, Alert, Switch, Text } from 'react-native'
import gql from 'graphql-tag'
import MapView, {Marker, Polyline} from 'react-native-maps'
import { DriverLocationUpdated } from '../Listeners/DriverLocationUpdated'
import { useUsuario } from '../Context/UserContext'
import { useMutation, useQuery } from 'react-apollo'
import { FAB } from 'react-native-paper';
import { useAddress } from '../Context/AddressContext'
import decodePolyline from '../Functions/DecodePolyline'
import { backAction, handleAndroidBackButton } from '../Functions/BackHandler'
import { TripCreated } from '../Listeners/TripCreated'

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
const UPDATE_STATUS = gql`
mutation update_driver_status($id: Int!, $status: Boolean!){
    UpdateDriver(input:{
      id:$id, 
      isOnline:$status
    }){
      id
      email
      name
      isOnline
      phoneNumber
      photoUrl
      brand
      model
      plate
      rating
      genre
    }
  }
`
const GET_HEXAGONS = gql`
mutation get_hexagons($lat: Float!,$lng: Float!, $res: Int!, $jumps: Int!) {
    GetHexagons(
      input: {
        latitude: $lat
        longitude: $lng
        resolution: $res
        jumps: $jumps
      }
    ) {
      index
      cities {
        driver {
          id
          name
          isOnline
          model
          brand
          plate
          rating
        }
        lastActive
        lat
        lng
        id
        service {
          id
          commissionTypeId
          commissionValue
        }
      }
      boundaries {
        latitude
        longitude
      }
    }
  }
`
const ACCEPT_TRIP = gql`
mutation update_trip($id: Int!, $driverId: Int!, $tripStatus: Int!) {
  UpdateTrip(
    input: { id: $id, driverId: $driverId, tripStatusId: $tripStatus }
  ) {
    id
    driverId
    passengerId
    tripStatus {
      id
      tripStatus
    }
    passenger {
      id
      name
      email
      photoUrl
    }
    driver {
      id
      name
      email
      photoUrl
      brand
      model
      plate
      rating
      service{
          name
      }
    }
    commissionType {
      id
      commissionType
    }
    paymentMethod {
      id
      paymentMethod
    }
    commissionType {
      id
      commissionType
    }
    opt
    createdAt
    currency
    discount
    originVincity
  }
}

`

export const MapasDriver = ({navigation}) => {
    //Lifecycle methods
    useEffect(() => {
        handleAndroidBackButton(() => backAction(setUser))
    }, [])
    //Referencias
    const globalMarker = useRef(React.Component);
    const globalMapView = useRef(React.Component);
    const driverMarker = useRef(React.Component);
    //Global states from react context
    const {usuario, setUser} = useUsuario();
    const {address, setAddress} = useAddress()
    //State
    const [coords, setCoords] = useState(null);
    const [flag, setFlag] = useState(true);
    const [isonline, setIsOnline] = useState(false);
    const [location, setLocation] = useState([]);
    const [search, setSearch] = useState({});
    const [origin, setOrigin] = useState({});
    const [destination, setDestination] = useState({});
    const [region] = useState({longitude: -107.45220333333332, latitude: 24.82172166666667, latitudeDelta: 0.08, longitudeDelta: 0.08});
    const [drivers, setDrivers] = useState([]);
    const [driverLocation, setDriverLocation] = useState({longitude: -107.45220333333332, latitude: 24.82172166666667});
    const [route, setRoute] = useState({});
    const [polyline,setPolyline] = useState([]);
    const [hexagons,setHexagons] = useState([]);
    const [trip, setTrip] = useState(null);

    //Server requests
    useQuery(QUERY_DRIVERS, {
        partialRefetch: true,
        pollInterval: 4000,
        fetchPolicy:'no-cache',
        onCompleted:({GetCities}) => {
            console.log('Polled');
            setDrivers(GetCities)
          },
          onError:(error) => {
            console.log(error);
          }
    })

    const [get_route_info] = useMutation(DRAW_ROUTE,{
        fetchPolicy: "no-cache",
        onCompleted:({GetRouteInfo})=>{
        //console.log(globalMapView);
        setRoute(GetRouteInfo)
        setPolyline(decodePolyline(GetRouteInfo.polyline))
        globalMapView.current.animateCamera({
            center:{coords},
            zoom:18,
            pitch: 20,
            heading: coords.heading
        },
        {
            duration:1000
        })

        },
        onError:(error)=>{
          console.log(error);
        }
    })

    const [get_current_info] = useMutation(CURRENT_ADDRESS,{
        fetchPolicy: "no-cache",
        onCompleted:({GetRouteInfo})=>{

            const shortAddress = GetRouteInfo.startAdress.split(',')

            setOrigin({name: shortAddress[0]})
        },
        onError:(error)=>{
          console.log(error);
        }
    })

    const [update_driver_status] = useMutation(UPDATE_STATUS,{
        fetchPolicy: "no-cache",
        onCompleted:({UpdateDriver})=>{
            console.log(UpdateDriver)
            setIsOnline(UpdateDriver.isOnline)
        },
        onError:(error)=>{
          console.log(error);
        }
    })

    const [get_hexagons] = useMutation(GET_HEXAGONS,{
        fetchPolicy: "no-cache",
        onCompleted:({GetHexagons})=>{

            setHexagons(GetHexagons)
        },
        onError:(error)=>{
          console.log(error);
        }
    })

    const [accept_trip] = useMutation(ACCEPT_TRIP,{
        fetchPolicy: "no-cache",
        onCompleted:({TripUpdated}) => {
            console.log(TripUpdated)
            // setTrip(TripUpdated)
            // setListenerChat(true)
        },
        onError:(error) => {
          console.log(error);
        }
    })
    //Functions for components callbacks
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
    async function drawHexagons(){
        get_hexagons({variables:{ lat:address.latitude,lng: address.longitude,res: 7,jumps: 1}});
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
            // const address = await globalMapView.current.addressForCoordinate(coords.latitude,coords.longitude)
            // console.log(coords)
            return address
        } else {
            setOrigin({name:"Ubicacion Actual"})
        }

    }
    //Evaluate methods for custom renders
    function EvaluateTripSubscription() {
        if(flag){
            return (
                <TripCreated userId = {usuario.id} acceptTrip = {accept_trip} setTrip={setTrip}/>
            )   
        } else {
            return null
        }
    }

    function EvaluateChatButton() {
      if(trip !== null){
        return <Button title = 'Chat' onPress = {() => navigation.navigate('Chat', {trip: trip})}/> 
      } else {
        return null
      }
    }

    return(
        <>
        <MapView
        ref = {globalMapView}
        onMapReady = { () => getCurrentDirection() }
        showsUserLocation = {true}
        showsMyLocationButton = {false}
        style={{ flex: 1, width: '100%', height: '100%', zIndex: -1 }}
        initialRegion = {region}>
            {location.map(coord => {
                return <Marker key = {coord.lat} ref = {globalMarker} coordinate = {coord} pinColor={coord.color}/>
            })} 
            {drivers.map(coord => {
                return <Marker key = {coord.lat} coordinate = {{latitude:coord.lat, longitude:coord.lng}} pinColor={coord.color}/>
            })}
            {hexagons.map(hexagon => {
                return <Polyline key = {hexagon.index} coordinates = {hexagon.boundaries} strokeWidth={6} strokeColor ={"#16A1DC"} strokeColors={['#7F0000','#00000000', '#B24112','#E5845C','#238C23','#7F0000']} />
            })}
            <Polyline coordinates={polyline} strokeWidth={6} strokeColor ={"#16A1DC"} strokeColors={['#7F0000','#00000000', '#B24112','#E5845C','#238C23','#7F0000']} />
        </MapView>

        <EvaluateTripSubscription/>
        <EvaluateChatButton/>

        <Button title = "DrawRoute" onPress = {() => drawRoute()}/> 
        <Button title = "Perfil" onPress = {() => navigation.navigate("Perfil")}/> 
        <View style={styles.fabContainer}>
            <FAB
            style={styles.fab}
            icon="menu"
            onPress={() => navigation.openDrawer()}
            />
        </View>    
        <View style={styles.switchContainer}>
            <Text style={styles.text}>En linea</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isonline ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(status) => {
                    setIsOnline(status)
                    update_driver_status({variables:{id:usuario.id,status}})
                    // console.log(status)
                    }
                }
                value={isonline}
            />
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
    switchContainer:{
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        position: "absolute",
        height: "5%",
        width: "100%"
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
      },
      text:{
          margin: 5
      }
  })
  