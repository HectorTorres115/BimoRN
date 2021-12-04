import React, { useState, useMemo, useEffect} from 'react'
import { GetViaje } from '../Functions/ViajeStorage';

export const ViajeContext = React.createContext();

export const viajeDefaultState = {
    tripPolyline: null,
    driverPolyline: [],
    indexdriver: null,
    indexorigin: null,
    indexdestination: null,
    paymentMethod: null,
    service: null,
    route: {
        startAdress: null,
        endAdress: null,
        polyline: null,
        distance: null,
        time: null
    },
    origin: {
        name: null,
        placeId: null
    },
    destination: {
        name: null,
        placeId: null
    }
}

export const ViajeProvider = (props) => {
    //State
    const [viaje, setViaje] = useState(viajeDefaultState);
    //Did mount
    useEffect(() => {
        GetViaje()
        .then((data) => {
            // console.log(data)
            if(data !== null){
                setViaje(data)
            }
        })
        .catch((err) => console.log(err))
    }, [])

    const value = useMemo(() => {
        return ({
            viaje,
            setViaje
        })
    }, [viaje, setViaje])

    return <ViajeContext.Provider value={value} {...props} />
}
//Export consumer
export const ViajeConsumer = ViajeContext.Consumer
//Custom hook created in context
export const useViaje = () => {
    const context = React.useContext(ViajeContext);
    if (!context) {
        throw new Error('useViaje debe estar dentro del proveedor ViajeContext')
    }
    return context
}