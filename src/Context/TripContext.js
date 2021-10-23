import React, { useState, useEffect, useMemo } from 'react'
import { GetTrip } from '../Functions/TripStorage';

export const TripContext = React.createContext();

export const TripProvider = (props) => {
    //State
    const [trip, setTrip] = useState(null);
    // const [trip, setTrip] = useState(
    // {"id": 28,
    // "chatId": 74,
    //   "opt": 7347,
    //   "driver": {
    //     "id": 2,
    //     "name": "Paul Conde",
    //     "plate": "VBX1938",
    //     // "photoUrl": "https://amadeus-bucket.s3.amazonaws.com/images/20210926-5sj98-vin"
    //     "photoUrl": ""
    //   },
    //   "passenger": {
    //     "id": 8,
    //     "name": "Jesus Morales"
    //   },
    //   "tripStatus": {
    //     "id": 2,
    //     "tripStatus": "Terminado"
    //   },
    //   "commissionType": {
    //     "id": 1,
    //     "commissionType": "Porcentaje"
    //   },
    //   "paymentMethod": {
    //     "id": 1,
    //     "paymentMethod": "Efectivo",
    //     "icon": "car"
    //   },
    //   "promocode": {
    //     "id": 1,
    //     "code": "BIMODEFAULT",
    //     "discount": 10
    //   },
    //   "commission": null,
    //   "commissionValue": null,
    //   "createdAt": "2021-9-28",
    //   "currency": "MXN",
    //   "originVincity": "Prol. Álvaro Obregón 2667, Primer Cuadro, 80000 Culiacán Rosales, Sin., Mexico",
    //   "originLocationLat": 24.809,
    //   "originLocationLng": -107.395,
    //   "destinationVincity": "Jose, Diego Valadés Ríos 1676, Desarrollo Urbano Tres Ríos, 80000 Culiacán Rosales, Sin., Mexico",
    //   "destinationLocationLat": 24.8147,
    //   "destinationLocationLng": -107.4,
    //   "discount": null,
    //   "distance": 2,
    //   "pickedUpAt": "2021-09-28T18:36:23-06:00",
    //   "droppedOffAt": null,
    //   "fee": 16.0536,
    //   "feeTaxed": 18.0696,
    //   "feedback": null,
    //   "note": "",
    //   "rating": null,
    //   "rawfee": 12.6,
    //   "tax": null,
    //   "tripPolyline": "kolvCnonnSPARbDXxEPfDDlCGdKDdE{AF}ARWTKPAT?dAIVKJGDoE\\g@DkIl@uGh@kAAECmDWqAUc@ISQc@_@SWMk@As@PkAx@qAb@u@LQNKLIFAR?^h@r@`ALMpAaA"
    // }
    // );
    //Did mount
    // useEffect(() => {
    //     GetTrip()
    //     .then((data) => {
    //         console.log(data)
    //         setTrip(data)
    //     })
    //     .catch((err) => console.log(err))
    // }, [])
    
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