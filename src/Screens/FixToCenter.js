import React, {useState, useEffect, useRef} from 'react'
import { StyleSheet, View, Image, Alert, TextInput} from 'react-native'
import MapView, {Marker} from 'react-native-maps' 
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import { handleAndroidBackButton, backAction } from '../Functions/BackHandler'
import { useUsuario } from '../Context/UserContext'
import Icon from 'react-native-vector-icons/FontAwesome5';
const myIcon1 = <Icon name="comments" size={30} color="#900" />; // Defaults to regular
//Backhandler

const CURRENT_ADDRESS = gql`
mutation get_address($lat: Float!, $lng: Float!){
  GetAddress(lat: $lat, lng: $lng)
}
`

export const FixToCenter = (props) => {

    useEffect(() => {
        handleAndroidBackButton(() => props.navigation.goBack())
      }, []) 
      
    const mapView = useRef(React.Component)
    const {setUser} = useUsuario()
    const [marker, setMarker] = useState({longitude: -107.45220333333332, latitude: 24.82172166666667})
    const [region, setRegion] = useState({longitude: -107.45220333333332, latitude: 24.82172166666667, latitudeDelta: 0.009, longitudeDelta: 0.009});
    const [address, setAddress] = useState({name:"address"})

    const [get_current_info] = useMutation(CURRENT_ADDRESS, {
        fetchPolicy: "no-cache",
        variables:{
            "object":{  
              "start": region, 
              "end": marker
            }
          },
        onCompleted:({GetRouteInfo})=>{
            const shortAddress = GetRouteInfo.startAdress.split(',')
            setAddress({name: shortAddress[0]})
            console.log(address)
            Alert.alert(shortAddress[0])
        },
        onError: (error)=>{
          console.log(error);
        }
    })
    const [debugMarkers, setDebugMarkers] = useState([]);

    async function setAddresLocation(region) {
        setRegion(region)
        await get_current_info()
    } 

    return (
        <>
        <View style={styles.masterContainer} accessible={false}>
            <MapView
                ref={mapView}
                style={styles.mapa}
                onRegionChangeComplete={(region) => {
                    console.log(region);
                    setDebugMarkers([...debugMarkers, region])
                    setAddresLocation(region)
                }}
                initialRegion={region}>   
                {debugMarkers.map(coord => {
                return <Marker 
                key = {coord.lat} 
                coordinate = {coord} />
                })} 
            </MapView>
            <View style = {{position: 'absolute', marginBottom: 200}}>
                <Icon name="map-marker" size={20} color = "#000000"/>
            </View>
            {/* <Image source={require('../../assets/images/pin1.jpeg')} style={styles.icon}></Image> */}
        </View>

        <View style={styles.inputsContainer}>
            <TextInput 
            placeholder="Direccion" 
            placeholderTextColor="gray" 
            value= {address}
            style={styles.input} 
            editable={false}
            // onPressIn= {()=> {navigation.navigate("FindAddress", {setter:setOrigin, setter_search: setSearch, search, drawRoute: drawRoute})}}
            />
        </View>  

        </>
    )
}

const styles = StyleSheet.create({
    mapa:{ 
        flex: 1, 
        width: '100%', 
        height: '100%', 
        zIndex: -1 
    },
    icon:{
        position:'absolute',
        height: 40,
        width: 40,
        marginTop:10,
        paddingBottom: 10
    },
    masterContainer:{
        flex:1,
        position:'absolute',
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems: 'center',
        // zIndex: 1,
        // borderColor:'black',
        // borderWidth:2
    },
    container:{
        flex: 1/3,
        width:'100%',
        justifyContent:'center',
        alignItems: 'center',
        // borderColor:'red',
        // borderWidth:2
    },
    buton:{
        // position: 'absolute',
        height:50,
        width:'100%',
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor:'blue',
        // marginTop: 30
    },
    text:{
        fontSize:20,
        color: 'black'
    },
    centerIcon:{
        height: 40,
        width: 40,
        // marginBottom:100
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
        marginTop:30
    },
    input:{
        backgroundColor:"rgba(255,255,255,1)",
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
      }
})
