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
import { FindAddress } from './src/Screens/FindAddress'
import { FixToCenter } from './src/Screens/FixToCenter'
import { Chat } from './src/Screens/Chat'
import { Perfil } from './src/Screens/Perfil'
import { Tracking } from './src/Screens/Tracking';
// import SplashScreen from './Screens/SplashScreen';
//React native paper provider
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service'
import ReduxLocationStore from './src/Redux/Redux-location-store';
import { set_location } from './src/Redux/Redux-actions';

//Stripe
import { StripeProvider } from '@stripe/stripe-react-native';
import { stripeUrl } from './src/Clients/client-config'

const LoginStack = createStackNavigator();
const MainStack = createStackNavigator();
const DriverStack = createStackNavigator();
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
  <MainStack.Navigator headerMode='none' initialRouteName={'Tracking'}>
    <MainStack.Screen name="Mapas" component={Mapas} />
    <MainStack.Screen name="Animation" component={Animation} />
    <MainStack.Screen name="Registro" component={Registro} />
    <MainStack.Screen name="FindAddress" component={FindAddress} />
    <MainStack.Screen name="MapCamera" component={MapCamera} />
    <MainStack.Screen name="FixToCenter" component={FixToCenter} />
    <MainStack.Screen name="Chat" component={Chat} />
    <MainStack.Screen name="Perfil" component={Perfil} />
    <MainStack.Screen name="Tracking" component={Tracking} />
  </MainStack.Navigator>
)

const DriverStackScreen = ()=> (
  <DriverStack.Navigator headerMode='none' initialRouteName={'Tracking'}>
    <DriverStack.Screen name="MapasDriver" component={MapasDriver} />
    <DriverStack.Screen name="Perfil" component={Perfil} />
    <DriverStack.Screen name="Chat" component={Chat} />
    <DriverStack.Screen name="Tracking" component={Tracking} />
  </DriverStack.Navigator>
)

export default ()=> (
  <StripeProvider publishableKey={stripeUrl}>
  <PaperProvider>
  <UsuarioProvider>
  <AddressProvider>
    <App></App>
  </AddressProvider>
  </UsuarioProvider>
  </PaperProvider>
  </StripeProvider>
)

function App() {

  const geolocationConfig = {
    enableHighAccuracy: true, 
    distanceFilter: 0, 
    useSignificantChanges: false, 
    maximumAge: 0
  }

  Geolocation.watchPosition(
    // ({coords}) => {setAddress(coords)},
    ({coords}) => {
      ReduxLocationStore.dispatch(set_location(coords))
    },
    (error) => {console.log(error)},
    {options: geolocationConfig}
  )

  const {setAddress} = useAddress();
    
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
