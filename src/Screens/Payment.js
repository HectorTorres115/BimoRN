import React, {useState} from 'react'
import { StyleSheet, Text, View, Button, Alert } from 'react-native'
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
    const [ paymentResponse, setPaymentResponse ] = useState();

    const initializePaymentSheet = async (data) => {
        try {
            await initPaymentSheet({
                customerId: data.customer,
                customerEphemeralKeySecret: data.ephemeralKey,
                paymentIntentClientSecret: data.paymentIntent,
                allowsDelayedPaymentMethods: true
              });
        } catch (error) {
            console.log(error);
        }
      };

      const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();
    
        if (error) {
          Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
          Alert.alert('Success', 'Your order is confirmed!');
        }
      };

    const [create_payment_intent] = useMutation(CREATE_PAYMENT_INTENT, {
        onCompleted: (data) => {
            setPaymentResponse(data.CreatePaymentIntent)
        },
        onError: (err) => {
            console.log(err);
        }
    })


    return (
        <View style = {styles.main}>
            <Text style = {styles.text}>Payment page</Text>
            <Button title = 'Pay' onPress = {async () => {
                create_payment_intent({variables: {amount: 50}
                }).then(res => {
                    // console.log(res.data.CreatePaymentIntent);
                    initializePaymentSheet(res.data.CreatePaymentIntent).then(() => {
                        openPaymentSheet();
                    })
                })
            }}/>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'darkblue'
    },
    text: {
        fontSize: 20,
        color: 'white'
    }
})
