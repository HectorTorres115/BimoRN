import React, {useState, useRef, useEffect }  from 'react'
import { StyleSheet, Text, View , Button } from 'react-native'
import { DataTable , TextInput  } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker';

export const Viajes = ({navigation}) => {

    const [date, setDate] = useState(new Date(1598051730000));
    const [dateinicio, setDateInicio] = useState(new Date());
    const [datefin, setDateFin] = useState(new Date());
    const [mode, setMode] = useState(false);
    const [show, setShow] = useState(false);

    function onChange (event, selectedDate){
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        if(mode === true){
            setDateInicio(currentDate);
            setDate(currentDate);
            setShow(false);
        }
        else{
            setDateFin(currentDate);
            setDate(currentDate);
            setShow(false);
        }
        
      };
    
    //   function showMode (currentMode)  {
    //     setShow(true);
    //     setMode(currentMode);
    //   };
    
      function showDatepickerInicio () {
        setShow(true);
        setMode(true);
      }

      function showDatepickerFin () {
        setShow(true);
        setMode(false);
      }
    
    

    return (
        <View style = {styles.container}>
            <DataTable>
                <DataTable.Row>
                {/* <Button onPress={showDatepicker} title="Show date picker!" /> */}
                    <DataTable.Cell style = {styles.text}> <TextInput ></TextInput>{dateinicio} </DataTable.Cell>
                    <DataTable.Cell style = {styles.text}><TextInput ></TextInput>{datefin} </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                {/* <Button onPress={showTimepicker} title="Show time picker!" /> */}
                    <DataTable.Cell style = {styles.text}> 
                        <Button onPress={showDatepickerInicio()} title="Fecha Inicio" /> 
                    </DataTable.Cell>
                    <DataTable.Cell style = {styles.text}> 
                        <Button onPress={showDatepickerFin()} title="Fecha Fin" /> 
                    </DataTable.Cell>
                </DataTable.Row>                
            </DataTable>
            <View>
            {show && (
                <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode='date'
                is24Hour={true}
                display="default"
                onChange={onChange}
                />
                )}
            </View>
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
        marginTop:20,
        width:'100%'
    },
    datePickerStyle: {
        width: 200,
        marginTop: 20,
      },
})
