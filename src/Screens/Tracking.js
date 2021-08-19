import React, {useState, useRef, useEffect } from 'react'
import { Button, StyleSheet, View, Alert, Switch, Text } from 'react-native'
import gql from 'graphql-tag'
import MapView, {Marker, Polyline} from 'react-native-maps'
import { useUsuario } from '../Context/UserContext'
import { useMutation, useQuery } from 'react-apollo'
import { backAction, handleAndroidBackButton } from '../Functions/BackHandler'
import ReduxLocationStore from '../Redux/Redux-location-store';
import { TripCreated } from '../Listeners/TripCreated'


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

const ACCEPT_TRIP = gql`
mutation update_trip($id: Int!, $driverId: Int!, $tripStatus: Int!) {
  UpdateTrip(
    input: { id: $id, driverId: $driverId, tripStatusId: $tripStatus }
  ) {
    id
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

export const Tracking = (props) => {

    useEffect(() => {
        handleAndroidBackButton(() => backAction(setUser))
    }, [])

    const globalMapView = useRef(React.Component);
    const driverMaker = useRef(React.Component);
    const {usuario, setUser} = useUsuario();
    const [coords, setCoords] = useState(ReduxLocationStore.getState());
    const [location, setLocation] = useState([]);
    const [region] = useState({longitude: -107.45220333333332, latitude: 24.82172166666667, latitudeDelta: 0.08, longitudeDelta: 0.08});
    const [polyline,setPolyline] = useState([]);
    const [driverloc,setDriverLoc] = useState(region);
    const [index,setIndex] = useState(0);
    const [trip, setTrip] = useState({});
    const [listenerchat, setListenerChat] = useState(false);
    const [city, setCity] = useState(usuario.city);

    const [update_driver_location] = useMutation(UPDATE_DRIVER_LOCATION,{
        fetchPolicy: "no-cache",
        onCompleted:({UpdateCity})=>{

            // console.log(UpdateCity)
            setCity(UpdateCity)
        },
        onError:(error)=>{
          console.log(error);
        }
    })

    const [accept_trip] = useMutation(ACCEPT_TRIP,{
        fetchPolicy: "no-cache",
        onCompleted:({UpdateTrip}) => {
            console.log(UpdateTrip)
            setTrip(UpdateTrip)
            setListenerChat(true)
        },
        onError:(error) => {
          console.log(error);
        }
    })

    async function drawMarkers(object){
        if(location.length < 1){

            setLocation([...location, {color: "#00FF00", ...object}])
        } else {

            setLocation([...location, {color: "#0000FF", ...object}])
        }
    }

    async function updatePosition(object){
        console.log(object);
        update_driver_location({variables:{
            citiId: 48,
            lat:object.latitude,
            lng:object.longitude
          }
        });
    }

    function limpiar(){
        setPolyline([]) 
        setLocation([])
    }

    function guardarUbicacion(){
        if(index < location.length){

            setIndex(index+1)
            driverMaker.current.animateMarkerToCoordinate(location[index],2000)
            updatePosition(location[index]);
            
        } else {
            setDriverLoc(location[index])
            console.log("ha llegado a su destino")
        }
    }


    return (
        <>
        <MapView
            ref = {globalMapView}
            // onMapReady = { ()=> getCurrentDirection() }
            onPoiClick = {(e) => drawMarkers(e.nativeEvent.coordinate)}
            onPress = {(e) => drawMarkers(e.nativeEvent.coordinate)}
            showsUserLocation = {true}
            showsMyLocationButton = {false}
            style={{ flex: 1, width: '100%', height: '100%', zIndex: -1 }}
            initialRegion = {region}>
            <Polyline coordinates={polyline} strokeWidth={6} strokeColor ={"#16A1DC"} strokeColors={['#7F0000','#00000000', '#B24112','#E5845C','#238C23','#7F0000']} />
            {location.map((location)=>{
                return <Marker key = {Math.floor(1000 + Math.random() * 9000)}  coordinate={location} color="blue"></Marker>
            })}
            <Marker ref={driverMaker} key = {driverloc.latitude} coordinate = {{latitude:driverloc.latitude, longitude:driverloc.longitude}} icon={require('../../assets/images/map-taxi3.png')}/>
        </MapView>
        <TripCreated userId = {usuario.id} acceptTrip = {accept_trip} />
        <Button title = "DrawRoute" onPress = {() => setPolyline(location)}/> 
        <Button title = "Guardar Ubicacion" onPress = {() => guardarUbicacion()}/> 
        <Button title = "Limpiar" onPress = {() => limpiar()}/> 
        </>
    )
}

const styles = StyleSheet.create({})
