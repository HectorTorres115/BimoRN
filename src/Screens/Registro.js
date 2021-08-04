import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

export const Registro = ()=> {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.texto}>Registro</Text>
      <Button title="Registro" onPress={()=> console.log("Registro")} style={styles.boton} />
    </View>
  )
}

const styles = StyleSheet.create({

  boton: {
    flex: 1,
    color: "darkblue"
  },
  contenedor:{
    flex:1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center"
  },
  texto:{
    fontSize: 20,
    color: "white"
  }
  
  

})
