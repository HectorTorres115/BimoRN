import {BackHandler, Alert} from 'react-native'
import {DeleteUser} from '../Functions/UserStorage'

export const handleAndroidBackButton = (callback) => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      callback();
      return true;
    });
};

export const backAction = async (set_user) => {
  Alert.alert('¿Desea cerrar sesión?', '', [
    {text: 'Aceptar', onPress: async() => {
        set_user(null)
        await DeleteUser()
    }},
    {text: 'Cancelar'}
  ])  
}

export const removeAndroidBackButtonHandler = (navigation) => {
    BackHandler.removeEventListener('hardwareBackPress', () => navigation.goBack());
}