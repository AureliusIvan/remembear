// Configuration for background runner
import {PushNotifications} from '@capacitor/push-notifications';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// addEventListener('myCustomEvent', async (resolve, reject, args) => {
//   console.log('do something to update the system here');
//   resolve();
// });


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addListeners = async () => {
  await PushNotifications.addListener('registration', token => {
    console.info('Registration token: ', token.value);
  });

  await PushNotifications.addListener('registrationError', err => {
    console.error('Registration error: ', err.error);
  });

  await PushNotifications.addListener('pushNotificationReceived', notification => {
    console.log('Push notification received: ', notification);
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
    console.log('Push notification action performed', notification.actionId, notification.inputValue);
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const registerNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!');
  }

  await PushNotifications.register();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications();
  console.log('delivered notifications', notificationList);
}


// Example of dispatching the custom event to test the listener
document.dispatchEvent(new Event('myCustomEvent'));