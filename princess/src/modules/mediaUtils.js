import {Alert} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export async function getLocationAsync(onSend) {
  Geolocation.getCurrentPosition(
    position => {
      onSend([
        {
          location: {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          },
        },
      ]);
    },
    error => {
      alert(error.message);
    },
    {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 10000,
    },
  );
}
