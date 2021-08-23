import React, { useState, useEffect, useMemo } from 'react'

export const AddressContext = React.createContext();

export const AddressProvider = (props) => {
    //State
    const [address, setAddress] = useState(null);
    //Did mount
    
    const value = useMemo(() => {
        return({
            address,
            setAddress
        })
    }, [address, setAddress])

    return <AddressContext.Provider value = {value} {...props}/>
}
//Export consumer
export const AddressConsumer = AddressContext.Consumer
//Custom hook created in context
export const useAddress = () => {
    const context = React.useContext(AddressContext);
    if(!context){
        throw new Error('useAddress debe estar dentro del proveedor AddressContext')
    } 
    return context
}