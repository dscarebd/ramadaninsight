import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

export const useStatusBar = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const configure = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Light });
        if (Capacitor.getPlatform() === 'android') {
          await StatusBar.setBackgroundColor({ color: '#166534' });
        }
      } catch {}
    };

    configure();
  }, []);
};
