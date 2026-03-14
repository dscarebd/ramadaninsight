import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.annur.ramadaninsight',
  appName: 'Ramadan Insight',
  webDir: 'dist',
  ios: {
    scheme: 'capacitor',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      androidSplashResourceName: 'splash',
      backgroundColor: '#f5faf8',
      showSpinner: false,
      launchFadeOutDuration: 300,
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#166534',
    },
  },
};

export default config;