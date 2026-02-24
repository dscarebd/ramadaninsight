import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

export const hapticImpact = async (style: ImpactStyle = ImpactStyle.Light) => {
  if (!isNative) return;
  try {
    await Haptics.impact({ style });
  } catch {}
};

export const hapticNotification = async (type: NotificationType = NotificationType.Success) => {
  if (!isNative) return;
  try {
    await Haptics.notification({ type });
  } catch {}
};

export const hapticSelection = async () => {
  if (!isNative) return;
  try {
    await Haptics.selectionStart();
    await Haptics.selectionChanged();
    await Haptics.selectionEnd();
  } catch {}
};
