import gql from 'graphql-tag'
import React, { Component } from 'react'
import {ActivityIndicator , Alert, View, Text, Button} from 'react-native'
import {subClient} from '../Clients/sub-client'
import {ApolloProvider, Subscription} from 'react-apollo'
import { Avatar, Card, IconButton} from 'react-native-paper'
import {SetTrip as SetTripStorage} from '../Functions/TripStorage'

const SUSCRIPTION_TRIP = gql`
subscription trip_updated($tripId: Int!){
  TripUpdated(id:$tripId){
    id
    driverId
    passengerId
    chatId
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
      city {
        lat, lng
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
    driverPolyline
    chatId
  }
}
`
export const TripInfo = ({driver}) =>{
  return (
    // <View style = {{backgroundColor: 'gray', width: '100%'}}>
    //   <Text style = {{fontSize: 20, color : 'black'}}>{driver.service.name}</Text>
    // </View>
    <Card.Title
    title={driver.name}
    subtitle={driver.name.service}
    left={(props) => <Avatar.Image source={require('../../assets/images/avatar.jpg')} style={{marginRight:10}}/> }
    right={(props) => <IconButton {...props} icon="more-vert"/>}
  />
  )
}

export class TripUpdated extends Component {
  render() {
      return (
          <ApolloProvider client = {subClient}>
          <Subscription subscription = {SUSCRIPTION_TRIP}
          shouldResubscribe = {true}
          variables= {{tripId: this.props.trip.id}}
          onSubscriptionData = {(data) => {
              // console.log(data.subscriptionData.data)
              // console.log('Se actualizo el trip');
              this.props.setTrip(data.subscriptionData.data.TripUpdated)
              this.props.setDriverState(data.subscriptionData.data.TripUpdated.driver)
              this.props.setDriverLocation(true)
          }}>
          {({loading, error}) => {
              // if(loading) return <ActivityIndicator size = 'large' color = 'green'/>
              if(loading) return null
              if(error) {
                console.log(error)
                return <ActivityIndicator size = 'large' color = 'red'/>
              }
                // return <TripInfo driver = {data.TripUpdated.driver}/> 
                return null
          }}
          </Subscription>
          </ApolloProvider>
      )
  }
}

export class TripUpdatedDriver extends Component {
  render() {
      return (
          <ApolloProvider client = {subClient}>
          <Subscription subscription = {SUSCRIPTION_TRIP}
          variables= {{tripId: 1}}
          onSubscriptionData = {(data) => {
              console.log(data.subscriptionData.data)
              // Alert.alert('Tu conductor es: ' + data.subscriptionData.data.TripUpdated.driver.name)
          }}>
          {({loading, error, data}) => {
              if(loading) return <ActivityIndicator size = 'large' color = 'blue'/>
              // if(loading) return null
              if(error) {
                console.log(error)
                return <ActivityIndicator size = 'large' color = 'red'/>
              }
          }}
          </Subscription>
          </ApolloProvider>
      )
  }
}