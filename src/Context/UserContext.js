import React, { useState, useEffect, useMemo } from 'react'
import { GetUser } from '../Functions/UserStorage'

export const UsuarioContext = React.createContext();

export const UsuarioProvider = (props) => {
    //State
    const [usuario, setUser] = useState(null);
    //Did mount
    useEffect(() => {
        GetUser()
        .then((data) => {
            setUser(data)
        })
        .catch((err) => console.log(err))
    }, [])
    
    const value = useMemo(() => {
        return({
            usuario,
            setUser
        })
    }, [usuario, setUser])

    return <UsuarioContext.Provider value = {value} {...props}/>
}
//Export consumer
export const UserConsumer = UsuarioContext.Consumer
//Custom hook created in context
export const useUsuario = () => {
    const context = React.useContext(UsuarioContext);
    if(!context){
        throw new Error('useUsuario debe estar dentro del proveedor UsuarioContext')
    } 
    return context
}