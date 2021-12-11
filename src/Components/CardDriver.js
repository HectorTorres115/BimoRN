import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { TripCreated } from '../Listeners/TripCreated'
import { useTrip } from '../Context/TripContext'
import { SetTrip as setTripStorage, DeleteTrip } from '../Functions/TripStorage';
import { useUsuario } from '../Context/UserContext';
import { useViaje, viajeDefaultState } from '../Context/ViajeContext';
import { Avatar, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MotionSlider from 'react-native-motion-slider';
import decodePolyline from '../Functions/DecodePolyline';

import gql from 'graphql-tag'
import { useMutation, useLazyQuery } from 'react-apollo'

const GET_TRIP_BY_ID = gql`
query get_trip_by_id($id:Int!){
  GetTripById(id: $id){
    id,
    opt,
	passengerId,
    tripStatusId,
    tripStatus{tripStatus}
    commissionTypeId,
    paymentMethodId,
    serviceId,
    chatId,
    promocodeId,
    driverId,
    driver{photoUrl, name, plate}
    passenger{photoUrl, name}
    commission,
    commissionValue,
    createdAt,
    currency,
    destinationVincity,
    originVincity,
    discount,
    distance,
    pickedUpAt,
    droppedOffAt,
    fee,
    feeTaxed
    feedback,
    note,
    rating,
    rawfee,
    tax,
    tripPolyline,
    driverPolyline,
    destinationIndex,
    originIndex
  }
}
`

const UPDATE_TRIP = gql`
mutation update_trip($trip_payload: UpdateTrip!){
  UpdateTrip(input: $trip_payload) {
    id,
    opt,
	passengerId,
    tripStatusId,
    tripStatus{tripStatus}
    commissionTypeId,
    paymentMethodId,
    serviceId,
    chatId,
    promocodeId,
    driverId,
    driver{photoUrl, name, plate}
    passenger{photoUrl, name}
    commission,
    commissionValue,
    createdAt,
    currency,
    destinationVincity,
    originVincity,
    discount,
    distance,
    pickedUpAt,
    droppedOffAt,
    fee,
    feeTaxed
    feedback,
    note,
    rating,
    rawfee,
    tax,
    tripPolyline,
    driverPolyline,
    destinationIndex,
    originIndex
  }
}
`

const CONFIRM_OTP = gql`
mutation confirm_otp($tripId: Int!, $otp: Int!){
  ConfirmOtp(input: {
    tripId: $tripId,
    otp: $otp
  }){
    id,
    opt,
	passengerId,
    tripStatusId,
    tripStatus{tripStatus}
    commissionTypeId,
    paymentMethodId,
    serviceId,
    chatId,
    promocodeId,
    driverId,
    driver{photoUrl, name, plate}
    passenger{photoUrl, name}
    commission,
    commissionValue,
    createdAt,
    currency,
    destinationVincity,
    originVincity,
    discount,
    distance,
    pickedUpAt,
    droppedOffAt,
    fee,
    feeTaxed
    feedback,
    note,
    rating,
    rawfee,
    tax,
    tripPolyline,
    driverPolyline,
    destinationIndex,
    originIndex
  }
}
`

export function CardDriver(props) {
    useEffect(() => {
        console.log('Component did mount (Card Driver)');
        if (trip !== null) {
            get_trip_by_id({ variables: { id: trip.id } });
        }
    }, [])

    const { trip, setTrip } = useTrip();
    const { viaje, setViaje } = useViaje();
    const { usuario } = useUsuario();
    const [ otp, setOtp ] = useState(null);

    const [update_trip] = useMutation(UPDATE_TRIP, {
        onCompleted: ({ UpdateTrip }) => {
            SaveTrip(UpdateTrip);
            // console.log(UpdateTrip);
            SetPolylines(UpdateTrip);
        },
        onError: (err) => {
            console.log(err);
        }
    });

    const [confirm_otp] = useMutation(CONFIRM_OTP, {
        onCompleted: ({ ConfirmOtp }) => {
            SaveTrip(ConfirmOtp);
        },
        onError: (err) => {
            console.log(err);
        }
    });

    const [get_trip_by_id] = useLazyQuery(GET_TRIP_BY_ID, {
        onCompleted: ({ GetTripById }) => {
            console.log(GetTripById.tripStatus.tripStatus);
            setTrip(GetTripById);
            // if (GetTripById.tripStatus.tripStatus == "Cancelado" ) {
            //     Alert.alert('El viaje se ha cancelado')
            //     DeleteViaje()
            //     DeleteTrip()
            // } else if (GetTripById.tripStatus.tripStatus == "Terminado") {
            //     Alert.alert('El viaje ha finalizado')
            //     DeleteViaje()
            //     DeleteTrip()
            // }
        },
        onError: (err) => {
            console.log(err);
        }
    })

    function SetPolylines(param) {
        setViaje({
            ...viajeDefaultState,
            polyline: decodePolyline(param.tripPolyline),
            driverPolyline: decodePolyline(param.driverPolyline),
        })
    }

    function GoToChat(props) {
        // console.log(props);
        props.navigation.navigate('Chat');
    }

    function SaveTrip(trip) {
        setTripStorage(trip);
        setTrip(trip);
    }

    function DestroyTrip() {
        DeleteTrip();
        setTrip(null);
        setViaje(viajeDefaultState);
    }

    function IniciarViaje() {
        update_trip({
            variables: {
                "trip_payload": {
                    "id": trip.id,
                    "tripStatusId": 6,
                    "driverId": usuario.id
                }
            }
        })
    }

    function TerminarViaje() {
        update_trip({
            variables: {
                "trip_payload": {
                    "id": trip.id,
                    "tripStatusId": 2,
                    "driverId": usuario.id
                }
            }
        }).then(() => {
            props.navigation.navigate('ResumenViaje');
        })
    }

    function RejectTrip() {
        update_trip({
            variables: {
                "trip_payload": {
                    "id": trip.id,
                    "tripStatusId": 3,  //CANCELADO
                    "driverId": usuario.id
                }
            },
        }).then(() => DestroyTrip())
    }

    const DealButtons = () => {
        return (
            <>
                <View style={styles.cardContainer}>
                    {trip.passenger.photoUrl !== "" ?
                        <Avatar.Image source={{ uri: trip.driver.photoUrl }} /> :
                        <Avatar.Icon size={70} icon="account" />
                    }
                </View>
                <View style={styles.cardContainer}>
                    <View style={styles.button}>
                        <TouchableOpacity onPress={() => {
                            update_trip({
                                variables: {
                                    "trip_payload": {
                                        "id": trip.id,
                                        "tripStatusId": 1,
                                        "driverId": usuario.id
                                    }
                                },
                            })
                        }}>
                            <MaterialCommunityIcons color={'green'} size={70} name={'checkbox-marked-circle'} />
                        </TouchableOpacity>
                        <Text style={styles.text}>Aceptar viaje</Text>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity onPress = {() => DestroyTrip()}>
                            <MaterialCommunityIcons color={'red'} size={70} name={'close-box'} />
                        </TouchableOpacity>
                        <Text style={styles.text}>Rechazar viaje</Text>
                    </View>
                </View>
            </>
        )
    }

    const EnCaminoButtons = () => {
        return (
            <>
                <View style={styles.displayDriver}>
                    {trip.passenger.photoUrl !== "" ?
                        <Avatar.Image source={{ uri: trip.passenger.photoUrl }} /> :
                        <Avatar.Icon size={70} icon="account" />
                    }
                    <Text style={styles.driverName}>{trip.passenger.name}</Text>
                    {/* <Text style={styles.placa}>{trip.driver.plate}</Text> */}
                </View>

                <View style={styles.tripOptions}>
                    <TouchableOpacity onPress={() => GoToChat(props)}>
                        <MaterialCommunityIcons name='forum' size={40} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => RejectTrip()}>
                        <MaterialCommunityIcons name='cancel' size={40} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => IniciarViaje()}>
                        <MaterialCommunityIcons name='check' size={40} />
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    const EsperandoButtons = () => {
        return (
            <>
                <TextInput style={styles.otpInput} placeholder='OTP' onChangeText={(text) => setOtp(text)} />
                <Button title='Iniciar viaje' onPress={() => IniciarViaje()} />
            </>
        )
    }

    const IniciadoButtons = () => {
        return (
            <>
                <View style={styles.displayDriver}>
                    <MotionSlider
                        min={0}
                        max={40}
                        value={0}
                        decimalPlaces={10}
                        units={'º'}
                        backgroundColor={['#16A0DB', '#e3d912', '#32a852']}
                        firstMessage={'Teminar Viaje'}
                        secondMessage={'Terminando Viaje'}
                        finalMessage={'Viaje Terminado'}
                        onValueChanged={(value) => {
                            if (value == 40) {
                                TerminarViaje();
                                // props.navigation.navigate('ResumenViaje')  
                            }
                        }}
                    />
                </View>

                <View style={styles.tripOptions}>
                    <TouchableOpacity onPress={() => GoToChat(props)}>
                        <MaterialCommunityIcons name='forum' size={40} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => RejectTrip()}>
                        <MaterialCommunityIcons name='cancel' size={40} />
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    const CanceladoButtons = () => {
        return (
            <>
                <View style={styles.displayDriver}>
                    <Text style={styles.driverName}>El viaje ha terminado</Text>
                </View>

                <View style={styles.tripOptions}>
                    <Text style={styles.driverName}>TERMINAR</Text>
                    <TouchableOpacity onPress={() => DestroyTrip()}>
                        <MaterialCommunityIcons name='cancel' size={40} />
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    const EvaluateCardContent = () => {
        if (trip !== null) {
            if (trip.tripStatus.tripStatus == "deal") {
                return (
                    <DealButtons />
                )
            } else if (trip.tripStatus.tripStatus == 'En Camino') {
                return (
                    <EnCaminoButtons />
                )
            } else if (trip.tripStatus.tripStatus == 'Esperando') {
                return (
                    <EsperandoButtons />
                )
            } else if (trip.tripStatus.tripStatus == 'Iniciado') {
                return (
                    <IniciadoButtons />
                )
            } else if (trip.tripStatus.tripStatus == 'Cancelado' || trip.tripStatus.tripStatus == 'Terminado') {
                return (
                    <CanceladoButtons />
                )
            }
        } else {return <ActivityIndicator size = 'large' color= 'blue'/>}
        // else {
        //     return <TripCreated setTrip={setTrip} />
        // }
    }

    return (
        <View style={styles.card}>
            <EvaluateCardContent />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        backgroundColor: 'steelblue',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'gray',
        height: '30%',
        width: '95%',
        borderRadius: 5,
        margin: 10,
        bottom: 0
    },
    cardContainer: {
        flex: 1 / 2,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        color: 'white'
    },
    buttonContainer: {
        height: '20%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textTrip: {
        fontSize: 20,
        color: 'green'
    },
    payentPanel: {
        flex: 1 / 2,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '90%',
        // borderWidth: 2,
        // borderColor: 'yellow',
    },
    servicesPanel: {
        flex: 1 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        flexDirection: 'row',
        // borderWidth: 2,
        // borderColor: 'green',
    },
    tripPanel: {
        flex: 1 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // borderWidth: 2,
        // borderColor: 'red',
        width: '90%',
    },
    serviceItemStyle: {
        height: '100%',
        borderRadius: 5
    },
    serviceButton: {
        backgroundColor: '#16A0DB',
        margin: 10
    },
    paymentButton: {
        backgroundColor: '#329239',
        margin: 10
    },
    //Card
    displayDriver: {
        flex: 1 / 2,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        // borderWidth: 2,
        // borderColor: 'green'
    },
    tripOptions: {
        flex: 1 / 2,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        // borderWidth: 2,
        // borderColor: 'blue'
    },
    driverName: {
        fontSize: 20,
        color: 'black'
    },
    placa: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    otpInput: {
        backgroundColor: "white",
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "gray",
        fontSize: 20,
        color: "black",
        width: '90%',
        borderRadius: 25,
        margin: 10
    }
})
