import {LocalNotifications, PermissionStatus} from "@capacitor/local-notifications";

/**
 * @description Defines a set of properties that an object must have in order to be
 * considered compatible with this interface. The three properties defined are:
 *
 * *   `title`: A string that represents the title of a notification.
 * *   `body`: A string that contains the body or content of the notification.
 * *   `at`: A Date that specifies the time at which the notification should be
 * triggered or displayed.
 */
interface Notify {
  title: string
  body: string
  at: Date
}

/**
 * @description Schedules a local notification to be displayed at a specified time,
 * using the `LocalNotifications` module. It checks for and requests permission before
 * scheduling the notification, and logs a message to the console if the background
 * runner is triggered.
 *
 * @param {string} title - Used to set the title of the local notification.
 *
 * @param {string} body - Used to set the notification body.
 *
 * @param {Date} at - Used to specify when the notification should be triggered.
 *
 * @returns {Promise<LocalNotifications.Notification[]>} A promise that resolves to
 * an array of scheduled local notifications.
 */
async function Notify(
    title = "Remembear",
    body = "Remembear to wash your hand",
    at = new Date(Date.now() + 1000 * 10)
) {
  let localNotificationPermission: PermissionStatus = await LocalNotifications.checkPermissions()

  // make sure permission for notification is granted
  if (localNotificationPermission.display !== "granted") {
    localNotificationPermission = await LocalNotifications.requestPermissions()
    if (localNotificationPermission.display !== "granted") {
      return
    }
  }

  console.log("notification was triggered")

  await LocalNotifications.createChannel({
    id: "1234",
    name: "Remembear",
    description: "Remembear notification channel",
    importance: 5,
    visibility: 1,
    sound: "nyah.wav",
    vibration: true
  })

  return await LocalNotifications.schedule({
    notifications: [
      {
        channelId: "1234",
        title: title,
        body: body,
        id: 1,
        schedule: {
          at: at,
          allowWhileIdle: true
        },
        actionTypeId: '1234',
        extra: null,
      }
    ]
  });
}

export {
  Notify
}