import gql from 'graphql-tag'
import React, { Component } from 'react'
import {ActivityIndicator, Button} from 'react-native'
import {subClient} from '../Clients/sub-client'
import {ApolloProvider, Subscription} from 'react-apollo'
import { CardTripInfo } from '../Components/CardTripInfo'

const SUSCRIPTION_TRIP = gql`
subscription trip_created{
  TripCreated{
    id
    driverId
    chatId
    passengerId
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
    destinationVincity
    driverPolyline
    distance
  }
}
`
export class TripCreated extends Component {
  render() {
      return (
          <ApolloProvider client = {subClient}>
          <Subscription subscription = {SUSCRIPTION_TRIP}
          onSubscriptionData = {(data) => {
              // console.log(data.subscriptionData.data.TripCreated)
          }}>
          {({loading, error, data}) => {
              // if(loading) return <ActivityIndicator size = 'large' color = 'blue'/>
              if(loading) return null
              if(error) return <ActivityIndicator size = 'large' color = 'red'/>
              return (
                  <CardTripInfo 
                  trip = {data.TripCreated} 
                  accept_trip = {this.props.acceptTrip} 
                  userId = {this.props.userId}/>
              )
          }}
          </Subscription>
          </ApolloProvider>
      )
  }
}