import {LocalNotifications, PermissionStatus} from "@capacitor/local-notifications";
import {BackgroundRunner} from "@capacitor/background-runner";

interface Notify {
  title: string
  body: string
  at: Date
}

async function Notify(
    title = "Remembear",
    body = "Remembear to wash your hand",
    at = new Date(Date.now() + 1000 * 5)
) {
  let localNotificationPermission: PermissionStatus = await LocalNotifications.checkPermissions()

  if (localNotificationPermission.display !== "granted") {

    localNotificationPermission = await LocalNotifications.requestPermissions()

    if (localNotificationPermission.display !== "granted") {
      return
    }
  }

  await BackgroundRunner.dispatchEvent({
    label: 'myCustomEvent',
    event: 'myCustomEvent',
    details: {
      // custom data
    },
  });

  return await LocalNotifications.schedule({
    notifications: [
      {
        title: title,
        body: body,
        id: 1,
        schedule: {
          at: at
        },
        // sound: null,
        // attachments: null,
        actionTypeId: '',
        extra: null,
      },
    ],
  });
}

export {
  Notify
}