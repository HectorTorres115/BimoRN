import React, {useState, useEffect} from 'react'
import gql from 'graphql-tag'
import {useLazyQuery} from 'react-apollo'
import DatePicker from 'react-native-datepicker'


const currentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const defDate = `${year}-${month}-${day}`
    return defDate
};

export const DateFetcher = ({props}) => {
    //Component did mount
    useEffect(() => {
        console.log('Did mount')
        console.log('PROPS: ' + {props})
    }, [])

    //State
    const [date, setDate] = useState(currentDate());

    

    //OnChange DatePicker
    const fetch_date_msgs = (date) => {
        if(date == currentDate()){
            console.log('SAME DATE')
            props.setter_today(true)
            setDate(date)
        } else {
            console.log('DIFF DATE');
            props.setter_today(false)
            setDate(date)
        }
        setDate(date)
        console.log(date)
        // getdatemessages({variables: {type: props.type, date}})
    }

    return (
        <DatePicker
            onDateChange={(date) => fetch_date_msgs(date)}
            style={{width: '100%', backgroundColor: 'black'}}
            date = {date}
            mode="date"
            placeholder="Seleccionar fecha de mensajes"
            placeholderTextColor="black"
            format="YYYY-M-D"
            maxDate={currentDate()}
            showIcon = {false}
            confirmBtnText="Ver mensajes"
            cancelBtnText="Cancelar"
            customStyles={{
            dateInput: {
                backgroundColor: 'white'
            }
            }}
        />
    )
}