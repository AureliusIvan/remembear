"use client"

import React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {Button} from "@/components/ui/button";
import {ActionPerformed, PushNotifications, PushNotificationSchema} from "@capacitor/push-notifications";
import {useToast} from "@/components/ui/use-toast"
import {Capacitor} from "@capacitor/core";
import {Notify} from "@/services/NotificationService";


export default function Setting() {
  const {toast} = useToast()
  const nullEntry: unknown[] = []
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [notifications, setnotifications] = React.useState(nullEntry);


  React.useEffect(() => {
    const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
    if (!isPushNotificationsAvailable) {
      return
    }

    PushNotifications.checkPermissions().then((res) => {
      if (res.receive !== 'granted') {
        PushNotifications.requestPermissions().then((res) => {
          if (res.receive === 'denied') {
            toast({
              title: "Push Notification permission denied",
            })
          } else {
            toast({
              title: "Push Notification permission granted",
            })
            register();
          }
        });
      } else {
        register();
      }
    });
  }, [])

  const register = () => {
    const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
    if (!isPushNotificationsAvailable) {
      return
    }

    console.log('Initializing HomePage');

    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register();

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
        (
            // token: Token
        ) => {
          toast({
            title: "Push registration success",
          })
        }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
        (error: unknown) => {
          alert('Error on registration: ' + JSON.stringify(error));
        }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          setnotifications(notifications => [...notifications, {
            id: notification.id,
            title: notification.title,
            body: notification.body,
            type: 'foreground'
          }])
        }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          setnotifications(notifications => [...notifications, {
            id: notification.notification.data.id,
            title: notification.notification.data.title,
            body: notification.notification.data.body,
            type: 'action'
          }])
        }
    );
  }

  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>
          Setting
        </h1>


        {/*Drawer*/}
        <Drawer>
          <DrawerTrigger>Open</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>This action cannot be undone.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button
                  type={'button'}
                  onClick={() => {
                    Notify()
                    register()
                  }}
              >
                Submit
              </Button>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </main>
  );
}
