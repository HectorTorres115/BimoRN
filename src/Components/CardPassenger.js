import React, { useEffect, useState } from 'react'
import { Text, View, Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Button as ButtonPaper, Avatar } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//
import gql from 'graphql-tag'
import { useQuery, useLazyQuery } from 'react-apollo'
//
import { useTrip } from '../Context/TripContext'
import { SetTrip as SetTripStorage } from '../Functions/TripStorage'
import { useViaje } from '../Context/ViajeContext';
import { styles } from '../Styles/CardPassenger'

const GET_TRIP_BY_ID = gql`
query get_trip_by_id($id:Int!){
  GetTripById(id: $id){
    id
    opt
    driver {
      id
      name
      plate
      photoUrl
      rating
      
    }
    passenger {
      id
      name
    }
    tripStatus {
      id
      tripStatus
    }
    commissionType {
      id
      commissionType
    }
    paymentMethod {
      id
      paymentMethod
    }
    promocode {
      id
      code
      discount
    }
    commission
    commissionValue
    createdAt
    currency
    originVincity
    originLocationLat
    originLocationLng
    destinationVincity
    destinationLocationLat
    destinationLocationLng
    discount
    distance
    pickedUpAt
    droppedOffAt
    fee
    feeTaxed
    feedback
    note
    rating
    rawfee
    tax
    tripPolyline
    distance
  }
}
`

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
        console.log('Component did mount (Card Passenger)');
        if (trip !== null) {
            get_trip_by_id();
        }
    }, [])

    const { trip, setTrip } = useTrip();
    const { viaje, setViaje } = useViaje();
    const [payments, setPayments] = useState([]);
    const [services, setServices] = useState([]);
    const [cost, setCost] = useState(null);

    const [get_trip_by_id] = useLazyQuery(GET_TRIP_BY_ID, {
        onCompleted: ({ GetTripById }) => {
            console.log(GetTripById);
            setTrip(GetTripById)
        },
        onError: (err) => {
            console.log(err);
        }
    })

    const [get_services] = useLazyQuery(GET_SERVICES, {
        fetchPolicy: "no-cache",
        onCompleted: ({ GetServices }) => {
            // console.log(GetServices);
            console.log('Services setted');
            setServices(GetServices)
        },
        onError: (err) => {
            console.log(err);
        }
    })

    const [get_payments] = useLazyQuery(GET_PAYMENT_METHODS, {
        fetchPolicy: "no-cache",
        onCompleted: ({ GetPaymentMethods }) => {
            // console.log(GetPaymentMethods);
            console.log('Payments setted');
            setPayments(GetPaymentMethods)
        },
        onError: (err) => {
            console.log(err);
        }
    })

    useQuery(GET_SERVICES, {
        fetchPolicy: "no-cache",
        onCompleted: ({ GetServices }) => {
            // console.log(GetServices);
            console.log('Services setted');
            setServices(GetServices)
        },
        onError: (err) => {
            console.log(err);
        }
    })

    useQuery(GET_PAYMENT_METHODS, {
        fetchPolicy: "no-cache",
        onCompleted: ({ GetPaymentMethods }) => {
            // console.log(GetPaymentMethods);
            console.log('Payments setted');
            setPayments(GetPaymentMethods)
        },
        onError: (err) => {
            console.log(err);
        }
    })

    function filterServices(item) {
        const filtered = services.filter((service) => service.id === item.id)
        setServices(filtered)
        setViaje({ ...viaje, service: filtered[0] })
    }

    function filterPayments(item) {
        const filtered = payments.filter((payment) => payment.id === item.id)
        setPayments(filtered)
        setViaje({ ...viaje, paymentMethod: filtered[0] })
    }

    function GoToChat() {
        console.log(props.props);
        // console.log('Go to chat');
        props.props.navigation.navigate('Chat');
    }

    function CancelTripButton() {
        console.log(props.props);
        console.log('Cancel trip');
    }

    async function DrawRoutePolyline() {
        try {
           const resRoute = await props.props.drawRoute();
           const res = await props.props.get_cost({
                variables: {
                    serviceId: services[0].id,
                    distance: resRoute.data.GetRouteInfo.distance.split(" ")[0],
                    time: resRoute.data.GetRouteInfo.time.split(" ")[0]
                }
            })
            setCost(res.data.GetCost)
            // console.log(res);
        } catch (error) {
            throw new Error(error)
        }
    }

    async function CreateTrip() {
        props.props.createTrip()
    }

    const NormalCard = () => (
        <View style={styles.card}>
            <View style={styles.payentPanel}>
                {payments.length <= 1 ? (
                    <TouchableOpacity onPress={() => get_payments()}>
                        <MaterialCommunityIcons
                            name="arrow-left"
                            size={20}
                            style={{ margin: 10 }} color='gray' />
                    </TouchableOpacity>
                ) : null}
                <FlatList horizontal={true}
                    data={payments}
                    renderItem={({ item }) => (
                        <View style={styles.serviceItemStyle}>
                            <ButtonPaper
                                style={styles.paymentButton}
                                icon={item.icon}
                                mode="contained"
                                onPress={() => filterPayments(item)}>
                                {item.paymentMethod}
                            </ButtonPaper>
                        </View>
                )} />
            </View>

            <View style={styles.servicesPanel}>
                {services.length <= 1 ? (
                    <TouchableOpacity onPress={() => get_services()}>
                        <MaterialCommunityIcons name="arrow-left" size={20} style={{ margin: 10 }} color='gray' />
                    </TouchableOpacity>
                ) : null}
                <FlatList horizontal={true}
                    data={services}
                    renderItem={({ item }) => (
                        <View style={styles.serviceItemStyle}>
                            <ButtonPaper
                                style={styles.serviceButton}
                                icon={item.icon}
                                mode="contained"
                                onPress={() => filterServices(item)}>
                                {item.name}
                            </ButtonPaper>
                        </View>
                    )} />
            </View>

            <View style={styles.tripPanel}>
                    {/* <ButtonPaper
                        style={{ backgroundColor: 'darkblue', margin: 10 }}
                        icon={'plus'}
                        mode="contained"
                        onPress={() => CreateTrip()}>
                        Viaje
                    </ButtonPaper> */}
    
                    <ButtonPaper
                        style={{ backgroundColor: '#000000', margin: 10 }}
                        icon={'highway'}
                        mode="contained"
                        onPress={() => DrawRoutePolyline()}>
                        Ver precio
                    </ButtonPaper>
                    {/* <EvaluateCostExist/> */}
            </View>
        </View>
    )

    const WaitingCard = () => (
        <View style = {styles.card}>
            <ActivityIndicator size='large' color='orange' />
            <Button title = 'Clean storage ' onPress = {() => {
                props.props.DeleteTrip()
                props.props.DeleteViaje()
            }}/>
        </View>
    )

    const OnCourseCard = () => (
        <View style={styles.card}>
            <View style={styles.displayDriver}>
                {trip.driver.photoUrl !== "" ?
                    <Avatar.Image source={{ uri: trip.driver.photoUrl }} /> :
                    <Avatar.Icon size={70} icon="account" />
                }
                <Text style={styles.driverName}>{trip.driver.name}</Text>
                <Text style={styles.placa}>{trip.driver.plate}</Text>
            </View>

            <View style={styles.tripOptions}>
                <TouchableOpacity onPress={() => GoToChat()}>
                    <MaterialCommunityIcons name='forum' size={40} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => CancelTripButton()}>
                    <MaterialCommunityIcons name='cancel' size={40} />
                </TouchableOpacity>
            </View>
        </View>
    )

    const FinishedCard = () => (
        <View>
            <MaterialCommunityIcons name='cancel' size={42} color='red' />
        </View>
    )

    function EvaluateTrip() {
        if (trip == null && cost == null) {
            return <NormalCard />
        } else if (trip !== null && trip.driver !== null && cost !== null) {
            return <OnCourseCard />
        } else if (trip !== null && trip.driver == null) {
            return <WaitingCard />
        } else if (trip !== null && trip.tripStatus.tripStatus == "Terminado" || "Cancelado" && cost == null) {
            return <FinishedCard />
        } else if( trip == null && cost !== null){
            return (
                <View style = {styles.card}>
                    <Text style = {styles.text}>Distancia: {viaje.route.distance}</Text>                    
                    <Text style = {styles.text}>Tiempo estimado: {viaje.route.time}</Text>                    
                    <Text style = {styles.text}>Precio: ${cost.feeTaxed}</Text> 
                    <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <MaterialCommunityIcons size = {24} name = {'arrow-left'} onPress = {() => setCost(null)}/>  
                        <ButtonPaper
                            style={{ backgroundColor: 'darkblue', margin: 10 }}
                            icon={'plus'}
                            mode="contained"
                            onPress={() => CreateTrip()}>
                            Viaje
                        </ButtonPaper>         
                    </View>  
                </View>
            )
        }
    }

    return (
        <EvaluateTrip props={props} />
    )
}