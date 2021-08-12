import gql from 'graphql-tag'
import React, { Component } from 'react'
import {ActivityIndicator, Button} from 'react-native'
import {subClient} from '../Clients/sub-client'
import {ApolloProvider, Subscription} from 'react-apollo'

const SUSCRIPTION_TRIP = gql`
subscription trip_created{
  TripCreated{
    id
    driverId
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
  }
}
`
export class TripCreated extends Component {
  render() {
      return (
          <ApolloProvider client = {subClient}>
          <Subscription subscription = {SUSCRIPTION_TRIP}
          onSubscriptionData = {(data) => {
              console.log(data.subscriptionData.data.TripCreated)
          }}>
          {({loading, error, data}) => {
              if(loading) return <ActivityIndicator size = 'large' color = 'blue'/>
              if(error) return <ActivityIndicator size = 'large' color = 'red'/>
              return <Button title = 'Accept trip' onPress = {async () => {
                await this.props.acceptTrip({variables: {
                  id: data.TripCreated.id,
                  tripStatus: 1,
                  driverId: this.props.userId
                }})
                this.props.setTrip(data.TripCreated)
              }}/>
          }}
          </Subscription>
          </ApolloProvider>
      )
  }
}