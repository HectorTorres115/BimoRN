import AsyncStorage from '@react-native-community/async-storage'

export const tripKey = '@trip_key';

export const SetTrip = async(data) => {
    try {
        await AsyncStorage.setItem(tripKey, JSON.stringify(data))
        console.log('trip setted');
    } catch (error) {
        console.log('Setting error trip:')
        console.log(error)
    }
}

export const GetTrip = async() => {
    try {
        const trip = await AsyncStorage.getItem(tripKey)
        console.log('trip got');
        return JSON.parse(trip)
    } catch (error) {
        console.log('Getting error trip:')
        console.log(error)
        return 'No token'
    }
}

export const DeleteTrip = async () => {
    try {
        await AsyncStorage.removeItem(tripKey)
        console.log('Item removed trip')
    } catch (error) {
        console.log('Deleting error trip:')
        console.log(error)        
    }
}