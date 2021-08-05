import React, {useState,useEffect,useRef} from 'react'
import { StyleSheet, Text, View , Button, Image, TouchableOpacity, Alert} from 'react-native'
import MapView , {Marker} from 'react-native-maps' 
import ReduxLocationStore from '../Redux/Redux-location-store';
import { set_location } from '../Redux/Redux-actions';
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import { FAB } from 'react-native-paper';

const CURRENT_ADDRESS = gql`
mutation get_current_info($object: JSON){
    GetRouteInfo(object: $object) {
      startAdress
    }
  }
`

export const FixToCenter = (props)=>  {

    const mapView = useRef(React.Component)
    const [marker, setMarker] = useState({longitude: -107.45220333333332, latitude: 24.82172166666667})
    const [region, setRegion] = useState({longitude: -107.45220333333332, latitude: 24.82172166666667, latitudeDelta: 0.009, longitudeDelta: 0.009});
    const [address,setAddress] = useState({name:"address"})

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

    async function setAddresLocation(region) {

        setRegion(region)
        await get_current_info()
        
    }


    
    return (
        <View style={styles.masterContainer} accessible={false}>
            <MapView
                ref={mapView}
                style={styles.mapa}
                onRegionChangeComplete={(region)=> setAddresLocation(region)}
                //  onPanDrag={()=> setRegion()}
                initialRegion={region}>
                
            </MapView>
            {/* <TouchableOpacity style={styles.buton} onPress={()=>  setAddresLocation()}>
                  <Text style={styles.text}>{address.name}</Text>
            </TouchableOpacity>    */}
            <Image source={require('../../assets/images/pin1.jpeg')} style={styles.icon}></Image>
        </View>
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
        marginBottom:100
    }
})
