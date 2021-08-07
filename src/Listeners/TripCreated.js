import gql from 'graphql-tag'
import React, { Component } from 'react'
import {ActivityIndicator} from 'react-native'
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
              console.log(data.subscriptionData.data)
              
          }}>
          {({loading, error}) => {
              if(loading) return <ActivityIndicator size = 'large' color = 'blue'/>
            //   if(loading) return null
              if(error) return <ActivityIndicator size = 'large' color = 'red'/>
              return null
          }}
          </Subscription>
          </ApolloProvider>
      )
  }
}