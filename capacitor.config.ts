import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c4a8ab98fae34086bee4e8041003033d',
  appName: 'ramadaninsight',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      androidSplashResourceName: 'splash',
      backgroundColor: '#f5faf8',
      showSpinner: false,
      launchFadeOutDuration: 300,
    },
  },
};

export default config;
