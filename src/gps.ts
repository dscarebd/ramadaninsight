import { Geolocation } from '@capacitor/geolocation';

export async function requestLocationOnClick() {
  try {
    const permission = await Geolocation.requestPermissions();

    if (permission.location === 'granted') {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    } else {
      alert('Location permission denied');
      return null;
    }
  } catch (error) {
    alert('Location পাওয়া যায়নি');
    return null;
  }
}