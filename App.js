<<<<<<< HEAD
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
=======
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
// import SplashScreen from './Screens/SplashScreen';

const LoginStack = createStackNavigator();
const MainStack = createStackNavigator();


const LoginStackScreen = ()=> (
  <LoginStack.Navigator headerMode='none' >
    <LoginStack.Screen name="Login" component={Login} />
    <LoginStack.Screen name="Register" component={Registro} />
  </LoginStack.Navigator>
)

const MainStackScreen = ()=> (
  <MainStack.Navigator headerMode='none'>
    <MainStack.Screen name="Mapas" component={Mapas} />
  </MainStack.Navigator>
)

export default ()=> (
  <UsuarioProvider>
    <App></App>
  </UsuarioProvider>
)

function App() {
  const {usuario} = useUsuario();

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
>>>>>>> a77b2b6158a9353d0e74a93a3bfe369a08caadeb
