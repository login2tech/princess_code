import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import PropTypes from 'prop-types';
import {globalStyles, Colors, getLanguageStrings} from '../utils/Theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 25
  },
  iconRow: {
    flex: 2,
    justifyContent: 'flex-start'
  },
  smsIcon: {
    color: 'gray',
    fontSize: 30
  },
  smsRow: {
    flex: 2,
    justifyContent: 'flex-start'
  },
  telIcon: {
    color: Colors.primary,
    fontSize: 30
  },
  telNameColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  telNameText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '200'
  },
  telNumberColumn: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
    // marginBottom: 5,
  },
  telNumberText: {
    fontSize: 30
  },
  smallText: {
    fontSize:20,
    color:Colors.primary
  },
  telRow: {
    flex: 6,
    flexDirection: 'column',
    justifyContent: 'center'
  }
});

const Details = ({
  label, value
}) => {
  return (
    <TouchableOpacity onPress={() => onPressTel(number)}>
      <View style={[styles.container, {padding:20}]}>
        
        <View style={styles.telRow}>
          <View style={styles.telNumberColumn}>
            <View><Text style={styles.smallText}>{label}</Text></View>
            <View><Text style={styles.telNumberText}>{value}</Text></View>
          </View>
          {/* <View style={styles.telNameColumn}> */}
          {/* <Text style={styles.telNameText}>{'Ph.'}</Text> */}
          {/* </View> */}
        </View>
        {/* <View style={styles.smsRow}>
          <Icon
            name="textsms"
            underlayColor="transparent"
            iconStyle={styles.smsIcon}
            onPress={() => onPressSms()}
          />
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

Details.propTypes = {
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  index: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired
};

Details.defaultProps = {
  containerStyle: {},
  name: null
};

export default Details;
