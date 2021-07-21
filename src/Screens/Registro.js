import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Button, TextInput, Pressable, Image, TouchableOpacity,Switch, ScrollView  } from 'react-native'
import { HelperText,TextInput as InputPaper } from 'react-native-paper';
import gql from 'graphql-tag'
import {useMutation} from 'react-apollo'
import { GetDeviceToken } from '../Functions/GetDeviceToken';

const REGISTER_PASSENGER = gql`
mutation create_passenger($email: String!,$password: String!,$name: String!,$phoneNumber: String!,$genre: String!,$deviceToken: String!) {
  CreatePassenger(input: { 
    email: $email
    password: $password
    name: $name
    phoneNumber: $phoneNumber
    photoUrl: ""
    isPhoneVerified: false
    isPushEnabled: false
    genre: $genre
    deviceToken: $deviceToken
    
  }) {
    id
    name
    password
  }
}
`

const REGISTER_DRIVER = gql`
mutation create_driver($email: String!,$password: String!,$name: String!,$phoneNumber: String!,$genre: String!,$deviceToken: String!, $brand: String!,$model: String!, $plate: String!) {
  CreateDriver(input: { 
    email: $email
    password: $password
    name: $name
    phoneNumber: $phoneNumber
    photoUrl: ""
    genre: $genre
    deviceToken: $deviceToken
    balance:0
    brand: $brand
    model:$model
    plate: $plate
    rating: 5.0
  }) {
    id
    name
    password
  }
}
`

const  firstRender = (props)=> {
  return (
    <>
    <View style={styles.contenedorLogo}>
    <Image source={require('../../assets/images/bimo-banner.jpeg')} style={styles.logo} />
      
      <Text style={styles.titulo}>Registro</Text>
      <Pressable  style={styles.boton} onPress={()=> {
        props.setShouldShowChofer(true) 
        props.setShouldFirstRender(false)
      }
      } >
        <Text style={styles.texto}>Chofer</Text>
      </Pressable>
      <Pressable  style={styles.boton} onPress={()=> {
        props.setShouldShowChofer(false)
        props.setShouldFirstRender(false)
        }
      } >
        <Text style={styles.texto}>Pasajero</Text>
      </Pressable>
    </View>
    </>
  )
}

const inputDriver = (props)=> {
  return (
    <>
    <View style={styles.contenedorLogo}>
      <Image source={require('../../assets/images/bimo-banner.jpeg')} style={styles.logo} />
      <Text style={styles.titulo}>Registro Chofer</Text>
    </View>
    <ScrollView contentContainerStyle={styles.scroll}>      
      <TextInput 
        placeholder="   Nombre" 
        placeholderTextColor="gray" 
        onChangeText={(name)=> props.InputsDriver.setName(name)} 
        style={styles.input}/> 
        <TextInput 
        placeholder="   Correo" 
        placeholderTextColor="gray" 
        onChangeText={(email)=> props.InputsDriver.setEmail(email)} 
        style={styles.input}/> 
      <TextInput 
        placeholder="   Contaseña" 
        placeholderTextColor="gray" 
        onChangeText={(password)=> props.InputsDriver.setPassword(password)}
        style={styles.input} 
        secureTextEntry= {true}/> 
        
        <TextInput 
        placeholder="   Telefono" 
        placeholderTextColor="gray" 
        onChangeText={(phoneNumber)=> props.InputsDriver.setPhoneNumber(phoneNumber)}
        style={styles.input} 
        secureTextEntry= {true}/> 
        <TextInput 
          placeholder="   Genero" 
          placeholderTextColor="gray" 
          onChangeText={(genre)=> props.InputsDriver.setGenre(genre)}
          style={styles.input}/> 
        <TextInput 
        placeholder="   Marca Vehiculo" 
        placeholderTextColor="gray" 
        onChangeText={(brand)=> props.InputsDriver.setPhoneNumber(brand)}
        style={styles.input} /> 
        <TextInput 
        placeholder="   Modelo Vehiculo" 
        placeholderTextColor="gray" 
        onChangeText={(model)=> props.InputsDriver.setPhoneNumber(model)}
        style={styles.input} /> 
        <TextInput 
        placeholder="   Placa Vehiculo" 
        placeholderTextColor="gray" 
        onChangeText={(plate)=> props.InputsDriver.setPhoneNumber(plate)}
        style={styles.input} /> 
      <Pressable  style={styles.boton} onPress={async ()=> props.registerDriver({variables:{email: props.InputsDriver.email,password: props.InputsDriver.password, 
          name: props.InputsDriver.name, phoneNumber: props.InputsDriver.phoneNumber, genre: props.InputsDriver.genre,
          deviceToken: await GetDeviceToken(), brand: props.InputsDriver.brand, model: props.InputsDriver.model, plate: props.InputsDriver.plate }})} >
        <Text style={styles.texto}>Registrarse</Text>
      </Pressable>
      <Pressable  style={styles.boton} onPress={()=> props.setShouldFirstRender(true)} >
        <Text style={styles.texto}>Regresar</Text>
      </Pressable>
    </ScrollView>
    </>
  )
}

const inputPassenger = (props)=> {

  return (
    <>
    <View style={styles.contenedorLogo}>
      <Image source={require('../../assets/images/bimo-banner.jpeg')} style={styles.logo} />
      <Text style={styles.titulo}>Registro Pasajero</Text>
    </View>
    <ScrollView contentContainerStyle={styles.scroll}>
        <TextInput 
          placeholder="   Nombre" 
          placeholderTextColor="gray" 
          onChangeText={(name)=> props.InputsPassenger.setName(name)} 
          style={styles.input}/> 
          <TextInput 
          placeholder="   Correo" 
          placeholderTextColor="gray" 
          onChangeText={(email)=> props.InputsPassenger.setEmail(email)} 
          style={styles.input}/> 
        <TextInput 
          placeholder="   Contaseña" 
          placeholderTextColor="gray" 
          onChangeText={(password)=> props.InputsPassenger.setPassword(password)}
          style={styles.input} 
          secureTextEntry= {true}/> 
        <TextInput 
          placeholder="   Telefono" 
          placeholderTextColor="gray" 
          onChangeText={(phoneNumber)=> props.InputsPassenger.setPhoneNumber(phoneNumber)}
          style={styles.input}/> 
        <TextInput 
          placeholder="   Genero" 
          placeholderTextColor="gray" 
          onChangeText={(genre)=> props.InputsPassenger.setGenre(genre)}
          style={styles.input}/> 
        <Pressable  style={styles.boton} onPress={ async ()=> props.registerPassenger({variables:{email: props.InputsPassenger.email,password: props.InputsPassenger.password, 
          name: props.InputsPassenger.name, phoneNumber: props.InputsPassenger.phoneNumber, genre: props.InputsPassenger.genre,
          deviceToken: await GetDeviceToken() }})} >
          <Text style={styles.texto}>Registrarse</Text>
        </Pressable>
        <Pressable  style={styles.boton} onPress={()=> props.setShouldFirstRender(true)} >
          <Text style={styles.texto}>Regresar</Text>
        </Pressable>
    </ScrollView>
    </>
  )
}

const evaluateStack = (props)=> {
  if(props.shouldFirstRender){
    return firstRender(props)
  }
  else{
    console.log(props.shouldShowChofer)
    if(props.shouldShowChofer == true){     
      return inputDriver(props) 
    } 
    else{ 
      return inputPassenger(props)
    }
  }
}

export const Registro = ()=> {
const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [phoneNumber,setPhoneNumber] = useState("")
const [genre,setGenre] = useState("")
const [brand,setBrand] = useState("")
const [model,setModel] = useState("")
const [plate,setPlate] = useState("")
const [shouldShowChofer, setShouldShowChofer] = useState(true);
const [shouldFirstRender, setShouldFirstRender] = useState(true);
const [registerPassenger] = useMutation(REGISTER_PASSENGER,{
  fetchPolicy: "no-cache",
  onCompleted:({CreatePassenger})=>{
    console.log(CreatePassenger);
    // setUser(RegisterPassenger)
    // SetUser(RegisterPassenger)
  },
  onError:(error)=>{
    console.log(error);
  }
})
const [registerDriver] = useMutation(REGISTER_DRIVER,{
  fetchPolicy: "no-cache",
  onCompleted:({CreateDriver})=>{
    console.log(CreateDriver);
    // setUser(RegisterPassenger)
    // SetUser(RegisterPassenger)
  },
  onError:(error)=>{
    console.log(error);
  }
})

  return (
    <View style={styles.contenedor}> 
        {
          evaluateStack({shouldFirstRender,shouldShowChofer,setShouldShowChofer,setShouldFirstRender,
            InputsDriver:{name,setName,email,setEmail,password,setPassword,phoneNumber,setPhoneNumber,genre,setGenre,brand,setBrand,model,setModel,plate,setPlate},
            InputsPassenger:{name,setName,email,setEmail,password,setPassword,phoneNumber,setPhoneNumber,genre,setGenre},
            registerPassenger, registerDriver})
        }
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
    marginTop:10,
    marginBottom:10
  },
  contenedor:{
    flex:1,
    backgroundColor: "#1d1d1b",
    // justifyContent: "center",
    // alignItems: "center",
    width: '100%'
  },
  contenedorLogo:{
    backgroundColor: "#1d1d1b",
    justifyContent: "center",
    alignItems: "center",
    width: '100%'
  },
  texto:{
    fontSize: 20,
    color: "white"
  },  
  textoPassword:{
    fontSize: 15,
    color: "white",
    width: '90%',
    justifyContent: "center",
    alignItems: "center",
  },
  titulo:{
    fontSize: 30,
    color: "white",
    // marginBottom:30
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
    margin: 5
  },
  logo:{
    marginTop:0,
    // marginBottom:30
  },
  scroll:{
    height:700,
    // flex:1,
    // borderWidth:2,
    // borderColor: 'red',
    justifyContent: "center",
    alignItems: "center",
    // width: '100%'
  }
})
