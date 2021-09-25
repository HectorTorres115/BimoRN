import React , {useState, useEffect} from 'react'
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native'
import { Divider } from 'react-native-paper'
import { DateFetcher } from '../Components/DateFetcher'
import {Fab} from '../Components/Fab'
import { useUsuario } from '../Context/UserContext'
import gql from 'graphql-tag'
import {useLazyQuery} from 'react-apollo'
import { useTrip } from '../Context/TripContext'

const GET_TRIPS_BY_PASSENGERID = gql`
query get_trips_by_passengerid($id: Int!){
    GetTripsByPassengerId(id:$id){
      id
      driver {
        id
        name
        email
        photoUrl
      }
      passenger {
        id
        name
        email
        photoUrl
      }
      tripStatus {
        id
        tripStatus
      }
      promocode {
        id
        code
        discount
        title
      }
      paymentMethod {
        id
        paymentMethod
      }
      createdAt
      currency
      destinationLocationLat
      destinationLocationLng
      destinationVincity
      discount
      distance
      droppedOffAt
      fee
      feeTaxed
      originLocationLat
      originLocationLng
      originVincity
      pickedUpAt
      rating
      rawfee
      tax
      tripPolyline
  
    }
  }
`

const GET_TRIPS_BY_DRIVERID = gql`
query get_trips_by_driverid($id: Int!){
    GetTripsByDriverId(id:$id){
      id
      driver {
        id
        name
        email
        photoUrl
      }
      passenger {
        id
        name
        email
        photoUrl
      }
      tripStatus {
        id
        tripStatus
      }
      promocode {
        id
        code
        discount
        title
      }
      paymentMethod {
        id
        paymentMethod
      }
      createdAt
      currency
      destinationLocationLat
      destinationLocationLng
      destinationVincity
      discount
      distance
      droppedOffAt
      fee
      feeTaxed
      originLocationLat
      originLocationLng
      originVincity
      pickedUpAt
      rating
      rawfee
      tax
      tripPolyline
    }
  }
`



 
export const Viajes = (props) => {

    const {usuario, setUser} = useUsuario();
    const {trip, setTrip} = useTrip();

    useEffect(() => {

        console.log(usuario)

        if(usuario.__typename == 'Driver'){
            gettripsdriver()
        }else if(usuario.__typename == 'Passenger'){
            gettripspassenger()
        }else{
            console.log('error')
        }

    }, [])

    const [completedtrips, setCompletedTrips] = useState([]);
    
    // const [date, setDate] = useState(currentDate());

    //Get date messages query
    const [gettripspassenger] = useLazyQuery(GET_TRIPS_BY_PASSENGERID, {
        fetchPolicy: "no-cache",
        variables:{
            id: usuario.id
        },
        onCompleted: ({GetTripsByPassengerId}) => {
            // console.log(GetTripsByPassengerId);
            const tripscompleted = GetTripsByPassengerId.filter((trip)=>trip.tripStatus.id == 2)
            console.log(tripscompleted);
            setCompletedTrips(tripscompleted)
            // props.setter_messages(data.GetDateMessages)
        },
        onError: (err) => {
            console.log(err);
        }
    })

    const [gettripsdriver] = useLazyQuery(GET_TRIPS_BY_DRIVERID, {
        fetchPolicy: "no-cache",
        variables:{
            id: usuario.id
        },
        onCompleted: ({GetTripsByDriverId}) => {
            // console.log(GetTripsByDriverId);
            const tripscompleted = GetTripsByDriverId.filter((trip)=>trip.tripStatus.id == 2)
            console.log(tripscompleted);
            setCompletedTrips(tripscompleted)
            // props.setter_messages(data.GetDateMessages)
        },
        onError: (err) => {
            console.log(err);
        }
    })

    function sendTrip(trip) {
        // console.log(trip)
        setTrip(trip)
        props.navigation.navigate('ResumenViaje')  
    }

    return (
        <>
        <View>
            <DateFetcher/>

            <FlatList 
            data={completedtrips} 
            key = {(item)=> item.id}
            keyExtractor = {(item)=> item.id}
            renderItem = { ({item}) => (
              <>
              <View style = {styles.placeContainer}>
                <Pressable onPress={ ()=> sendTrip(item)}> 
                  <Text style={styles.texto}> {item.originVincity}</Text>
                  <Text style={styles.texto}> {item.destinationVincity}</Text>
                </Pressable>
              </View>
              <Divider/>
              </>
            ) }
            >
            </FlatList>
        </View>
            <Fab navigation = {props.navigation}/>
        </>
    )
}

const styles = StyleSheet.create({
    placeContainer: {
        width: '95%',
        margin: 10
      },
      texto:{
        fontSize: 20,
        color: "black"
    },
})
