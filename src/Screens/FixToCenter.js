import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import { handleAndroidBackButton } from '../Functions/BackHandler'
import Icon from 'react-native-vector-icons/FontAwesome';
import ReduxLocationStore from '../Redux/Redux-location-store'
import { useViaje } from '../Context/ViajeContext'
import { FAB } from 'react-native-paper';
//Backhandler

const CURRENT_ADDRESS = gql`
mutation get_address($lat: Float!, $lng: Float!){
  GetAddress(lat: $lat, lng: $lng){
      name,
      direction,
      placeId
  }
}
`

export const FixToCenter = (props) => {

    const initialCameraConfig = {
        center: {
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

    useEffect(() => {
        handleAndroidBackButton(() => props.navigation.goBack())
        console.log(props.route.params.type)
    }, [])

    const mapView = useRef(React.Component)
    const { viaje, setViaje } = useViaje();
    const [marker, setMarker] = useState(ReduxLocationStore.getState())
    const [address, setAddress] = useState(null)
    const [addressName, setAddressName] = useState("Dirección")

    const [get_current_info] = useMutation(CURRENT_ADDRESS, {
        fetchPolicy: "no-cache",
        variables: {
            lat: marker.latitude,
            lng: marker.longitude
        },
        onCompleted: ({ GetAddress }) => {
            const shortAddress = GetAddress.name.split(',')[0]
            setAddress(GetAddress)
            setAddressName(shortAddress)
        },
        onError: (error) => {
            console.log(error);
        }
    })

    function SelectAddress() {
        if(props.route.params.type == 'origin') {
            setViaje({...viaje, origin: address})
        } else if(props.route.params.type == 'destination'){
            setViaje({...viaje, destination: address})
        }
        props.navigation.navigate("Mapas")
    }

    return (
        <>
            <View style={styles.masterContainer} accessible={false}>
                <MapView
                    ref={mapView}
                    style={styles.mapa}
                    onRegionChangeComplete={(region) => {
                        setMarker(region)
                        get_current_info()
                    }}
                    initialCamera={initialCameraConfig}>
                    <Marker coordinate={marker} />
                </MapView>
                <View style={{ position: 'absolute', marginBottom: 200 }}>
                    <Icon name="map-marker" size={40} color="#000000" />
                </View>

                <FAB
                    style={styles.fab}
                    // small
                    icon="map-marker-check"
                    onPress={() => SelectAddress()}
                />
            </View>

            <View style={styles.inputsContainer}>
                <TextInput
                    placeholder="Direccion"
                    placeholderTextColor="gray"
                    value={addressName}
                    style={styles.input}
                    editable={false}
                />
            </View>

        </>
    )
}

const styles = StyleSheet.create({
    mapa: {
        flex: 1,
        width: '100%',
        height: '100%',
        zIndex: -1
    },
    icon: {
        position: 'absolute',
        height: 40,
        width: 40,
        marginTop: 10,
        paddingBottom: 10
    },
    masterContainer: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // zIndex: 1,
        // borderColor:'black',
        // borderWidth:2
    },
    container: {
        flex: 1 / 3,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // borderColor:'red',
        // borderWidth:2
    },
    buton: {
        // position: 'absolute',
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        // marginTop: 30
    },
    text: {
        fontSize: 20,
        color: 'black'
    },
    centerIcon: {
        height: 40,
        width: 40,
        // marginBottom:100
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
        marginTop: 30
    },
    input: {
        backgroundColor: "rgba(255,255,255,1)",
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#16A0DB"
    },
})
