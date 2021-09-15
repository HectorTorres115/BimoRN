import React,{ useState, useEffect} from 'react'
import { StyleSheet, Text, View, FlatList, TextInput, Pressable, Touchable } from 'react-native'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import ReduxLocationStore from '../Redux/Redux-location-store';
import { Divider } from 'react-native-paper'
import { backAction, handleAndroidBackButton } from '../Functions/BackHandler'
import { useUsuario } from '../Context/UserContext';

const GET_AROUND_PLACES = gql`
mutation getAround_places($place: String!,$lat: Float!, $lng: Float!){
    GetAroundPlaces(
      input: {
      radius: 60000,
      place: $place,
      lat: $lat,
      lng: $lng
      }
    ) {
      placeId,
      name,
      direction
    }
  }
`
  

export function FindAddress(props) {
    useEffect(() => {
      handleAndroidBackButton(() => props.navigation.goBack())
      return () => {
          handleAndroidBackButton(() => backAction(setUser))
      }
    }, []) 
    
    const [addresses, setAddresses] = useState([]);
    const [search, setSearch] = useState(null);
    const {setUser} = useUsuario(null);
    
    const [getAround_places] = useMutation(GET_AROUND_PLACES,{
        fetchPolicy: "no-cache",
        onCompleted:({GetAroundPlaces})=>{
          console.log(place)
          const places = GetAroundPlaces.filter((place)=> place !== null)
          setAddresses(places)
        },
        onError:(error) => {
          console.log(error);
        }
    })

    const sendPlace = (item)=>{
      console.log(item)
      props.route.params.setter(item)
      
      setAddresses([])
     
      setSearch(null)

      // if(props.route.params.drawRoute){
      //   console.log('destination')
      //   props.route.params.drawRoute()
      // }      
      // else{
      //   console.log(props)
      // }
     
      props.navigation.goBack();
    }

    return (
        <View>
            <View style={styles.inputcontainer}>
                <TextInput 
                placeholder="Search" 
                placeholderTextColor="gray" 
                style={styles.input}
                onChangeText= {(texto)=> getAround_places({
                  variables:{
                    place: texto,lat:ReduxLocationStore.getState().latitude,
                    lng: ReduxLocationStore.getState().longitude
                  }
                })}
                value= {search}
                /> 
            </View>
            
            <FlatList 
            data={addresses} 
            key = {(item)=> item.placeId}
            keyExtractor = {(item)=> item.placeId}
            renderItem = { ({item}) => (
              <>
              <View style = {styles.placeContainer}>
                <Pressable onPress={ ()=> sendPlace(item)}> 
                  <Text style={styles.texto}>{item.name}</Text>
                  <Text style={styles.texto}>{item.direction}</Text>
                </Pressable>
              </View>
              <Divider/>
              </>
            ) }
            >
            </FlatList>

            <Pressable style = {styles.fixLocationContainer} onPressIn = {() => props.navigation.navigate('FixToCenter')}>
              <Text style = {styles.texto}>Fijar ubicacion en el mapa</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:"100%",
        justifyContent: "center",
        alignItems: "center"
    },
    placeContainer: {
      width: '95%',
      margin: 10
    },
    inputcontainer:{
        height:100,
        width:"100%",
        justifyContent: "center",
        alignItems:"center",
        backgroundColor: "black"
    },
    texto:{
        fontSize: 20,
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
        paddingLeft: 20
      },
    fixLocationContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    }
})
