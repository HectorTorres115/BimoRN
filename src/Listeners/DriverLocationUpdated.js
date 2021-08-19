import gql from 'graphql-tag'
import React, { Component } from 'react'
import {ActivityIndicator} from 'react-native'
import {subClient} from '../Clients/sub-client'
import {ApolloProvider, Subscription} from 'react-apollo'

const SUSCRIPTION_DRIVER = gql`
subscription driver_location_updated($driverId: Int!){
  DriverLocationUpdated(driverId: $driverId){
    id
    service{id, name}
    driver {id, name, brand, model}
    lastActive
    lat
    lng
    indexH3
  }
}
`
export class DriverLocationUpdated extends Component {
  render() {
      return (
          <ApolloProvider client = {subClient}>
          <Subscription subscription = {SUSCRIPTION_DRIVER}
          variables = {{driverId: this.props.driverId}}
          onSubscriptionData = {(data) => {
              console.log(data.subscriptionData.data)
              this.props.driverMarker.current.animateMarkerToCoordinate({
                latitude: data.subscriptionData.data.DriverLocationUpdated.lat,
                longitude: data.subscriptionData.data.DriverLocationUpdated.lng
              }, this.props.duration)
          }}>
          {({loading, error}) => {
              // if(loading) return <ActivityIndicator size = 'large' color = 'blue'/>
              if(loading) return <ActivityIndicator size = 'large' color = 'green'/>
              if(error) return <ActivityIndicator size = 'large' color = 'red'/>
              return null
          }}
          </Subscription>
          </ApolloProvider>
      )
  }
}