import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import { Button } from 'react-native-paper';

export const DrawerItem = (props) => {
    const [screens, setScreens] = useState([
      {id: 1, name: "Maps", icon: "google-maps"},
    ]);
    return (
        <DrawerContentScrollView {...props}>
          {/* <DrawerItemList {...props} /> */}
          {screens.map((screen) => {
            return (
              <Button icon={screen.icon} 
              mode="contained" 
              style = {styles.separation} 
              key = {screen.id}
              onPress={() => props.navigation.navigate(`${screen.name}`)}>
                  {screen.name}
              </Button>
            )
          })}
        </DrawerContentScrollView>
      );
}

const styles = StyleSheet.create({
    separation: {
        margin: 10
    }
})
