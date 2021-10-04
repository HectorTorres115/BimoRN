import React , {useEffect, useState} from 'react'
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, Touchable } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import {Button as ButtonPaper} from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome';
//
import gql from 'graphql-tag'
import {useQuery, useLazyQuery} from 'react-apollo'
//
import { useTrip } from '../Context/TripContext'
import { SetTrip as SetTripStorage} from '../Functions/TripStorage'
import { useViaje } from '../Context/ViajeContext';

const GET_SERVICES = gql`
query {
  GetServices {
    id
    commissionTypeId
    icon
    mapIcon
    name
    seats
    tarifaBase
    cuotaDeSolicitudPorKm
    tarifaMinima
    costoPorTiempo
    costoPorKm
    tarifaDeCancelacion
  }
}

`

const GET_PAYMENT_METHODS = gql`
query {
  GetPaymentMethods{
    id
    paymentMethod
  }
}
`

export const CardPassenger = (props) => {
    useEffect(() => {
        console.log('Component did mount');
    }, [])
    const {trip, setTrip} = useTrip(); 
    const {viaje, setViaje} = useViaje();
    const [payments, setPayments] = useState([]);
    const [services, setServices] = useState([]);

    useQuery(GET_SERVICES, {
        fetchPolicy: "no-cache",
        onCompleted: ({GetServices}) => {
            console.log(GetServices);
            setServices(GetServices)
        },
        onError: (err) => {
            console.log(err);
        }
    })

    useQuery(GET_PAYMENT_METHODS, {
        fetchPolicy: "no-cache",
        onCompleted: ({GetPaymentMethods}) => {
            console.log(GetPaymentMethods);
            setPayments(GetPaymentMethods)
        },
        onError: (err) => {
            console.log(err);
        }
    })

    const [get_services] = useLazyQuery(GET_SERVICES, {
        fetchPolicy: "no-cache",
        onCompleted: ({GetServices}) => {
            console.log(GetServices);
            setServices(GetServices)
        },
        onError: (err) => {
            console.log(err);
        }
    })

    const [get_payments] = useLazyQuery(GET_PAYMENT_METHODS, {
        fetchPolicy: "no-cache",
        onCompleted: ({GetPaymentMethods}) => {
            console.log(GetPaymentMethods);
            setPayments(GetPaymentMethods)
        },
        onError: (err) => {
            console.log(err);
        }
    })

    function filterServices(item) {
        const filtered = services.filter((service) => service.id === item.id)
        setServices(filtered)
        setViaje({...viaje, service: filtered[0]})
    }

    function filterPayments(item) {
        const filtered = payments.filter((payment) => payment.id === item.id)
        setPayments(filtered)
        setViaje({...viaje, paymentMethod: filtered[0]})
    }

    function deleteFromStorage() {
        setTrip(null);
        SetTripStorage(null);
    }

    function EvaluateTrip() {
        if(trip !== null){
            console.log(trip);
            return (
                <View style = {styles.tripPanel}>
                <ButtonPaper 
                style = {{backgroundColor: 'darkblue', margin: 10}}
                icon={'plus'}
                mode="contained" 
                onPress={() => props.props.viaje()}>
                Viaje
                </ButtonPaper>
    
                <ButtonPaper 
                style = {{backgroundColor: '#000000', margin: 10}}
                icon={'highway'}
                mode="contained" 
                onPress={() => props.props.ruta()}>
                Ruta    
                </ButtonPaper>
    
                <ButtonPaper 
                style = {{backgroundColor: '#000000', margin: 10}}
                icon={'highway'}
                mode="contained" 
                onPress={() => {
                    setTrip(null)
                    SetTripStorage(null)
                }}>
                DEL    
                </ButtonPaper>
              </View>
            )
        } else {
            return (
                <View style = {styles.tripPanel}>
                    <ButtonPaper 
                    style = {{backgroundColor: '#000000', margin: 10}}
                    icon={'death-star'}
                    mode="contained" 
                    onPress={() => props.navigation.navigate('Chat')}>
                    CHAT   
                    </ButtonPaper>

                    <ButtonPaper 
                    style = {{backgroundColor: '#000000', margin: 10}}
                    icon={'death-star'}
                    mode="contained" 
                    onPress={() => deleteFromStorage()}>
                    CANCELAR VIAJE    
                    </ButtonPaper>
                </View>
            )
        }
    }

    return (
        <View style = {styles.card}>
            {/* {props.children} */}

          {/* <Text style = {styles.textCard}>Metodos de pago</Text> */}
          <View style ={styles.payentPanel}>
            { payments.length <= 1 ?( 
            <TouchableOpacity onPress = {() => get_payments()}>
                <Icon name="arrow-left" size = {20} style = {{margin: 10}} color = 'gray'/>
            </TouchableOpacity>
            ) : null} 
            <FlatList horizontal = {true}
            data = {payments}
            renderItem = {({item}) => (
                <View style = {styles.serviceItemStyle}>
                    <ButtonPaper 
                    style = {styles.paymentButton} 
                    icon={item.icon}
                    mode="contained" 
                    onPress={() => filterPayments(item)}>
                        {item.paymentMethod}
                    </ButtonPaper>
                </View>    
            )}/>
          </View>

          {/* <Text style = {styles.textCard}>Servicios</Text> */}
          <View style ={styles.servicesPanel}>
            { services.length <= 1 ?( 
            <TouchableOpacity onPress = {() => get_services()}>
                <Icon name="arrow-left" size = {20} style = {{margin: 10}} color = 'gray'/>
            </TouchableOpacity>
            ) : null} 
            <FlatList horizontal = {true}
            data = {services}
            renderItem = {({item}) => (
                <View style = {styles.serviceItemStyle}>
                    <ButtonPaper 
                    style = {styles.serviceButton} 
                    icon={item.icon}
                    mode="contained" 
                    onPress={() => filterServices(item)}>
                        {item.name}
                    </ButtonPaper>
                </View>    
            )}/>
          </View>

          {/* <Text style = {styles.textCard}>Panel</Text> */}
          <View style = {styles.tripPanel}>
            <ButtonPaper 
            style = {{backgroundColor: 'darkblue', margin: 10}}
            icon={'plus'}
            mode="contained" 
            onPress={() => props.props.viaje()}>
            Viaje
            </ButtonPaper>

            <ButtonPaper 
            style = {{backgroundColor: '#000000', margin: 10}}
            icon={'highway'}
            mode="contained" 
            onPress={() => props.props.ruta()}>
            Ruta    
            </ButtonPaper>

            <ButtonPaper 
            style = {{backgroundColor: '#000000', margin: 10}}
            icon={'highway'}
            mode="contained" 
            onPress={() => {
                setTrip(null)
                SetTripStorage(null)
            }}>
            DEL    
            </ButtonPaper>
          </View>
          {/* <EvaluateTrip/> */}

        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 10,
        height: "100%",
        width: "100%",
    },
    text: {
        fontSize: 20,
        color: 'black',
        margin: 5
    },
    buttonContainer: {
        height: '20%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button :{
        margin: 10
    },
    textTrip: {
        fontSize: 20,
        color: 'green'
    },
    payentPanel: {
        flex: 1/2, 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexDirection: 'row',
        width: '90%',
        // borderWidth: 2,
        // borderColor: 'yellow',
    },
    servicesPanel: {
        flex: 1/2, 
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        flexDirection: 'row',
        // borderWidth: 2,
        // borderColor: 'green',
    },
    tripPanel: {
        flex: 1/2, 
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
    }
})