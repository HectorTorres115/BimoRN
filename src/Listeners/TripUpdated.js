import gql from 'graphql-tag'
import React, { Component } from 'react'
import {ActivityIndicator , Alert, View, Text, Button} from 'react-native'
import {subClient} from '../Clients/sub-client'
import {ApolloProvider, Subscription} from 'react-apollo'
import { Avatar, Card, IconButton} from 'react-native-paper'

const SUSCRIPTION_TRIP = gql`
subscription trip_updated($tripId: Int!){
  TripUpdated(id:$tripId){
    id
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
export const TripInfo = ({driver}) =>{
  return (
    // <View style = {{backgroundColor: 'gray', width: '100%'}}>
    //   <Text style = {{fontSize: 20, color : 'black'}}>{driver.service.name}</Text>
    // </View>
    <Card.Title
    title={driver.name}
    subtitle={driver.name.service}
    left={(props) => <Avatar.Image source={require('../../assets/images/avatar.jpg')} style={{marginRight:10}}/> }
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

              this.props.create_chat({variables:{
                tripId:data.subscriptionData.data.TripUpdated.id,
                driverId:data.subscriptionData.data.TripUpdated.driver.id,
                passengerId:data.subscriptionData.data.TripUpdated.passenger.id
                }
              })
          }}>
          {({loading, error, data}) => {
              if(loading) return <ActivityIndicator size = 'large' color = 'blue'/>
              // if(loading) return null
              if(error) {
                console.log(error)
                return <ActivityIndicator size = 'large' color = 'red'/>
              }
              if(data){
                // console.log(data.TripUpdated)
                return <TripInfo driver = {data.TripUpdated.driver}/> 
                // return null
              }
          }}
          </Subscription>
          </ApolloProvider>
      )
  }
}

export class TripUpdatedDriver extends Component {
  componentDidMount(){
    console.log(this.props)
  }
  render() {
      return (
          <ApolloProvider client = {subClient}>
          <Subscription subscription = {SUSCRIPTION_TRIP}
          variables= {{tripId: this.props.trip.id}}
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
              if(data.TripUpdated.chatId !== null){
                // console.log(data.TripUpdated)
                // return <TripInfo driver = {data.TripUpdated.driver}/> 
                return <Button title = "Chat" onPress = {() => props.navigation.navigate("Chat",{chatId: data.TripUpdated.chatId})}/> 
              }
          }}
          </Subscription>
          </ApolloProvider>
      )
  }
}