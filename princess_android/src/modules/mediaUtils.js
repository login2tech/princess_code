

import { Alert } from 'react-native'


export   async function getLocationAsync(onSend) {


  navigator.geolocation.getCurrentPosition((position) => {

        onSend([{ location: {
          longitude: position.coords.longitude, latitude: position.coords.latitude
        } }])

    }, (error) => {
      alert( error.message)
    }, {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 10000
    });


}
 
