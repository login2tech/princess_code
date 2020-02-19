import {Linking} from 'react-native';
import MapView from 'react-native-maps';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, View, ViewPropTypes} from 'react-native';

export default class CustomView extends React.Component {
  static propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    mapViewStyle: ViewPropTypes.style,
  };

  static defaultProps = {
    currentMessage: {},
    containerStyle: {},
    mapViewStyle: {},
  };

  openMapAsync = async loc => {
    // const { currentMessage: { location = {} } = {} } = this.props

    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${loc.latitude},${loc.longitude}`,
      default: `http://maps.google.com/?q=${loc.latitude},${loc.longitude}`,
    });

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        return Linking.openURL(url);
      }
      alert('Opening the map is not supported.');
    } catch ({message}) {
      alert(message);
    }
  };

  render() {
    const {currentMessage, containerStyle, mapViewStyle} = this.props;
    // alert(JSON.stringify(currentMessage));
    if (currentMessage.location && currentMessage.location != 'false') {
      // alert(currentMessage.location);
      let loc = currentMessage.location;
      if (typeof loc === 'string') {
        loc = JSON.parse(loc);
        // alert(JSON.stringify(loc));
      }
      // alert(JSON.stringify(currentMessage.location))
      return (
        <View
          style={[styles.container, containerStyle]}
          // onPress={() => {
          //   this.openMapAsync(loc);
          // }}
        >
          <MapView
            style={[styles.mapView, mapViewStyle]}
            onPress={() => this.openMapAsync(loc)}
            region={{
              latitude: loc.latitude,
              longitude: loc.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          />
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {},
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
});
