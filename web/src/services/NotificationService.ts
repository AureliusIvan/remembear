import {LocalNotifications} from "@capacitor/local-notifications";

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