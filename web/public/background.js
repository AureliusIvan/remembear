// Configuration for background runner

// test background
// eslint-disable-next-line @typescript-eslint/no-unused-vars
addEventListener('myCustomEvent', (resolve, reject, args) => {
  console.log('do something to update the system here');
  resolve();
});
