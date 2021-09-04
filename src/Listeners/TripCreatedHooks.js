import gql from 'graphql-tag'
import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {ActivityIndicator, Button} from 'react-native'
import {subClient} from '../Clients/sub-client'
import {ApolloProvider, useSubscription} from 'react-apollo'
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

export function TripCreatedHooks() {

    const {data,loading,error} = useSubscription(SUSCRIPTION_TRIP,{
        fetchPolicy: 'no-cache',
        onSubscriptionData:(data)=>{
            console.log('TripCreatedHooks')
            console.log(data.subscriptionData.data)
        }

    })
    if(loading){
        <ActivityIndicator size={'large'} color={'red'} ></ActivityIndicator>
    }
    return (
        
        <SuscriptionProvider>
            <Text>Suscrtiption jalando</Text>
        </SuscriptionProvider>
    )
}

function SuscriptionProvider(props) {
    return (
        <ApolloProvider client={subClient} >
            {props.children}
        </ApolloProvider>
    )
}

const styles = StyleSheet.create({})
