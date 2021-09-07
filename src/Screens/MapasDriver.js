import React, {useState, useRef, useEffect } from 'react'
import { Button, StyleSheet, View, Switch, Text } from 'react-native'
import gql from 'graphql-tag'
import MapView, {Marker, Polygon, Polyline} from 'react-native-maps'
import { useUsuario } from '../Context/UserContext'
import { useMutation, useQuery } from 'react-apollo'
import { FAB } from 'react-native-paper';
import decodePolyline from '../Functions/DecodePolyline'
import { backAction, handleAndroidBackButton } from '../Functions/BackHandler'
import { TripCreated } from '../Listeners/TripCreated'
import ReduxLocationStore from '../Redux/Redux-location-store'
import MotionSlider from 'react-native-motion-slider';
import AsyncStorage from '@react-native-community/async-storage'
import { useTrip } from '../Context/TripContext'
import { CardTripInfo } from '../Components/CardTripInfo'
// import { TripCreatedHooks } from '../Listeners/TripCreatedHooks'

const QUERY_DRIVERS = gql`
query{
    GetCities{
      id,lat, lng, indexH3, driver{name, email}
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
    tripStatusId
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
    originLocationLat
    originLocationLng
    destinationVincity
    destinationLocationLat
    destinationLocationLng
    tripPolyline
    driverPolyline
  }
}

`
const UPDATE_DRIVER_LOCATION = gql`
mutation update_driver_location($citiId: Int!, $lat: Float!,$lng: Float! ){
    UpdateCity(input:{
             id:$citiId
             lat:$lat
             lng:$lng
           }){
             id
             service{
               id
               name
             }
             driver{
               id
               name 
             }
             lastActive
             lat
             lng
             indexH3
           }
   }
`

export const MapasDriver = ({navigation}) => {
    //Lifecycle methods
    useEffect(() => {
      handleAndroidBackButton(() => backAction(setUser))
      const interval = setInterval(() => {
        // animateDriverMarker() 
        update_driver_location({variables:{
          citiId: usuario.city.id,
          lat: ReduxLocationStore.getState().latitude,
          lng: ReduxLocationStore.getState().longitude
        }
       })
      }, 4000);

      AsyncStorage.getItem('@trip_key').then((data)=>{
        const json = JSON.parse(data)
        // console.log(json.polylineTrip)
        // setPolyline(json.polylineTrip)

      }).catch((error)=>{console.log(error)})
        
      return () => clearInterval(interval);
    }, [])

    //Referencias
    const globalMapView = useRef(React.Component);
    const driverMarker = useRef(React.Component);
    //Global states from react context
    const {usuario, setUser} = useUsuario();
    const {trip, setTrip} = useTrip();
    //State
    const [isonline, setIsOnline] = useState(usuario.isOnline);
    const [region] = useState({longitude: -107.45220333333332, latitude: 24.82172166666667, latitudeDelta: 0.08, longitudeDelta: 0.08});
    const [drivers, setDrivers] = useState([]);
    const [driverLocation, setDriverLocation] = useState(ReduxLocationStore.getState());
    const [polyline, setPolyline] = useState([]);
    const [hexagons, setHexagons] = useState([]);
    const [hexagonsdestination, setHexagonsDestination] = useState([]);
    // const [trip, setTrip] = useState({});
    const [indexdriver, setIndexDriver] = useState(usuario.city.indexH3);
    const [indexorigin, setIndexOrigin] = useState(null);
    const [indexdestination, setIndexDestination] = useState(null);
    const [city, setCity] = useState(usuario.city);
    //Marcadores
    const [originCoordinates, setOriginCoordinates] = useState(null);
    const [destinantionCoordinates, setDestinationCoordinates] = useState(null);
    const [slidervalue, setSliderValue] = useState(0);

     //Server requests
    useQuery(QUERY_DRIVERS, {
        fetchPolicy:'no-cache',
        onCompleted:({GetCities}) => {
            let arrayDrivers = GetCities.filter(city=> city.id !== usuario.city.id)
            setDrivers(arrayDrivers)
          },
          onError:(error) => {
            console.log(error);
          }
    })

    const [update_driver_status] = useMutation(UPDATE_STATUS,{
        fetchPolicy: "no-cache",
        onCompleted:({UpdateDriver})=>{
            // console.log(UpdateDriver)
            setIsOnline(UpdateDriver.isOnline)
        },
        onError:(error)=>{
          console.log(error);
        }
    })

    const [get_hexagons] = useMutation(GET_HEXAGONS,{
        fetchPolicy: "no-cache",
        onCompleted:({GetHexagons})=>{
          console.log('GetHexagons is working')
        },
        onError:(error)=>{
          console.log(error);
        }
    })

    const [update_driver_location] = useMutation(UPDATE_DRIVER_LOCATION,{
      fetchPolicy: "no-cache",
      onCompleted:({UpdateCity})=>{
          setCity(UpdateCity)
          setIndexDriver(UpdateCity.indexH3)
          setDriverLocation(ReduxLocationStore.getState())
          // console.log(indexdriver)
          // console.log(indexorigin)
          // console.log(indexdestination)
          // console.log(trip.tripStatusId)
          if(indexdriver == indexorigin && trip.tripStatusId !== 4 && trip.tripStatusId !== 6 && trip.tripStatusId !==2){
             console.log('Esperando a pasajero')
            update_trip({variables:{id: trip.id,
              driverId: usuario.id,
              tripStatus: 4}})
          } else if (indexdriver == indexorigin && trip.tripStatusId !== 6) {
            console.log('iniciado')
            update_trip({variables:{id: trip.id,
              driverId: usuario.id,
              tripStatus: 6}})
          } else if (indexdriver == indexdestination && trip.tripStatusId !== 2){
            console.log('llego a destino')
            // update_trip({variables:{id: trip.id,
            //   driverId: usuario.id,
            //   tripStatus: 2}})
          }
      },
      onError:(error)=>{
        console.log(error);
      }
    })


    const [accept_trip] = useMutation(ACCEPT_TRIP,{
        fetchPolicy: "no-cache",
        onCompleted:async ({UpdateTrip}) => {
            setTrip(UpdateTrip)

            setPolyline(decodePolyline(UpdateTrip.tripPolyline))

            setOriginCoordinates({latitude: UpdateTrip.originLocationLat, longitude: UpdateTrip.originLocationLng})
            setDestinationCoordinates({latitude: UpdateTrip.destinationLocationLat, longitude: UpdateTrip.destinationLocationLng})

            animateCameraToPolylineCenter(decodePolyline(UpdateTrip.tripPolyline))

            get_hexagons({variables:{ lat:UpdateTrip.originLocationLat,lng: UpdateTrip.originLocationLng,res: 10,jumps: 0}}).then(({data})=>{
              setIndexOrigin(data.GetHexagons[0].index)
              setHexagons(data.GetHexagons)
            })

            get_hexagons({variables:{ lat:UpdateTrip.destinationLocationLat,lng: UpdateTrip.destinationLocationLng,res: 10,jumps: 0}}).then(({data})=>{

              setIndexDestination(data.GetHexagons[0].index)
              setHexagonsDestination(data.GetHexagons)
            })

            AsyncStorage.setItem('@trip_key', JSON.stringify({
                trip:UpdateTrip,
                indexdriver: indexdriver,
                indexorigin: indexorigin,
                indexdestination: indexdestination,
                polylineTrip:decodePolyline(UpdateTrip.tripPolyline)
              })).then(()=>{

                  console.log('guardo estados en storage')

              }).catch((error)=>{
                console.log(error)
              })
    
            // console.log(UpdateTrip.tripStatusId)
        },
        onError:(error) => {
          console.log(error);
        }
    })

    const [update_trip] = useMutation(ACCEPT_TRIP,{
      fetchPolicy: "no-cache",

      onCompleted:({UpdateTrip}) => {
        setTrip(UpdateTrip)
        // console.log('TripStatus changed (this gotta be printed just once)');
      },
      onError:(error) => {
        console.log(error);
      }
  })

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

    function EvaluateChatButton() {
      if(trip !== null){
        return <Button title = 'Chat' onPress = {() => navigation.navigate('Chat', {trip: trip})}/> 
      } else {
        return null
      }
    }

    function EvaluateMarkers() {
      if(originCoordinates !== null && destinantionCoordinates !== null){
        return (
          <>
          <Marker 
          color = 'blue'
          key = {Math.floor(1000 + Math.random() * 9000)} 
          coordinate = {originCoordinates} />
          <Marker 
          color = 'blue'
          key = {Math.floor(1000 + Math.random() * 9000)} 
          coordinate = {destinantionCoordinates} />
          </>
        )
      } else {return null}
    }

    // function handleSlider(value){
    //   setSliderValue(value)
    //   if(value == 40){

    //     console.log('viaje terminado!')
    //   }
    // }

    function EvaluateSlider() {
      // console.log('card')
      // console.log(trip.tripStatusId)
      if(indexdriver == indexdestination && trip.tripStatusId == 6){
          return (<MotionSlider
            min={0} 
            max={40}
            value={0} 
            decimalPlaces={10}
            units={'º'}
            backgroundColor={['#16A0DB', '#e3d912', '#32a852']}
            firstMessage = {'Teminar Viaje'}
            secondMessage = {'Terminando Viaje'}
            finalMessage = {'Viaje Terminado'}
            onValueChanged={(value) => {
              if(value == 40){
        
                update_trip({variables:{id: trip.id,
                  driverId: usuario.id,
                  tripStatus: 2}})
            }}}
            // onDrag={() => console.log('Dragging')}
      />)
      } else if(trip.tripStatusId == 2){
          return (
              <Text style = {styles.textTrip}>Viaje terminado</Text>
          )
        } else {
          return( <Text style = {styles.textTrip}>Aun no puedes terminar el viaje</Text>)
        }
    }

    function EvalText() {
      if(trip !== null){
        return <Text style = {styles.textTrip}>Trip has state</Text>
      } else {
        return <Text style = {styles.textTrip}>Trip has shit</Text>
      }
    }

    return(
        <>
        <MapView
        ref = {globalMapView}
        showsUserLocation = {true}
        showsMyLocationButton = {false}
        style={{ flex: 1, width: '100%', height: '100%', zIndex: -1 }}
        initialRegion = {region}>

            {drivers.map(coord => {
                return <Marker key = {coord.lat} coordinate = {{latitude:coord.lat, longitude:coord.lng}} pinColor={coord.color}/>
            })}

            {hexagons.map(hexagon => {
                return <Polygon fillColor = {'rgba(22, 161, 220, 0.5)'} key = {hexagon.index} coordinates = {hexagon.boundaries} strokeWidth={6} strokeColor ={"#16A1DC"} />
            })}
            {hexagonsdestination.map(hexagon => {
                return <Polygon fillColor = {'rgba(22, 161, 220, 0.5)'} key = {hexagon.index} coordinates = {hexagon.boundaries} strokeWidth={6} strokeColor ={"#16A1DC"} />
            })}
            {/* Marcador del driver */}
            <Marker key = {Math.floor(1000 + Math.random() * 9000)} 
            ref={driverMarker} 
            coordinate = {driverLocation}    
            icon={require('../../assets/images/map-taxi.png')}/>

            {/* <EvaluateMarkers/> */}

            <Polyline coordinates={polyline} strokeWidth={6} strokeColor ={"#16A1DC"} strokeColors={['#7F0000','#00000000', '#B24112','#E5845C','#238C23','#7F0000']} />
        </MapView>

        <View style = {styles.cardContainer}>
          {trip !== null ? <CardTripInfo/>: null}
            {/* <CardTripInfo/> */}
        </View>

        <View style={styles.fabContainer}>
            <FAB
            style={styles.fab}
            icon="camera"
            onPress={() => navigation.openDrawer()}
            />
        </View>    

        <TripCreated userId = {usuario.id} acceptTrip = {accept_trip} setTrip={setTrip} />

        <View style={styles.switchContainer}>
            <Text style={styles.text}>En linea</Text>
            <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isonline ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
              onValueChange={(status) => {
                    setIsOnline(status)
                    update_driver_status({variables:{id:usuario.id,status}})
                    }
              }
                value={isonline}
            />
        </View> 
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
    cardContainer: {
      alignContent: 'center',
      alignSelf: 'flex-end',
      position: "absolute",
      height: "33%",
      width: "100%"
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
      },
      textTrip: {
        fontSize: 20,
        color: 'green'
    }

  })
  