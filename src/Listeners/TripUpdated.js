import gql from 'graphql-tag'
import React, { Component } from 'react'
import {ActivityIndicator , Alert, View, Text} from 'react-native'
import {subClient} from '../Clients/sub-client'
import {ApolloProvider, Subscription} from 'react-apollo'
import { Avatar, Card, IconButton} from 'react-native-paper'


const SUSCRIPTION_TRIP = gql`
subscription trip_updated($tripId: Int!){
  TripUpdated(id:$tripId){
    id
    opt
    driver{
      id
      name,
      plate,
      model
      service, {
        name
      }
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
export const TripInfo = ({driver}) =>{
  return (
    // <View style = {{backgroundColor: 'gray', width: '100%'}}>
    //   <Text style = {{fontSize: 20, color : 'black'}}>{driver.service.name}</Text>
    // </View>
    <Card.Title
    title={driver.name}
    subtitle={driver.name.service}
    left={(props) => <Avatar.Icon {...props} icon="folder" />}
    right={(props) => <IconButton {...props} icon="more-vert"/>}
  />
  )
}

export class TripUpdated extends Component {
  render() {
      return (
          <ApolloProvider client = {subClient}>
          <Subscription subscription = {SUSCRIPTION_TRIP}
          variables= {{tripId: this.props.tripId}}
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
              return <TripInfo driver = {data.TripUpdated.driver}/>
          }}  
          </Subscription>
          </ApolloProvider>
      )
  }
}