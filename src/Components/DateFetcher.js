import React, {useState, useEffect} from 'react'
import gql from 'graphql-tag'
import {useLazyQuery} from 'react-apollo'
import DatePicker from 'react-native-datepicker'

const get_date_messages = gql`
query getdatemessages($type: String!, $date: String!) {
  GetDateMessages(input: { type: $type, date: $date }) {
    id
    user
    message
    type
    date
    hour
    longitude
    latitude
  }
}
`

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
    //Get date messages query
    const [getdatemessages] = useLazyQuery(get_date_messages, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            console.log(data);
            props.setter_messages(data.GetDateMessages)
        },
        onError: (err) => {
            console.log(err);
        }
    })
    //OnChange DatePicker
    const fetch_date_msgs = (date) => {
        if(date == currentDate()){
            console.log('SAME DATE')
            props.setter_today(true)
        } else {
            console.log('DIFF DATE');
            props.setter_today(false)
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