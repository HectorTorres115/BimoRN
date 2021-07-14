import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Button, TextInput, Pressable, Image, TouchableOpacity,Switch, ScrollView  } from 'react-native'
import { HelperText,TextInput as InputPaper } from 'react-native-paper';

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

// const [name,setName] = useState("")
// const [email,setEmail] = useState("")
// const [password,setPassword] = useState("")
// const [phoneNumber,setPhoneNumber] = useState("")

const validaPassword = () => {
  // if(props.InputsDriver.password.length >= 6)
  //   {		
  //     var mayuscula = false;
  //     var minuscula = false;
  //     var numero = false;
      
  //     for(var i = 0;i<props.InputsDriver.password.length;i++)
  //     {
  //       if(props.InputsDriver.password.charCodeAt(i) >= 65 && props.InputsDriver.password.charCodeAt(i) <= 90)
  //       {
  //         mayuscula = true;
  //       }
  //       else if(props.InputsDriver.password.charCodeAt(i) >= 97 && props.InputsDriver.password.charCodeAt(i) <= 122)
  //       {
  //         minuscula = true;
  //       }
  //       else if(props.InputsDriver.password.charCodeAt(i) >= 48 && props.InputsDriver.password.charCodeAt(i) <= 57)
  //       {
  //         numero = true;
  //       }

  //     }
  //     if(mayuscula == true)
  //     {
  //       if(minuscula == true)
  //       {
  //         if(numero == true){
  //           return true
  //         }
  //         else{
  //           return false
  //         }
  //       }
  //       else{
  //         return false
  //       }
        
  //     }
  //     else{
  //       return false
  //     }
  //   }
  //   return false

  return props.InputsDriver.password.includes('a');
  };

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
        onChangeText={(name)=> setName(name)} 
        style={styles.input}/> 
        <TextInput 
        placeholder="   Correo" 
        placeholderTextColor="gray" 
        onChangeText={(email)=> setEmail(email)} 
        style={styles.input}/> 
      <TextInput 
        placeholder="   Contaseña" 
        placeholderTextColor="gray" 
        onChangeText={(password)=> props.InputsDriver.setPassword(password)}
        style={styles.input} 
        secureTextEntry= {true}/> 
          <HelperText visible={validaPassword()}  style={styles.textoPassword}> Longitud minima de 6 caracteres, y contener al menos una letra mayúscula, una minúscula y un dígito </HelperText>
        <TextInput 
        placeholder="   Telefono" 
        placeholderTextColor="gray" 
        onChangeText={(phoneNumber)=> setPhoneNumber(phoneNumber)}
        style={styles.input} 
        secureTextEntry= {true}/> 
        <TextInput 
        placeholder="   Marca Vehiculo" 
        placeholderTextColor="gray" 
        onChangeText={(phoneNumber)=> setPhoneNumber(phoneNumber)}
        style={styles.input} 
        secureTextEntry= {true}/> 
      <Pressable  style={styles.boton} onPress={()=> login({variables:{email,password, name, phoneNumber}})} >
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

//   const [name,setName] = useState("")
// const [email,setEmail] = useState("")
// const [password,setPassword] = useState("")
// const [phoneNumber,setPhoneNumber] = useState("")

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
          onChangeText={(name)=> setName(name)} 
          style={styles.input}/> 
          <TextInput 
          placeholder="   Correo" 
          placeholderTextColor="gray" 
          onChangeText={(email)=> setEmail(email)} 
          style={styles.input}/> 
        <TextInput 
          placeholder="   Contaseña" 
          placeholderTextColor="gray" 
          onChangeText={(password)=> setPassword(password)}
          style={styles.input} 
          secureTextEntry= {true}/> 
        <TextInput 
          placeholder="   Telefono" 
          placeholderTextColor="gray" 
          onChangeText={(phoneNumber)=> setPhoneNumber(phoneNumber)}
          style={styles.input} 
          secureTextEntry= {true}/> 
        <Pressable  style={styles.boton} onPress={()=> login({variables:{email,password, name, phoneNumber}})} >
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
const [shouldShowChofer, setShouldShowChofer] = useState(true);
const [shouldFirstRender, setShouldFirstRender] = useState(true);

  return (
    <View style={styles.contenedor}> 
        {
          evaluateStack({shouldFirstRender,shouldShowChofer,setShouldShowChofer,setShouldFirstRender,InputsDriver:{name,setEmail,email,setEmail,password,setPassword,phoneNumber,setPhoneNumber}})
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
    height:500,
    // flex:1,
    // borderWidth:2,
    // borderColor: 'red',
    justifyContent: "center",
    alignItems: "center",
    // width: '100%'
  }
})
