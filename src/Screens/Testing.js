import React, {useState} from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import MotionSlider from 'react-native-motion-slider'

export default function Testing() {
    const [value, setValue] = useState(0);
    return (
        <View style = {styles.container}>
            <MotionSlider
            min={0} 
            max={40}
            value = {value}
            decimalPlaces={10}
            units={'º'}
            backgroundColor={['#16A0DB', '#e3d912', '#32a852']}
            firstMessage = {'Teminar Viaje'}
            secondMessage = {'Terminando Viaje'}
            finalMessage = {'Viaje Terminado'}
      />

      <Button title = 'Debug value' onPress = {() => console.log(value)}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center'
    }
})
