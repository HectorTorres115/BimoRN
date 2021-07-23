import React,{ useState, useEffect} from 'react'
import { StyleSheet, Text, View, FlatList, TextInput, Button, Pressable } from 'react-native'
import gql from 'graphql-tag'
import {useMutation} from 'react-apollo'
// import Geolocation from '@react-native-community/geolocation'
import Geolocation from 'react-native-geolocation-service'
import { useAddress } from '../Context/AddressContext'

const GET_AROUND_PLACES = gql`
mutation getAround_places($place: String!,$lat: Float!, $lng: Float!){
    GetAroundPlaces(
      input: {
      radius:60000,
      place:$place,
      lat:$lat,
      lng:$lng
      }
    ) {
      placeId,
      name,
      direction
    }
  }
`
  

export function FindAddress(props) {

    useEffect(()=>{
      console.log("Componente montado")
      return ()=>{
        console.log("Componente desmontado")
        // setSearch("")
      }
    },[]) 
    const {address,setAddress} = useAddress()
    const [addresses,setAddresses] = useState([]);
    const [search,setSearch] = useState(null);
    const [coords,setCoords] = useState({});

    Geolocation.watchPosition((info) => {
        // console.log(info.coords);
        setCoords(info.coords);
        }, (error) => console.log(error),
        {enableHighAccuracy: true, distanceFilter: 0, useSignificantChanges: false, maximumAge: 0})
    
    const [getAround_places] = useMutation(GET_AROUND_PLACES,{
        fetchPolicy: "no-cache",
        onCompleted:({GetAroundPlaces})=>{
          // console.log(GetAroundPlaces);
          const places = GetAroundPlaces.filter((place)=> place !== null)
          setAddresses(places)
        },
        onError:(error)=>{
          console.log(error);
        }
    })

    const sendPlace = (item)=>{
      props.route.params.setter(item)
      
      setAddresses([])
     
      setSearch(null)
     
      props.navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputcontainer}>
                <TextInput 
                placeholder="   Search" 
                placeholderTextColor="gray" 
                style={styles.input}
                onChangeText= {(texto)=> getAround_places({variables:{place:texto,lat:coords.latitude,lng:coords.longitude}}) }
                value= {search}
                // onKeyPress = {(e)=> e.nativeEvent.key("Enter") } 
                /> 
            </View>
            
            <FlatList 
            data={addresses} 
            key = {(item)=> item.placeId}
            keyExtractor = {(item)=> item.placeId}
            renderItem = { ({item})=> (
                <>
                <Pressable onPress={ ()=> sendPlace(item)}> 
                  <Text style={styles.texto}>{item.name}</Text>
                  <Text style={styles.texto}>{item.direction}</Text>
                </Pressable>
                </>
            ) }
            >

            </FlatList>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:"100%",
        justifyContent: "center",
        alignItems: "center",

    },
    inputcontainer:{
        height:100,
        width:"100%",
        justifyContent: "center",
        alignItems:"center",
        backgroundColor: "black"
    },
    texto:{
        fontSize:20,
        color: "black"
    },
    input:{
     backgroundColor:"rgba(255,255,255,1)",
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
