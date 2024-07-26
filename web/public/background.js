// eslint-disable-next-line @typescript-eslint/no-unused-vars
addEventListener('remoteNotification', (resolve, reject, args) => {
  try {
    console.log('received silent push notification');

    // eslint-disable-next-line no-undef
    CapacitorNotifications.schedule([
      {
        id: 100,
        title: 'Enterprise Background Runner',
        body: 'Received silent push notification',
      },
    ]);

    resolve();
  } catch (err) {
    reject();
  }
});