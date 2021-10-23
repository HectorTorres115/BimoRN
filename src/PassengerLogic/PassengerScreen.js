import React, { useEffect, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useQuery, useMutation } from 'react-apollo'
import { CURRENT_ADDRESS, DRAW_ROUTE, CREATE_TRIP } from './Request'
import { styles } from './Styles'
import { HandleError } from './Util'

export function PassengerScreen(props) {

    
    useEffect(() => {
        console.log('Component did mount (PassengerScreen)')
    }, [])

    return (
        <View>
            <Text></Text>
        </View>
    )
}