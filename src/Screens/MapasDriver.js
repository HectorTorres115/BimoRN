import React, { useState, useRef, useEffect } from 'react'
import { Button, StyleSheet, View, Switch, Text } from 'react-native'
import gql from 'graphql-tag'
import MapView, { Marker, Polygon } from 'react-native-maps'
import { useUsuario } from '../Context/UserContext'
import { useViaje } from '../Context/ViajeContext'
import { useMutation, useQuery } from 'react-apollo'
import decodePolyline from '../Functions/DecodePolyline'
import { backAction, handleAndroidBackButton } from '../Functions/BackHandler'
import { TripCreated } from '../Listeners/TripCreated'
import ReduxLocationStore from '../Redux/Redux-location-store'
import { useTrip } from '../Context/TripContext'
// import { SetTrip as SetTripStorage } from '../Functions/TripStorage'
import { Fab } from '../Components/Fab'
import AnimatedPolyline from 'react-native-maps-animated-polyline'
import { AnimatedMarkerDef } from '../Components/AnimatedMarkerDef'

import { CardDriver } from '../Components/CardDriver'

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
mutation update_trip($id: Int!, $driverId: Int, $tripStatus: Int!) {
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
    fee
    feeTaxed
    rawfee
    distance
    chatId
  }
}

`
const UPDATE_DRIVER_LOCATION = gql`
mutation update_driver_location($citiId: Int!, $lat: Float!,$lng: Float!, $heading: Float!){
    UpdateCity(input:{
             id:$citiId
             lat:$lat
             lng:$lng
             heading: $heading
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

export const MapasDriver = ({ navigation }) => {
  //Lifecycle methods
  useEffect(() => {
    handleAndroidBackButton(() => backAction(setUser))
    if (trip !== null) {
      // setPolyline(decodePolyline(trip.tripPolyline))
      SetSmartPolyline(trip);
      animateCameraToPolylineCenter(decodePolyline(trip.tripPolyline))
    }
    const interval = setInterval(() => {
      // animateDriverMarker() 
      update_driver_location({
        variables: {
          citiId: usuario.city.id,
          lat: ReduxLocationStore.getState().latitude,
          lng: ReduxLocationStore.getState().longitude,
          heading: ReduxLocationStore.getState().heading,
        }
      })
    }, 4000);
    return () => clearInterval(interval);
  }, [])

  //Referencias
  const globalMapView = useRef(React.Component);
  //Global states from react context
  const { usuario, setUser } = useUsuario();
  const { trip, setTrip } = useTrip();
  const { viaje } = useViaje();
  //State
  const [isonline, setIsOnline] = useState(usuario.isOnline);
  const [region] = useState({ longitude: -107.3657382, latitude: 24.7958256, latitudeDelta: 0.08, longitudeDelta: 0.08 });
  const [drivers, setDrivers] = useState([]);
  const [driverLocation, setDriverLocation] = useState(ReduxLocationStore.getState());
  const [polyline, setPolyline] = useState([]);
  const [hexagons, setHexagons] = useState([]);
  const [hexagonsdestination, setHexagonsDestination] = useState([]);
  // const [trip, setTrip] = useState({});
  const [indexdriver, setIndexDriver] = useState(usuario.city.indexH3);
  const [indexorigin, setIndexOrigin] = useState(null);
  const [indexdestination, setIndexDestination] = useState(null);
  const [city, setCity] = useState(null);
  //Marcadores
  const [originCoordinates, setOriginCoordinates] = useState(null);
  const [destinantionCoordinates, setDestinationCoordinates] = useState(null);

  //Server requests
  useQuery(QUERY_DRIVERS, {
    fetchPolicy: 'no-cache',
    onCompleted: ({ GetCities }) => {
      let arrayDrivers = GetCities.filter(city => city.id !== usuario.city.id)
      setDrivers(arrayDrivers)
    },
    onError: (error) => {
      console.log(error);
    }
  })

  const [update_driver_status] = useMutation(UPDATE_STATUS, {
    fetchPolicy: "no-cache",
    onCompleted: ({ UpdateDriver }) => {
      // console.log(UpdateDriver)
      setIsOnline(UpdateDriver.isOnline)
    },
    onError: (error) => {
      console.log(error);
    }
  })

  const [update_driver_location] = useMutation(UPDATE_DRIVER_LOCATION, {
    fetchPolicy: "no-cache",
    onCompleted: ({ UpdateCity }) => {
      setCity(UpdateCity)
      setIndexDriver(UpdateCity.indexH3)
      setDriverLocation(ReduxLocationStore.getState())
      if (indexdriver !== indexorigin && indexorigin !== null) {
        // console.log('indices son diferentes')
        // console.log(indexdriver)
        // console.log(indexorigin)
        // console.log(trip)
        if (trip.tripStatus.tripStatus == 'deal') {//En camino
          // update_trip({variables:{id: trip.id,driverId: usuario.id,tripStatus: 1}})
        }
      } else if (indexdriver == indexorigin) {
        // console.log('indices son iguales')
        // console.log(indexdriver)
        // console.log(indexorigin)
        if (trip.tripStatus.tripStatus == 'En Camino') { //Esperando
          update_trip({ variables: { id: trip.id, driverId: usuario.id, tripStatus: 4, heading: ReduxLocationStore.getState().heading } })
        }
        if (trip.tripStatus.tripStatus == 'Esperando') { //Iniciado
          update_trip({ variables: { id: trip.id, driverId: usuario.id, tripStatus: 6, heading: ReduxLocationStore.getState().heading } })
        }
      }
      if (indexdriver == indexdestination) {
        // console.log('llego al destino')
        // console.log(indexdriver)
        // console.log(indexdestination)
        if (trip.tripStatus.tripStatus == 'Iniciado') {
          update_trip({ variables: { id: trip.id, driverId: usuario.id, tripStatus: 2, heading: ReduxLocationStore.getState().heading } })
        }
      }
    }
  })


  // const [accept_trip] = useMutation(ACCEPT_TRIP, {
  //   fetchPolicy: "no-cache",
  //   onCompleted: async ({ UpdateTrip }) => {
  //     setTrip(UpdateTrip)

  //     setPolyline(decodePolyline(UpdateTrip.tripPolyline))
  //     setDriverPolyline(decodePolyline(UpdateTrip.driverPolyline))

  //     // setViaje({
  //     //   tripPolyline: decodePolyline(UpdateTrip.tripPolyline),
  //     //   driverPolyline: decodePolyline(UpdateTrip.driverPolyline)
  //     // })

  //     setOriginCoordinates({ latitude: UpdateTrip.originLocationLat, longitude: UpdateTrip.originLocationLng })
  //     setDestinationCoordinates({ latitude: UpdateTrip.destinationLocationLat, longitude: UpdateTrip.destinationLocationLng })

  //     animateCameraToPolylineCenter(decodePolyline(UpdateTrip.tripPolyline))

  //     get_hexagons({ variables: { lat: UpdateTrip.originLocationLat, lng: UpdateTrip.originLocationLng, res: 10, jumps: 0 } }).then(({ data }) => {
  //       setIndexOrigin(data.GetHexagons[0].index)
  //       setHexagons(data.GetHexagons)
  //       // setViaje({
  //       //   indexorigin: data.GetHexagons[0].index
  //       // })

  //     })

  //     get_hexagons({ variables: { lat: UpdateTrip.destinationLocationLat, lng: UpdateTrip.destinationLocationLng, res: 10, jumps: 0 } }).then(({ data }) => {
  //       setIndexDestination(data.GetHexagons[0].index)
  //       setHexagonsDestination(data.GetHexagons)
  //       // setViaje({
  //       //   indexdestination: data.GetHexagons[0].index
  //       // })
  //     })
  //     SetTripStorage(UpdateTrip)
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //   }
  // })

  const [update_trip] = useMutation(ACCEPT_TRIP, {
    fetchPolicy: "no-cache",
    // variables: {
    //   // tripId: trip.id,
    //   driverId: usuario.id
    // },
    onCompleted: ({ UpdateTrip }) => {
      setTrip(UpdateTrip)
      // console.log('TripStatus changed (this gotta be printed just once)');
    },
    onError: (error) => {
      console.log(error);
    }
  })

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

  function SetSmartPolyline(trip) {
    if(decodePolyline(trip.tripPolyline).length <= 1){
      Alert.alert("Ya estas en la localizacion del pasajero.");
    } else {
      setPolyline(decodePolyline(trip.tripPolyline));
    }
  }

  function EvaluateMarkers() {
    if (originCoordinates !== null && destinantionCoordinates !== null) {
      return (
        <>
          <Marker
            color='blue'
            key={Math.floor(1000 + Math.random() * 9000)}
            coordinate={originCoordinates} />
          <Marker
            color='blue'
            key={Math.floor(1000 + Math.random() * 9000)}
            coordinate={destinantionCoordinates} />
        </>
      )
    } else { return null }
  }

  return (
    <>

      <MapView
        ref={globalMapView}
        showsUserLocation={false}
        showsMyLocationButton={false}
        style={{ flex: 1, width: '100%', height: '100%', zIndex: -1 }}
        initialRegion={region}>

        {drivers.map(coord => {
          return <Marker key={coord.lat} coordinate={{ latitude: coord.lat, longitude: coord.lng }} pinColor={coord.color} />
        })}

        {hexagons.map(hexagon => {
          return <Polygon fillColor={'rgba(22, 161, 220, 0.5)'} key={hexagon.index} coordinates={hexagon.boundaries} strokeWidth={6} strokeColor={"#16A1DC"} />
        })}
        {hexagonsdestination.map(hexagon => {
          return <Polygon fillColor={'rgba(22, 161, 220, 0.5)'} key={hexagon.index} coordinates={hexagon.boundaries} strokeWidth={6} strokeColor={"#16A1DC"} />
        })}
        {/* Marcador del driver */}
        {/* <Marker key={Math.floor(1000 + Math.random() * 9000)}
        ref={driverMarker}
        coordinate={driverLocation}
        icon={require('../../assets/images/map-taxi.png')} /> */}

        { viaje.polyline !== null ? <AnimatedPolyline 
        interval = {100}
        coordinates={viaje.polyline} 
        strokeWidth={6} 
        strokeColor={"#16A1DC"} 
        strokeColors={['#7F0000', '#00000000', '#B24112', '#E5845C', '#238C23', '#7F0000']} 
        />: null}

        { viaje.driverPolyline !== null ? <AnimatedPolyline 
        interval = {100}
        coordinates={viaje.driverPolyline} 
        strokeWidth={6} 
        strokeColor={"green"} 
        strokeColors={['#7F0000', '#00000000', '#B24112', '#E5845C', '#238C23', '#7F0000']} 
        />: null}

      {city !== null ? 
      <AnimatedMarkerDef data = {{
        lat: ReduxLocationStore.getState().latitude,
        lng: ReduxLocationStore.getState().longitude,
        heading: ReduxLocationStore.getState().heading,
      }}/> 
      : null}

      </MapView>
        
      <TripCreated setTrip={setTrip}/>

      
      <CardDriver navigation={navigation}/>
      
      <Fab navigation={navigation} />

      <View style={styles.switchContainer}>
        <Text style={styles.text}>En linea</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isonline ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={(status) => {
            setIsOnline(status)
            update_driver_status({ variables: { id: usuario.id, status } })
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
  fabContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height: "10%",
    width: "20%"
  },
  cardContainer: {
    marginBottom: 10,
    alignSelf: 'center',
    alignContent: 'center',
    position: "relative",
    height: "25%",
    width: "98%"
  },
  switchContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    position: "absolute",
    height: "5%",
    width: "100%"
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
    width: '90%',
    borderRadius: 25,
    margin: 5,
    height: "50%",
  },
  text: {
    margin: 5
  },
  textTrip: {
    fontSize: 20,
    color: 'green'
  }

})
