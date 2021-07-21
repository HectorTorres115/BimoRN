import {PermissionsAndroid } from 'react-native'

export const requestPermission = async() => {
    try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permitir acceso a localizacion",
            message:
              "Esta app requiere permisos de localizacion para realizar los pedidos.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use maps");
        } else {
          console.log("Permiso denegado");
        }
      } catch (err) {
        console.warn(err);
      }
}