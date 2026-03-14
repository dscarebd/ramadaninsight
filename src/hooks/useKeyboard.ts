import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';

export const useKeyboard = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const configure = async () => {
      try {
        await Keyboard.setAccessoryBarVisible({ isVisible: true });
        await Keyboard.setScroll({ isDisabled: false });
      } catch {}
    };

    configure();
  }, []);
};
