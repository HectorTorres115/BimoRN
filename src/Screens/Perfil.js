import React, {useState,useEffect,useRef} from 'react'
import { StyleSheet,  View, TextInput, Button , Text } from 'react-native'
import { Avatar, BottomNavigation  } from 'react-native-paper'
import { useUsuario } from '../Context/UserContext'

const BasicInfoRoute = () => {
    const {usuario, setUser} = useUsuario();
return(    
    <View style={styles.container}>
        <Avatar.Image size={150} source={require('../../assets/images/avatar.jpg')} style= {{marginTop:10}}/>     
        <View style={styles.inputContainer}> 
            <Text style={styles.Text}>Nombre</Text>
            <TextInput 
            placeholder="   Nombre" 
            value = {usuario.name}
            editable={false}
            style={styles.input}/> 
        </View>
        <View style={styles.inputContainer}> 
            <Text style={styles.Text}>Correo</Text>
            <TextInput 
            placeholder="   Correo" 
            value = {usuario.email}
            editable={false}
            style={styles.input}/> 
        </View>
        <View style={styles.inputContainer}> 
            <Text style={styles.Text}>Telefono</Text>
            <TextInput 
            placeholder="   Telefono" 
            value = {usuario.phoneNumber}
            editable={false}
            style={styles.input}/>     
        </View>
    </View>
)};

const CarInfoRoute = () => {
    const {usuario, setUser} = useUsuario();
    return(    
        <View style={styles.container}>
            <Avatar.Image size={150} source={require('../../assets/images/avatar.jpg')} style= {{marginTop:10}}/> 
            <View style={styles.inputContainer}> 
                <Text style={styles.Text}>Marca</Text>      
                <TextInput 
                placeholder="   Marca" 
                value = {usuario.brand}
                editable={false}
                style={styles.input}/> 
            </View>
            <View style={styles.inputContainer}> 
                <Text style={styles.Text}>Modelo</Text>
                <TextInput 
                placeholder="   Modelo" 
                value = {usuario.model}
                editable={false}
                style={styles.input}/> 
            </View>
            <View style={styles.inputContainer}> 
                <Text style={styles.Text}>Placa</Text>
                <TextInput 
                placeholder="   Placa" 
                value = {usuario.plate}
                editable={false}
                style={styles.input}/>    
            </View>
            <View style={styles.inputContainer}> 
                <Text style={styles.Text}>Servicio</Text>
                <TextInput 
                placeholder="   Servicio" 
                value = {usuario.service.name}
                editable={false}
                style={styles.input}/>  
            </View>
        </View>
    )};

export const Perfil = (props) => {
const [index, setIndex] = useState(0);
//Global states
const {usuario, setUser} = useUsuario();

const [routes] = React.useState([
    { key: 'binfo', title: 'Informacion Basica', icon: 'text-box-outline' },
    { key: 'cinfo', title: 'Informacion Vehiculo', icon: 'car-cog' },
]);

const [routesPassenger] = React.useState([
    { key: 'binfo', title: 'Informacion Basica' },
]);

  const renderScene = BottomNavigation.SceneMap({
    binfo: BasicInfoRoute,
    cinfo: CarInfoRoute,
  });

  const renderScenePassenger = BottomNavigation.SceneMap({
    binfo: BasicInfoRoute,
  });

  function EvaluateNavigation() {
    if(usuario.__typename=="Passenger"){
        return (
            // <BottomNavigation
            // navigationState={{ index, routesPassenger }}
            // onIndexChange={setIndex}
            // renderScene={renderScenePassenger}
            // style={styles.Nav}
            // />
            <View style={styles.container}>
                <Avatar.Image size={150} source={require('../../assets/images/avatar.jpg')} style= {{marginTop:10}}/>  
                <View style={styles.inputContainer}>
                    <Text style={styles.Text}>Nombre</Text>
                    <TextInput 
                    placeholder="   Nombre" 
                    value = {usuario.name}
                    editable={false}
                    style={styles.input}/> 
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.Text}>Correo</Text>
                    <TextInput 
                    placeholder="   Correo" 
                    value = {usuario.email}
                    editable={false}
                    style={styles.input}/> 
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.Text}>Telefono</Text>
                    <TextInput 
                    placeholder="   Telefono" 
                    value = {usuario.phoneNumber}
                    editable={false}
                    style={styles.input}/>     
                </View>
            </View>
        )
    }else if (usuario.__typename=="Driver"){
        return (
            <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            barStyle={styles.Nav}
            />
        )
    }
  } 

    return (
        <>
        <EvaluateNavigation  />
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        width:'100%',
        height:'100%',
        alignItems: 'center',
        backgroundColor: 'white',
        // borderWidth:5,
        // borderColor:'blue'
    },
    inputContainer:{
        width:'100%',
        justifyContent:'center',
        // alignItems: 'center',
        backgroundColor: 'white',
        margin: 5,
        // borderWidth:5,
        // borderColor:'red'
    },
    Nav:{
        backgroundColor: 'lightblue'
    },  
    input:{
      backgroundColor:"white",
      borderRadius:5,
      borderWidth:2,
      borderColor:"gray",
      fontSize:15,
      color: "black",
      width: '95%',
      borderRadius:5,
      margin: 10
    },
    Text:{
        marginLeft: 10,
        fontSize:15,
        // alignItems: 'flex-start'
    }

})
