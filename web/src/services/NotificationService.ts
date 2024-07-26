import {LocalNotifications, PermissionStatus} from "@capacitor/local-notifications";

interface Notify {
  title: string
  body: string
  at: Date
}

async function Notify(
    title = "Remembear",
    body = "Remembear to wash your hand",
    at = new Date(Date.now() + 1000 * 10)
) {
  let localNotificationPermission: PermissionStatus = await LocalNotifications.checkPermissions()

  if (localNotificationPermission.display !== "granted") {
    localNotificationPermission = await LocalNotifications.requestPermissions()
    if (localNotificationPermission.display !== "granted") {
      return
    }
  }

  console.log("background runner was triggered")
  return await LocalNotifications.schedule({
    notifications: [
      {
        title: title,
        body: body,
        id: 1,
        schedule: {
          at: at,
          allowWhileIdle: true
        },
        actionTypeId: '1234',
        extra: null
      }
    ]
  });
}

export {
  Notify
}