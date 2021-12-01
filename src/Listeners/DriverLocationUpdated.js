import gql from 'graphql-tag'
import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import { subClient } from '../Clients/sub-client'
import { ApolloProvider, Subscription } from 'react-apollo'
import ReduxDriverStore from '../Redux/Redux-driver-store'
import { set_driver } from '../Redux/Redux-actions'

const SUSCRIPTION_DRIVER = gql`
subscription driver_location_updated($driverId: Int!){
  DriverLocationUpdated(driverId: $driverId){
    id
    service{id, name}
    driver {id, name, brand, model}
    lastActive
    lat
    lng
    heading
    indexH3
  }
}
`
export class DriverLocationUpdated extends Component {
  render() {
    return (
      <ApolloProvider client={subClient}>
        <Subscription subscription={SUSCRIPTION_DRIVER}
          variables={{ driverId: this.props.driverId }}
          onSubscriptionData={(data) => {
            // console.log(data.subscriptionData.data.DriverLocationUpdated)
            this.props.setter(data.subscriptionData.data.DriverLocationUpdated);
            ReduxDriverStore.dispatch(set_driver(data.subscriptionData.data.DriverLocationUpdated));
          }}>
          {({ loading, error }) => {
            // if (loading) return <ActivityIndicator size='large' color='blue' />
            if(loading) return null
            if (error) return <ActivityIndicator size='large' color='red' />
            return null
          }}
        </Subscription>
      </ApolloProvider>
    )
  }
}