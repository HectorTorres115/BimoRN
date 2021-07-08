import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Button, TextInput, Pressable, Image, TouchableOpacity  } from 'react-native'
//Apollo
import gql from 'graphql-tag'
import {useMutation} from 'react-apollo'
import {GetDeviceToken} from '../Functions/GetDeviceToken'
//Authentication
import { SetUser } from '../Functions/UserStorage'
//Context
import { useUsuario } from '../Context/UserContext'
import { requestPermission } from '../Functions/MapsPermissions'
//geolocalizacion
import Geolocation from '@react-native-community/geolocation'

const LOGIN_PASSENGER = gql`
mutation login_passenger($email: String!, $password:String!){
    LoginPassenger(input: {
      email: $email,
      password: $password
    }) {
      id
      email
      deviceToken
      genre
      photoUrl
    }
  }
`


export const Login=()=> {
  useEffect(()=>{
    requestPermission().then(()=>{
      console.log('permisos aceptados')
    }).catch(()=>console.log('permisos denegados'))
  },[])
  Geolocation.watchPosition((info) => {
  //  console.log(info.coords);
  }, (error) => console.log(error),
  {enableHighAccuracy: true, distanceFilter: 0, useSignificantChanges: false, maximumAge: 0})
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const {setUser} = useUsuario()
  const [login] = useMutation(LOGIN_PASSENGER,{
      onCompleted:({LoginPassenger})=>{
        console.log(LoginPassenger);
        setUser(LoginPassenger)
        SetUser(LoginPassenger)
      },
      onError:(error)=>{
        console.log(error);
      }
  })
  return (
    <View style={styles.contenedor}>
      <Image source={require('../../assets/images/bimo-banner.jpeg')} style={styles.logo} />
      <TextInput 
        placeholder="   Correo" 
        placeholderTextColor="gray" 
        onChangeText={(email)=> setEmail(email)} 
        style={styles.input}/> 
      <TextInput 
        placeholder="   Contraseña" 
        placeholderTextColor="gray" 
        onChangeText={(password)=> setPassword(password)}
        style={styles.input} 
        secureTextEntry= {true}/> 
        <TouchableOpacity>
          <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      <Pressable  style={styles.boton} onPress={()=> login({variables:{email,password}})} >
        <Text style={styles.texto}>Iniciar Sesión</Text>
      </Pressable>
      <TouchableOpacity>
          <Text style={styles.registrarse}>Registrarse</Text>
      </TouchableOpacity>
      <Image source={require('../../assets/images/bimo-footter.jpeg')} style={styles.logo} />
    </View>
  )
}

const styles = StyleSheet.create({

  boton:{
    // flex: 1,
    color:'white',
    width:"80%",
    backgroundColor:"#16A0DB",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:50
  },
  contenedor:{
    flex:1,
    backgroundColor: "#1d1d1b",
    justifyContent: "center",
    alignItems: "center"
  },
  texto:{
    fontSize: 20,
    color: "white"
  },  
  input:{
    backgroundColor:"white",
    borderRadius:5,
    borderWidth:2,
    borderColor:"gray",
    fontSize:20,
    color: "black",
    width: '90%',
    borderRadius:25,
    margin: 10
  },
  logo:{
    marginTop:0,
    marginBottom:30
  },
  forgot:{
    fontSize: 17,
    color:"white",
  },
  registrarse:{
    fontSize: 17,
    color:"white"
  },

})
