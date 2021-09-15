import React, {useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { DataTable } from 'react-native-paper'

export const ResumenViaje = ({navigation}) => {

    const [originvincity, setOriginVincity] = useState('C. Espino 5080, 80058 Culiacán Rosales, Sin., Mexico');
    const [destinationvincity, setDestinationVincity] = useState('Catedral, Prol. Álvaro Obregón, Primer Cuadro, 80000 Culiacán Rosales, Sin., Mexico');
    const [fee, setFee] = useState(80);
    const [feetaxed, setFeeTaxed] = useState(92.8);
    const [commission, setCommission] = useState(72);
    const [rawfee, setRawfee] = useState(80);
    const [tax, setTax] = useState('16%');
    const [distance, setDistance] = useState('10.5km');

    return (
        <View style = {styles.container}>
            <Text style = {styles.text}>De: {originvincity}</Text>
            <Text style = {styles.text}>Hasta: {destinationvincity}</Text>
            <DataTable style = {styles.tablecontainer}> 
                <DataTable.Row>
                    <DataTable.Cell style = {styles.text1}>Distancia:</DataTable.Cell>
                    <DataTable.Cell style = {styles.text2}>{distance}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell style = {styles.text1}>Subtotal:</DataTable.Cell>
                    <DataTable.Cell style = {styles.text2}>{fee}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell style = {styles.text1}>Comision:</DataTable.Cell>
                    <DataTable.Cell style = {styles.text2}>{commission}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell style = {styles.text1}>Total:</DataTable.Cell>
                    <DataTable.Cell style = {styles.text2}>{feetaxed}</DataTable.Cell>
                </DataTable.Row>
            </DataTable>            
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        //alignItems: 'center',
        width:'100%'
    },
    tablecontainer: {
        // justifyContent: 'center',
        //alignItems: 'center',
        width:'100%',
        marginTop:20
    },
    text: {
        fontSize: 20,
        color: 'black',
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:20
    },
    text1: {
        fontSize: 20,
        color: 'black',
        margin: 5,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    text2: {
        fontSize: 20,
        color: 'black',
        margin: 5,
        alignItems: 'center',
        justifyContent:'flex-end'
    },
})

