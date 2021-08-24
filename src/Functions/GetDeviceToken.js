import messaging from '@react-native-firebase/messaging'

export const GetDeviceToken = async () => {
    try {
        const token = await messaging().getToken();
        return token
    } catch (error) {   
        console.log('ERROR: ' + error)
        return 'Not token from emulator'
    }
}

export const requestPermissionFirebase = async () => {
    const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}