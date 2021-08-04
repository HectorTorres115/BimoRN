import PushNotification, {Importance} from 'react-native-push-notification'

export const Notification = (title, message) => {
    PushNotification.channelExists('bimo', function (exists) {
        if(exists == false){
            PushNotification.createChannel({
                channelId: "bimo-id",
                channelName: "bimo-channel",
                channelDescription: "Notifications for messages purposes",
                importance: Importance.HIGH,
                vibrate: true,
                playSound: true,
                soundName: "default"
            }, () => {
                PushNotification.localNotification({
                    channelId: "bimo-id",
                    title,
                    message
                })
            })
        } else {
            console.log('Channel already exists')
        }
    });

    PushNotification.localNotification({
        channelId: "bimo-id",
        title,
        message
    })
}