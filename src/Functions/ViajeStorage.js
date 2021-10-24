import AsyncStorage from '@react-native-community/async-storage'

export const viajeKey = '@viaje_key';

export const SetViaje = async(data) => {
    try {
        await AsyncStorage.setItem(viajeKey, JSON.stringify(data))
        console.log('viaje setted');
    } catch (error) {
        console.log('Setting error viaje:')
        console.log(error)
    }
}

export const GetViaje = async() => {
    try {
        const viaje = await AsyncStorage.getItem(viajeKey)
        console.log('viaje got');
        return JSON.parse(viaje)
    } catch (error) {
        console.log('Getting error viaje:')
        console.log(error)
        return 'No token'
    }
}

export const DeleteViaje = async () => {
    try {
        await AsyncStorage.removeItem(viajeKey)
        console.log('Item removed viaje')
    } catch (error) {
        console.log('Deleting error viaje:')
        console.log(error)        
    }
}