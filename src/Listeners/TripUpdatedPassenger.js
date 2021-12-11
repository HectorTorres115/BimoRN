import gql from 'graphql-tag'
import React, { Component } from 'react'
import { ActivityIndicator, Alert } from 'react-native'
import {subClient} from '../Clients/sub-client'
import {ApolloProvider, Subscription} from 'react-apollo'

const TRIP_UPDATED_PASSENGER = gql`
subscription trip_updated_passenger($passengerId: Int!){
  TripUpdatedPassenger(passengerId: $passengerId){
    id
      opt
      driverId
      passengerId
      driver{
        id
        name
      }
      passenger{
        id
        name
      }
      tripStatus{
        id
        tripStatus
      }
      commissionType{
        id
        commissionType
      }
      paymentMethod{
        id
        paymentMethod
      }
      promocode{
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
      chatId
  }
}
`

export class TripUpdatedPassenger extends Component {
  render() {
      return (
          <ApolloProvider client = {subClient}>
          <Subscription subscription = {TRIP_UPDATED_PASSENGER}
          variables= {{passengerId: this.props.passengerId}}
          onSubscriptionData = {(data) => {
              console.log(data.subscriptionData.data)
              Alert.alert("El viaje ha sido cancelado");
              this.props.setTrip(data.subscriptionData.data.TripUpdatedPassenger);
          }}>
          {({loading, error}) => {
            //   if(loading) {return null}
              if(loading) return <ActivityIndicator size = 'large' color = 'blue'/>
              if(error) { console.log(error)}
              return null
          }}
          </Subscription>
          </ApolloProvider>
      )
  }
}