import React from 'react'
import { StyleSheet, View } from 'react-native'
import { FAB } from 'react-native-paper'

export const Fab = ({navigation}) => {
    return (
        <View style={styles.fabContainer}>
        <FAB
        style={styles.fab}
        icon="menu"
        onPress={() => navigation.toggleDrawer()}
        />
    </View>  
    )
}

const styles = StyleSheet.create({
    fab: {
        //   position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: "#16A0DB"
        },
        fabContainer:{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            height: "10%",
            width: "20%"
        },
})
