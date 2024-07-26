// Configuration for background runner
import {PushNotifications} from '@capacitor/push-notifications';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// addEventListener('myCustomEvent', async (resolve, reject, args) => {
//   console.log('do something to update the system here');
//   resolve();
// });


// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * @description Registers event listeners for push notifications, handling registration,
 * error, received and action performed events by logging information to the console
 * using `console.info`, `console.error`, `console.log`.
 */
const addListeners = async () => {
  await PushNotifications.addListener('registration', token => {
    // Listens for push registration events, logging the received token to the console.

    // Listens for push registration events and logs the received token to the console.

    console.info('Registration token: ', token.value);
  });

  await PushNotifications.addListener('registrationError', err => {
    // Listens for and logs push notification registration errors.

    // Listens for registration errors with push notifications and logs them to the console.

    console.error('Registration error: ', err.error);
  });

  await PushNotifications.addListener('pushNotificationReceived', notification => {
    // Subscribes to push notifications.

    // Subscribes to push notifications.

    console.log('Push notification received: ', notification);
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
    // Listens for push notifications actions and logs them.

    // Listens for push notifications actions and logs them to the console.

    console.log('Push notification action performed', notification.actionId, notification.inputValue);
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * @description Checks for push notification permissions, requests them if necessary,
 * and registers the device to receive notifications. If permission is denied, it
 * throws an error.
 */
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
/**
 * @description Retrieves a list of delivered push notifications from an external
 * API, specifically `PushNotifications.getDeliveredNotifications()`, and logs the
 * result to the console.
 */
const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications();
  console.log('delivered notifications', notificationList);
}


// Example of dispatching the custom event to test the listener
document.dispatchEvent(new Event('myCustomEvent'));