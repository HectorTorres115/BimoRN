import React, { useState, useRef, useEffect } from 'react'
import { Button, StyleSheet, View, TextInput, Alert, Text } from 'react-native'
import gql from 'graphql-tag'
import { useMutation, useQuery, useLazyQuery } from 'react-apollo'
//Maps
import MapView, { Marker, Polyline } from 'react-native-maps'
import decodePolyline from '../Functions/DecodePolyline'
import ReduxLocationStore from '../Redux/Redux-location-store';
//Back handler
import { backAction, handleAndroidBackButton } from '../Functions/BackHandler'
//Context
import { useUsuario } from '../Context/UserContext'
import { useTrip } from '../Context/TripContext'
import { useViaje } from '../Context/ViajeContext'
//Custom componentss
import { TripUpdated } from '../Listeners/TripUpdated'
import { DriverLocationUpdated } from '../Listeners/DriverLocationUpdated'
import { CardPassenger } from '../Components/CardPassenger'
import { Fab } from '../Components/Fab'
//Local storage
import { viajeDefaultState } from '../Context/ViajeContext'
import { SetViaje as SetViajeStorage, DeleteViaje as DeleteViajeStorage} from '../Functions/ViajeStorage'
import { SetTrip as SetTripStorage, DeleteTrip as DeleteTripStorage} from '../Functions/TripStorage'

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
  GetAddress(lat: $lat, lng: $lng){
    name, placeId, direction
  }
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
      chatId
    }
  }
`
const GET_COST = gql`
mutation get_cost($serviceId:Int!, $distance: String!, $time:String!){
  GetCost(input: {
    serviceId: $serviceId
    distance: $distance
    time: $time
  }){
    rawfee,
    feeTaxed,
    fee
  }
}
`

export const Mapas = ({ navigation }) => {
  //Config objects
  const initialCameraConfig = {
    center: {
      // longitude: -107.45220333333332,
      // latitude: 24.82172166666667,
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
  //Referencias
  const globalMapView = useRef(React.Component);
  const driverMarker = useRef(React.Component);
  //Global states
  const { usuario, setUser } = useUsuario();
  const { trip, setTrip } = useTrip();
  const { viaje, setViaje } = useViaje();
  //State
  const [driverLocation, setDriverLocation] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [driverState, setDriverState] = useState(null);
  const [services, setServices] = useState([]);

  //Lifecycle methods
  useEffect(() => {
    if(trip !== null){
      console.log('Hay un TRIP guardado')
    }
    if(viaje !== viajeDefaultState) {
      console.log('Hay un VIAJE guardado')
      console.log(viaje);
    }
    get_address({ variables: { 
      lat: ReduxLocationStore.getState().latitude, 
      lng: ReduxLocationStore.getState().longitude } 
    })
    handleAndroidBackButton(() => backAction(setUser))
  }, [])

  function CutAddress(address) {
    if(address !== null) {
      return address.split(',')[0]
    } else {
      return 'Dirección'
    }
  }

  function SaveTrip(trip) {
    setTrip(trip)
    SetTripStorage(trip)
  }

  function SaveViaje(viajeprop) {
    setViaje({
      polyline: decodePolyline(viajeprop.tripPolyline),
      ...viaje
    })
    SetViajeStorage(viaje)
  }

  function DeleteTrip() {
    setTrip(null)
    DeleteTripStorage()
  }

  function DeleteViaje() {
    setViaje(viaje)
    DeleteViajeStorage()
  }

  //Server requests
  useQuery(QUERY_DRIVERS, {
    fetchPolicy: 'no-cache',
    onCompleted: ({ GetCities }) => {
      setDrivers(GetCities)
    },
    onError: (error) => {
      console.log(error);
    }
  })

  useQuery(QUERY_SERVICES, {
    fetchPolicy: 'no-cache',
    onCompleted: ({ GetServices }) => {
      setServices(GetServices)
    },
    onError: (error) => {
      console.log(error);
    }
  })

  const [get_cost] = useMutation(GET_COST, {
    onCompleted: ({GetCost}) => {
      console.log(GetCost)
    },
    onError: (err) => {
      console.log(err);
    }
  })

  const [get_route_info] = useMutation(DRAW_ROUTE, {
    fetchPolicy: "no-cache",
    onCompleted: async ({ GetRouteInfo }) => {
      // console.log(GetRouteInfo)
      // setRoute(GetRouteInfo)
      setViaje({
        ...viaje, 
        tripPolyline: decodePolyline(GetRouteInfo.polyline),
        route: GetRouteInfo
      })
      animateCameraToPolylineCenter(decodePolyline(GetRouteInfo.polyline))
    },
    onError: (error) => {
      console.log(error);
    }
  })

  const [get_address] = useMutation(CURRENT_ADDRESS, {
    fetchPolicy: "no-cache",
    onCompleted: ({ GetAddress }) => {
      // console.log(GetAddress)
      // console.log(ReduxLocationStore.getState())
      // const shortAddress = GetAddress.name.split(',')
      // viaje.origin.name = shortAddress[0]
      setViaje({...viaje, origin: {...viaje.origin, name: CutAddress(GetAddress.name)}})
      // setOrigin({ name: shortAddress[0] })
    },
    onError: (error) => {
      console.log(error);
    }
  })

  const [create_trip] = useMutation(CREATE_TRIP, {
    fetchPolicy: "no-cache",
    onCompleted: ({CreateTrip}) => {
      // console.log(data.CreateTrip.destinationLocationLat)
      // console.log(data.CreateTrip.destinationLocationLng)
      console.log(CreateTrip.id)
      SaveTrip(CreateTrip)
      SaveViaje(CreateTrip)
      animateCameraToPolylineCenter(decodePolyline(CreateTrip.tripPolyline))
    },
    onError: (error) => {
      console.log(error);
    }
  })
  
  async function drawRoute() {
    if (viaje.origin == null || viaje.destination == null) {
      Alert.alert("No se ha asigno destino")
    } else {
      if(viaje.origin.placeId == null) {
        return await get_route_info({
          variables: {
            "object": {
              "start": ReduxLocationStore.getState(),
              "end": viaje.destination.placeId
            }
          }
        });
      } else {
        console.log('Hay origin placeId en DrawRoute')
        return await get_route_info({
          variables: {
            "object": {
              "start": viaje.origin.placeId,
              "end": viaje.destination.placeId
            }
          }
        });
      }
    }
  }

  async function createTrip() {
    if(viaje.origin.placeId !== null) {
      console.log('Origin tiene placeid');
      create_trip({
        variables: {
          passengerId: usuario.id,
          "origin": viaje.origin.placeId,
          "destination": viaje.destination.placeId,
          paymentMethod: viaje.paymentMethod.id,
          note: "From emulator"
        }
      });
    } else if(viaje.origin.placeId == null){
      console.log('Origin tiene coordenadas');
      create_trip({
        variables: {
          passengerId: usuario.id,
          "origin": ReduxLocationStore.getState(),
          "destination": viaje.destination.placeId,
          paymentMethod: viaje.paymentMethod.id,
          note: "From emulator"
        }
      });
    }
  }

  async function animateCameraToPolylineCenter(polyline) {
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
    }, { duration: 1000 })
  }

  const EvaluateStartSuscription = () => {
    if (trip !== null) {
      return <TripUpdated
        // setDriverPolyline ={setDriverPolyline}
        trip={trip} setTrip={setTrip}
        driverState={driverState} setDriverState={setDriverState}
      />
    } else {
      return null
    }
  }

  const EvaluateCityDriver = () => {
    if (driverState !== null) {
      // console.log(driverState)
      return (
        <DriverLocationUpdated
          setter={setDriverLocation}
          driverId={driverState.id}
          driverMarker={driverMarker}
          duration={4000} />
      )
    } else {
      return null
    }
  }

  function EvaluateTripPolyline() {
    if(viaje.tripPolyline !== null){
      return (
        <Polyline 
        coordinates={viaje.tripPolyline} 
        strokeWidth={6} 
        strokeColor={"#16A1DC"} 
        strokeColors={['#7F0000', '#00000000', '#B24112', '#E5845C', '#238C23', '#7F0000']} 
        />
      )
    } else {
      return null
    }
  }

  function EvaluateDriverPolyline() {
    if(viaje.driverPolyline !== null){
      return (
        <Polyline 
        coordinates={viaje.driverPolyline} 
        strokeWidth={6} 
        strokeColor={"#16A1DC"} 
        strokeColors={['#7F0000', '#00000000', '#B24112', '#E5845C', '#238C23', '#7F0000']} 
        />
      )
    } else {
      return null
    }
  }

  return (
    <>
      <MapView
        // customMapStyle = {darkStyle}
        ref={globalMapView}
        showsUserLocation={true}
        showsMyLocationButton={false}
        style={{ flex: 1, width: '100%', height: '100%', zIndex: -1 }}
        initialCamera={initialCameraConfig}>
        {/* //Driver marker */}
        {driverLocation !== null ? 
        <Marker 
        ref={driverMarker} 
        key={115} 
        coordinate={driverLocation} 
        icon={require('../../assets/images/map-taxi.png')} />
        : null}
        {/* //Trip polyline */}
        <EvaluateTripPolyline/>
        <EvaluateDriverPolyline/>
      </MapView>

      <EvaluateStartSuscription />

      <View style={styles.cardContainer}>
        <CardPassenger props={{ 
          drawRoute: drawRoute, 
          createTrip: createTrip,
          DeleteTrip: DeleteTrip,
          DeleteViaje: DeleteViaje,
          get_cost: get_cost,
          get_address: get_address,
          navigation }} />
        {/* <EvaluateStartChat /> */}
      </View>

      <Fab navigation={navigation} />

      <View style={styles.inputsContainer}>
        <TextInput
          placeholder="Origen"
          placeholderTextColor="gray"
          value={viaje.origin.name}
          style={styles.input}
          onPressIn={() => { navigation.navigate("FindAddress", {type: 'origin'}) }} />
        <TextInput
          placeholder="Destino"
          placeholderTextColor="gray"
          value={CutAddress(viaje.destination.name)}
          style={styles.input}
          onPressIn={() => { navigation.navigate("FindAddress", {type: 'destination'}) }} />
      </View>

      <EvaluateCityDriver />
    </>
  )
}

const styles = StyleSheet.create({
  serviceContainer: {
    flex: 1 / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fab: {
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#16A0DB"
  },
  fabContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height: "10%",
    width: "20%"
  },
  inputsContainer: {
    height: 120,
    position: "absolute",
    // backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    // borderWidth:2,
    // borderColor: "red",
    width: "100%",
    marginTop: 80
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "gray",
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
    borderWidth: 2,
    borderColor: "gray",
    margin: 10
  },
  avatar: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  texto: {
    fontSize: 15,
    color: 'black'
  },
  textCard: {
    fontSize: 17,
    color: 'black',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 35
  },
  tripPanel: {
    flex: 1 / 2, 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'row'
  },
})
