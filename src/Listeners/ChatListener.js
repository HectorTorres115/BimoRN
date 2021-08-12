import gql from 'graphql-tag'
import React, { Component } from 'react'
import {ActivityIndicator} from 'react-native'
import {subClient} from '../Clients/sub-client'
import {ApolloProvider, Subscription} from 'react-apollo'

const SUSCRIPTION_CHAT= gql`
subscription($chatId: Int!) {
    MessageCreated(chatId: $chatId) {
      id
      chatId
      message
      sender
      hour
    }
  }
`
export class ChatListener extends Component {
  render() {
      return (
          <ApolloProvider client = {subClient}>
          <Subscription subscription = {SUSCRIPTION_CHAT}
          variables = {{chatId: this.props.chatId}}
          onSubscriptionData = {(data) => {
              console.log(data.subscriptionData.data)
              this.props.setter([...this.props.messages,data.subscriptionData.data.MessageCreated])
              this.props.lista.current.scrollToEnd()
          }}>
          {({loading, error}) => {
              // if(loading) return <ActivityIndicator size = 'large' color = 'blue'/>
              if(loading) return null
              if(error) return <ActivityIndicator size = 'large' color = 'red'/>
              return null
          }}
          </Subscription>
          </ApolloProvider>
      )
  }
}