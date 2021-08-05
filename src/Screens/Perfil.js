import React, {useState, useEffect, useRef} from 'react'
import { StyleSheet,  View, TextInput, Button , Text, ScrollView } from 'react-native'
import { Avatar, BottomNavigation  } from 'react-native-paper'
import { useUsuario } from '../Context/UserContext'
import { handleAndroidBackButton, backAction } from '../Functions/BackHandler'
import {CardField} from '@stripe/stripe-react-native'
import AsyncStorage from '@react-native-community/async-storage'

const BasicInfoRoute = () => {
const [card, setCard] = useState({});
const {usuario} = useUsuario();
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

        <View style = {styles.inputContainer}>
                <CardField
                postalCodeEnabled={true}
                placeholder={{number: '4141 4141 4141 4141'}}
                cardStyle={{backgroundColor: '#FFFFFF', textColor: '#000000'}}
                style={{ width: '100%', height: 50, marginVertical: 30}}
                onCardChange={(card) => setCard(card)}
                />
                <Button title = 'Save Card' onPress = {async () => {
                    await AsyncStorage.setItem('@card_obj', JSON.stringify(card))
                }}/>
                <Button title = 'Get Card' onPress = {async () => {
                    try {
                        const card = await AsyncStorage.getItem('@card_obj')
                        console.log(card)
                    } catch (error) {
                        console.log(error)
                    }
                }}/>
                <Button color = 'red' title = 'Delete Card' onPress = {async () => {
                    await AsyncStorage.removeItem('@card_obj')
                }}/>
        </View>
    </View>
)};

const CarInfoRoute = () => {
    const {usuario, setUser} = useUsuario();
    const [card, setCard] = useState([]);
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
    //Lifecycle methods
    useEffect(() => {
        AsyncStorage.getItem('@Card').then((card) => console.log(card))
        handleAndroidBackButton(() => props.navigation.goBack())
        return () => {
            handleAndroidBackButton(() => backAction(setUser))
        }
    }, [])

const [index, setIndex] = useState(0);
//Global states
const {usuario, setUser} = useUsuario();

const [routes] = React.useState([
    { key: 'binfo', title: 'Informacion Basica', icon: 'text-box-outline' },
    { key: 'cinfo', title: 'Informacion Vehiculo', icon: 'car-cog' },
]);

  const renderScene = BottomNavigation.SceneMap({
    binfo: BasicInfoRoute,
    cinfo: CarInfoRoute,
  });

  function EvaluateNavigation() {
    if(usuario.__typename=="Passenger"){
        return (
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
    scrollContainer: {
        // height: 800,
        justifyContent: 'center',
        alignItems: 'center'     
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
