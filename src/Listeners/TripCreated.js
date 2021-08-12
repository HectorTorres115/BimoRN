import gql from 'graphql-tag'
import React, { Component } from 'react'
import {ActivityIndicator, Button} from 'react-native'
import {subClient} from '../Clients/sub-client'
import {ApolloProvider, Subscription} from 'react-apollo'

const SUSCRIPTION_TRIP = gql`
subscription trip_created{
  TripCreated{
    id
    opt
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
      __typename
    }
    paymentMethod{
      id
      __typename
    }
    promocode{
      id
      __typename
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
              }}/>
          }}
          </Subscription>
          </ApolloProvider>
      )
  }
}