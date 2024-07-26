/// <reference types="@capacitor/local-notifications" />
import type {CapacitorConfig} from '@capacitor/cli';
import {KeyboardResize, KeyboardStyle} from "@capacitor/keyboard";

const config: CapacitorConfig = {
  appId: 'com.remembear.app',
  appName: 'remembear',
  webDir: 'out',
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "nyah.wav",
    },
    BackgroundRunner: {
      label: 'com.remembear.background.task',
      src: 'background.js',
      event: 'myCustomEvent',
      repeat: true,
      interval: 2,
      autoStart: false,

    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    Keyboard: {
      resize: KeyboardResize.Body,
      style: KeyboardStyle.Dark,
      resizeOnFullScreen: true,
    },
  }
};

export default config;
