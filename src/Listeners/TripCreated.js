import gql from 'graphql-tag'
import React, { Component } from 'react'
import {ActivityIndicator, Button} from 'react-native'
import {subClient} from '../Clients/sub-client'
import {ApolloProvider, Subscription} from 'react-apollo'
import { CardTripInfo } from '../Components/CardTripInfo'
import AsyncStorage from '@react-native-community/async-storage'

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

  constructor(props) {
    super(props);
      this.state = {trip: null}
  }

  componentDidMount(){
    
    AsyncStorage.getItem('@trip_key').then((data)=>{
      const json = JSON.parse(data)
      this.setState({trip:json.trip})
      // console.log('get trip')
      // console.log(json)
    }).catch((error)=>{console.log(error)})

  }
  render() {
      return (
          <ApolloProvider client = {subClient}>
          <Subscription subscription = {SUSCRIPTION_TRIP}
          onSubscriptionData = {(data) => {
              this.setState({trip: data.subscriptionData.data.TripCreated})
              // console.log(data.subscriptionData.data.TripCreated)
          }}>
          {({loading, error, data}) => {
              // if(loading) return <ActivityIndicator size = 'large' color = 'blue'/>
              if(loading) {
                if(this.state.trip !== null){
                  return (
                      <CardTripInfo 
                      setsetter = {this.setState}
                      trip = {this.state.trip} 
                      accept_trip = {this.props.acceptTrip} 
                      userId = {this.props.userId}>
                        {this.props.children}
                      </CardTripInfo>
                  )
                }
                else{
                  // console.log(this.state)
                  return <ActivityIndicator size = 'large' color = 'blue'/>
                }
                
              }
              if(error) return <ActivityIndicator size = 'large' color = 'red'/>
              if(this.state.trip !== null){
                return (
                    <CardTripInfo 
                    trip = {this.state.trip} 
                    accept_trip = {this.props.acceptTrip} 
                    userId = {this.props.userId}>
                      {this.props.children}
                    </CardTripInfo>
                )
              }
              else{
                // console.log(this.state)
              }
              return null
          }}
          </Subscription>
          </ApolloProvider>
      )
  }
}