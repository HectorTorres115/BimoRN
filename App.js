import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ApolloProvider } from 'react-apollo'
import { client } from './src/Clients/client'
import { UsuarioProvider , useUsuario } from './src/Context/UserContext'

//pantallas
import { Login } from './src/Screens/Login'
import { Registro } from './src/Screens/Registro'
import { Mapas } from './src/Screens/Mapas'
import { Animation } from './src/Screens/Animation'
// import SplashScreen from './Screens/SplashScreen';
//React native paper provider
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
  },
};

const LoginStack = createStackNavigator();
const MainStack = createStackNavigator();


const LoginStackScreen = ()=> (
  <LoginStack.Navigator headerMode='none' >
    <LoginStack.Screen name="Login" component={Login} />
    <LoginStack.Screen name="Register" component={Registro} />
  </LoginStack.Navigator>
)

const MainStackScreen = ()=> (
  <MainStack.Navigator headerMode='none' initialRouteName={'Mapas'}>
    <MainStack.Screen name="Mapas" component={Mapas} />
    <MainStack.Screen name="Animation" component={Animation} />
  </MainStack.Navigator>
)

export default ()=> (
  <PaperProvider theme = {theme}>
  <UsuarioProvider>
    <App></App>
  </UsuarioProvider>
  </PaperProvider>
)

function App() {
  const {usuario} = useUsuario();
  console.log(usuario);
  if(usuario == null){
    return (
      <ApolloProvider client={client} >
        <NavigationContainer>
          <LoginStackScreen/>
        </NavigationContainer>
      </ApolloProvider>
    )
  } else{
    return(
      <ApolloProvider client={client} >
        <NavigationContainer>
          <MainStackScreen/>
        </NavigationContainer>
      </ApolloProvider>
    )
  }

}
