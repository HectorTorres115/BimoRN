import gql from 'graphql-tag'
import React, { Component } from 'react'
import {ActivityIndicator} from 'react-native'
import {subClient} from '../Clients/sub-client'
import {ApolloProvider, Subscription} from 'react-apollo'

const SUSCRIPTION_TRIP = gql`
subscription trip_created{
  TripCreated{
    id
    driverId
    chatId
    passengerId
    tripStatusId
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
              // this.setState({trip: data.subscriptionData.data.TripCreated})
              this.props.setTrip(data.subscriptionData.data.TripCreated)
              // console.log(data.subscriptionData.data.TripCreated)
          }}>
          {({loading, error}) => {
              if(loading) return <ActivityIndicator size = 'large' color = 'blue'/>
              if(error) return <ActivityIndicator size = 'large' color = 'red'/>
              return null
          }}
          </Subscription>
          </ApolloProvider>
      )
  }
}