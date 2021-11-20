import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import gql from 'graphql-tag'
import {useMutation} from 'react-apollo'
import { useStripe } from '@stripe/stripe-react-native'

const CREATE_PAYMENT_INTENT = gql`
mutation create_payment_intent($amount: Float!){
  CreatePaymentIntent(amount: $amount)
}
`

export function Payment() {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [ paymentResponse, setPaymentResponse ] = useState(null);

    const [create_payment_intent] = useMutation(CREATE_PAYMENT_INTENT, {
        onCompleted: (data) => {
            console.log(data);
            setPaymentResponse(data.CreatePaymentIntent)
        },
        onError: (err) => {
            console.log(err);
        }
    })


    return (
        <View>
            <Text></Text>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
