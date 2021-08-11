import React , {useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Card, Title, Paragraph } from 'react-native-paper'

export const CardTripInfo = (props) => {
    useEffect(() => {
        console.log(props)
    }, [])
    return (
        <View>
            {/* <Card.Content> */}
                <Text>{props.plate}</Text>
                {/* <Paragraph> */}
                    <Text>{props.brand} {props.model}</Text>
                    <Text>{props.name}</Text>
                    <Text>{props.rating}</Text>
                    {/* <Text>{props.service.name}</Text> */}
                {/* </Paragraph> */}
            {/* </Card.Content> */}
        </View>
    )
}

const styles = StyleSheet.create({})
