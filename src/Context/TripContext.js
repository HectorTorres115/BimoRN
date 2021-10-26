import React, { useState, useEffect, useMemo } from 'react'
import { GetTrip } from '../Functions/TripStorage';

export const TripContext = React.createContext();

export const TripProvider = (props) => {
    //State
    const [trip, setTrip] = useState(null);
    //Did mount
    useEffect(() => {
        GetTrip()
        .then((data) => {
            // console.log(data)
            if(data !== null){
                setTrip(data)
            }
        })
        .catch((err) => console.log(err))
    }, [])
    
    const value = useMemo(() => {
        return({
            trip,
            setTrip
        })
    }, [trip, setTrip])

    return <TripContext.Provider value = {value} {...props}/>
}
//Export consumer
export const TripConsumer = TripContext.Consumer
//Custom hook created in context
export const useTrip = () => {
    const context = React.useContext(TripContext);
    if(!context){
        throw new Error('useTrip debe estar dentro del proveedor TripContext')
    } 
    return context
}