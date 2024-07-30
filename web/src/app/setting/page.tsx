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
import {Button, buttonVariants} from "@/components/ui/button";
import {ActionPerformed, PushNotifications, PushNotificationSchema} from "@capacitor/push-notifications";
import {useToast} from "@/components/ui/use-toast"
import {Capacitor} from "@capacitor/core";
import {Notify} from "@/services/NotificationService";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {cn} from "@/lib/utils";


/**
 * @description Initializes and manages push notifications for an application. It
 * checks for available permissions, requests permission if not granted, registers
 * with Apple/Google, and listens for registration success/failure, push notification
 * receipt, and action performed events.
 *
 * @returns {React.ReactElement} A React component consisting of various HTML elements such
 * as `main`, `h1`, `Drawer`, `Button`, etc.
 */
export default function Setting(): React.ReactElement {
  const {toast} = useToast()
  const nullEntry: unknown[] = []
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [notifications, setnotifications] = React.useState(nullEntry);


  React.useEffect(() => {
    // Initializes and registers push notifications if available.

    const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
    if (!isPushNotificationsAvailable) {
      return
    }

    PushNotifications.checkPermissions().then((res) => {
      // Handles push notifications permissions.

      if (res.receive !== 'granted') {
        PushNotifications.requestPermissions().then((res) => {
          // Handles push notification permissions.

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

  /**
   * @description Initializes and registers for push notifications, listening to
   * registration success, error, received notifications, and action performed on
   * notifications. It updates local notifications state accordingly.
   */
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
          // Listens for push notifications and displays a toast message on successful registration.

          toast({
            title: "Push registration success",
          })
        }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
        (error: unknown) => {
          // Handles errors.

          alert('Error on registration: ' + JSON.stringify(error));
        }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          // Handles push notifications.

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
          // Handles push notifications.

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
      <main className="flex flex-col items-center justify-between p-6 gap-6 w-full">

        <form className={cn("w-full")}>
          <Card className={cn("w-full")}>

            <CardHeader className={'inline-flex flex-row justify-center items-center'}>
              <h1 className={"text-2xl font-bold"}>Account</h1>
            </CardHeader>

            <CardContent>
              <p>
                Update your account settings here. You can also add custom end point here! (data will saved locally)
              </p>
            </CardContent>

            <CardFooter>
              <Button type={'submit'} variant={'secondary'}>
                Logout
              </Button>
            </CardFooter>

          </Card>
        </form>


        <form className={cn("w-full")}>
          <Card className={cn("w-full")}>

            <CardHeader className={'inline-flex flex-row justify-center items-center'}>
              <h1 className={"text-2xl font-bold"}>Conversation</h1>
            </CardHeader>

            <CardContent>
              <p>Delete all conversation data</p>
            </CardContent>

            <CardFooter>
              <Button type={'submit'}>
                Delete
              </Button>
            </CardFooter>

          </Card>
        </form>

        <form className={cn("w-full")}>
          <Card className={cn("w-full")}>

            <CardHeader className={'inline-flex flex-row justify-center items-center'}>
              <h1 className={"text-2xl font-bold"}>Theme</h1>
            </CardHeader>

            <CardContent>
              <p>Connect your Notion account to Remembear</p>
            </CardContent>

            <CardFooter>
              <Button type={'submit'}>
                Save
              </Button>
            </CardFooter>

          </Card>
        </form>


        {/*Drawer*/}
        <Drawer>
          <DrawerTrigger
              className={buttonVariants({variant: 'default', size: 'lg', className: 'w-full'})}
          >Save!</DrawerTrigger>
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
