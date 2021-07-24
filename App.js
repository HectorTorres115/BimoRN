import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ApolloProvider } from 'react-apollo'
import { client } from './src/Clients/client'
import { UsuarioProvider , useUsuario } from './src/Context/UserContext'
import { AddressProvider , useAddress } from './src/Context/AddressContext'

//pantallas
import { Login } from './src/Screens/Login'
import { LoginDriver } from './src/Screens/LoginDriver'
import { MapasDriver } from './src/Screens/MapasDriver'
import { Registro } from './src/Screens/Registro'
import { Mapas } from './src/Screens/Mapas'
import { MapCamera } from './src/Screens/MapCamera'
import { Animation } from './src/Screens/Animation'
import { FindAddress } from './src/Screens/FindAddress';
// import SplashScreen from './Screens/SplashScreen';
//React native paper provider
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// import Geolocation from '@react-native-community/geolocation'
import Geolocation from 'react-native-geolocation-service'

const theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: "#16A0DB"
  },
};

const LoginStack = createStackNavigator();
const MainStack = createStackNavigator();
// const LoginStack = createDrawerNavigator();
// const MainStack = createDrawerNavigator();


const LoginStackScreen = ()=> (
  <LoginStack.Navigator headerMode='none' >
    <LoginStack.Screen name="Login" component={Login} />
    <LoginStack.Screen name="LoginDriver" component={LoginDriver} />
    <LoginStack.Screen name="Register" component={Registro} />
  </LoginStack.Navigator>
)

const MainStackScreen = ()=> (
  <MainStack.Navigator headerMode='none' initialRouteName={'Mapas'}>
    <MainStack.Screen name="Mapas" component={Mapas} />
    <MainStack.Screen name="Animation" component={Animation} />
    <MainStack.Screen name="Registro" component={Registro} />
    <MainStack.Screen name="FindAddress" component={FindAddress} />
    <MainStack.Screen name="MapCamera" component={MapCamera} />
  </MainStack.Navigator>
)

const DriverStackScreen = ()=> (
  <DriverStack.Navigator headerMode='none' initialRouteName={'MapasDriver'}>
    <DriverStack.Screen name="MapasDriver" component={MapasDriver} />
  </DriverStack.Navigator>
)

export default ()=> (
  <PaperProvider theme = {theme}>
  <UsuarioProvider>
  <AddressProvider>
    <App></App>
  </AddressProvider>
  </UsuarioProvider>
  </PaperProvider>
)

function App() {

  const {setAddress} = useAddress();
  
  Geolocation.watchPosition((info) => {
    //  console.log(info.coords);
    setAddress(info.coords);
    //setOrigin(info.coords);
    }, (error) => console.log(error),
    {enableHighAccuracy: true, distanceFilter: 0, useSignificantChanges: false, maximumAge: 0})

  
  const {usuario} = useUsuario();
  // console.log(usuario);
  if(usuario == null){
    return (
      <ApolloProvider client={client} >
        <NavigationContainer>
          <LoginStackScreen/>
        </NavigationContainer>
      </ApolloProvider>
    )
  } else{
    if(usuario.__typename=="Passenger"){
        return(
          <ApolloProvider client={client} >
            <NavigationContainer>
              <MainStackScreen/>
            </NavigationContainer>
          </ApolloProvider>
        )
    }else if (usuario.__typename=="Driver"){
      
      return(
        <ApolloProvider client={client} >
          <NavigationContainer>
            <DriverStackScreen/>
          </NavigationContainer>
        </ApolloProvider>
      )
    }
  }

}
