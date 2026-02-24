import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c4a8ab98fae34086bee4e8041003033d',
  appName: 'ramadaninsight',
  webDir: 'dist',
  ios: {
    scheme: 'capacitor',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      androidSplashResourceName: 'splash',
      backgroundColor: '#f5f0ff',
      showSpinner: false,
      launchFadeOutDuration: 300,
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#5B21B6',
    },
  },
};

export default config;
