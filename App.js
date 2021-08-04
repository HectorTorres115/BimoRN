import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function App() {
  return (
    <View style = {styles.container}>
      <Text style = {styles.text}>Hello world</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'darkblue'
  },
  text: {
    fontSize: 20,
    color: 'white'
  }
})
