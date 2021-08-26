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
import Geolocation from 'react-native-geolocation-service'


const LOGIN_DRIVER = gql`
mutation login_driver($email: String!, $password:String!, $deviceToken: String!){
    LoginDriver(input: {
      email: $email,
      password: $password
      deviceToken: $deviceToken
    }) {
      id
      email
      # username
      deviceToken
      genre
      photoUrl
      city{
          id
          indexH3
          lat
          lng
      }
      name
      phoneNumber
      brand
      model
      plate
      service{
        id
        name
      }
    }
  }
`

export const LoginDriver=()=> {
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
  //Server requests
  const [login_driver] = useMutation(LOGIN_DRIVER,{
      fetchPolicy: "no-cache",
      onCompleted:({LoginDriver})=>{
        console.log(LoginDriver);
        setUser(LoginDriver)
        SetUser(LoginDriver)
      },
      onError:(error)=>{
        console.log(error);
      }
  })
  //React render
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
<<<<<<< HEAD
      <Pressable  style={styles.boton} onPress={async()=> login_driver({variables:{email,password, deviceToken: await GetDeviceToken()}})} >
=======
      <Pressable  style={styles.boton} onPress={async ()=> login_driver({variables:{email,password,deviceToken:await GetDeviceToken()}})} >
>>>>>>> 7bbef89f2078f9e0d485dc4681dd1c7193e0fe42
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
