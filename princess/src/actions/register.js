import {StackActions, NavigationActions} from 'react-navigation';
import OneSignal from 'react-native-onesignal'; // Import package from node modules

import constants from '../utils/Constants.js';
const endpoint = constants.BASE_URL;
// alert(endpoint);
export function register(data, navigator, cb) {
  return dispatch => {
    return fetch(endpoint + '?action=princess_register', {
      method: 'post',
      headers: {'Content-Type': 'application/json', accept: 'application/json'},
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          return response.json().then(json => {
            if (json.ok) {
              cb && cb();
              // registered successfully.
              alert(json.success);
              const toHome = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: 'OuterHome'})]
              });
              navigator.dispatch(toHome);
            } else {
              alert(json.error);
              cb && cb();
            }
          });
        } else {
          alert('Request failed from server!');
          cb && cb();
        }
      })
      .catch(function(e) {
        // console.log(e);
        alert('Internet Connection is lost , please try again');
        cb && cb();
      });
  };
}

export function forgot(data, navigator, cb) {
  return dispatch => {
    return fetch(endpoint + '?action=princess_forgot', {
      method: 'post',
      headers: {'Content-Type': 'application/json', accept: 'application/json'},
      body: JSON.stringify(data)
    })
      .then(response => {
        // console.log(response);
        if (response.ok) {
          // console.log(response);
          return response.json().then(json => {
            if (json.ok) {
              cb && cb();
              // registered successfully.
              alert(json.success);
              const toHome = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: 'OuterHome'})]
              });
              navigator.dispatch(toHome);
            } else {
              alert(json.error);
              cb && cb();
            }
          });
        } else {
          alert('Request failed from server!');
          cb && cb();
        }
      })
      .catch(function(e) {
        // console.log(e);
        alert('Internet Connection is lost , please try again');
        cb && cb();
      });
  };
}

export function login(data, navigator, cb) {
  return dispatch => {
    return fetch(endpoint + '?action=princess_login', {
      method: 'post',
      headers: {'Content-Type': 'application/json', accept: 'application/json'},
      body: JSON.stringify(data)
    })
      .then(response => {
        // console.log(response);
        if (response.ok) {
          return response.json().then(json => {
            // console.log(json);
            if (json.ok) {
              cb && cb();
              // registered successfully.
              alert(json.success);
              dispatch({
                type: 'LOGIN_SUCCESS',
                user: json.user,
                user_role: json.user_role
              });
              // dispatch saved state
              let r;
              OneSignal.setEmail(json.user.email, error => {
                //handle error if it occurred
              });
              if (json.user_role == 'client') {
                r = 'Home';
              } else {
                if (json.listing_count > 0) {
                  r = 'NewOrders';
                } else {
                  r = 'ProviderHome';
                }
              }

              const toHome = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: r})]
              });
              navigator.dispatch(toHome);
            } else {
              cb && cb();
              alert(json.error);
            }
          });
        } else {
          alert('Request failed from server!');
          cb && cb();
        }
      })
      .catch(function(e) {
        alert(e);
        alert('Internet Connection is lost , please try again');
        cb && cb();
      });
  };
}

export function providerListingSchedule(data, listing_id, navigator, cb) {
  return dispatch => {
    return fetch(
      endpoint +
        '?action=princess_updatelisting_schedule&listing_id=' +
        listing_id,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
      .then(response => {
        // console.log(response);
        if (response.ok) {
          return response.json().then(json => {
            // console.log(json);
            if (json.ok) {
              cb && cb();
              alert(json.success);
            } else {
              cb && cb();
              alert(json.error);
            }
          });
        } else {
          alert('Request failed from server!');
          cb && cb();
        }
      })
      .catch(function(e) {
        alert('Internet Connection is lost , please try again');
        cb && cb();
      });
  };
}

export function providerListingImages(data, listing_id, navigator, cb) {
  return dispatch => {
    return fetch(
      endpoint +
        '?action=princess_updatelisting_images&listing_id=' +
        listing_id,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
      .then(response => {
        // console.log(response);
        if (response.ok) {
          return response.json().then(json => {
            // console.log(json);
            if (json.ok) {
              cb && cb();
              alert(json.success);
            } else {
              cb && cb();
              alert(json.error);
            }
          });
        } else {
          alert('Request failed from server!');
          cb && cb();
        }
      })
      .catch(function(e) {
        alert('Internet Connection is lost , please try again');
        cb && cb();
      });
  };
}

export function providerListing(data, provider_id, navigator, cb) {
  // console.log( JSON.stringify( data) );
  return dispatch => {
    return fetch(
      endpoint + '?action=princess_updatelisting&provider_id=' + provider_id,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
      .then(response => {
        // console.log(response);
        if (response.ok) {
          return response.json().then(json => {
            // console.log(json);
            if (json.ok) {
              cb && cb();
              // registered successfully.
              alert(json.success);
              // dispatch({type : 'LOGIN_SUCCESS', user : json.user, 'user_role' : json.user_role})
              // dispatch saved state
              //
              // let toHome = NavigationActions.reset({
              //   index: 0,
              //   actions: [NavigationActions.navigate({routeName: ( ( json.user_role == 'client' ) ? 'Home' : 'ProviderHome' ) })  ]
              // });
              // navigator.dispatch(toHome);
            } else {
              cb && cb();
              alert(json.error);
            }
          });
        } else {
          alert('Request failed from server!');
          cb && cb();
        }
      })
      .catch(function(e) {
        alert('Internet Connection is lost , please try again');
        cb && cb();
      });
  };
}

export function doOrder(data, navigator, cb) {
  // console.log( JSON.stringify( data) );
  // console.log(   endpoint+'?action=princess_create_order' );
  return dispatch => {
    return fetch(endpoint + '?action=princess_create_order', {
      method: 'post',
      headers: {'Content-Type': 'application/json', accept: 'application/json'},
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          return response.json().then(json => {
            if (json.ok) {
              cb && cb();
              if (json.directSuccess == 'yes') {
                const toHome = NavigationActions.navigate({
                  routeName: 'BookingSuccess',
                  params: {
                    booking_id: json.order_id
                    // links : json.res.links
                  }
                });
                navigator.dispatch(toHome);
              } else {
                // console.log(json.res.links);
                // cb && cb();
                // console.log(json.res.links);
                // // tha pe trigger hoga payment wala part.
                // if (json.res && json.res.id) {
                //   const payment_id = json.res.id;
                //
                //   cb && cb(true, json, payment_id);
                // } else {
                //   alert('Something went wrong. Please contact Support.');
                //   cb && cb(false);
                // }
                // let toHome = NavigationActions.navigate({
                //   routeName:  'paymentView',
                //   params : {
                //   links : json.res.links
                //   }
                // });
                // navigator.dispatch(toHome)
              }

              // registered successfully.
              // alert(json.success);
              // dispatch({type : 'LOGIN_SUCCESS', user : json.user, 'user_role' : json.user_role})
              // dispatch saved state
              //
              // let toHome = NavigationActions.reset({
              //   index: 0,
              //   actions: [NavigationActions.navigate({routeName: ( ( json.user_role == 'client' ) ? 'Home' : 'ProviderHome' ) })  ]
              // });
              // navigator.dispatch(toHome);
            } else {
              cb && cb();
              alert(json.error);
            }
          });
        } else {
          alert('Request failed from server!');
          cb && cb();
        }
      })
      .catch(function(e) {
        // console.log(e);
        alert('Internet Connection is lost , please try again' + e.message);
        cb && cb();
      });
  };
}
