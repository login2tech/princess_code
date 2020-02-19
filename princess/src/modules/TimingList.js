'use strict';
import React from 'react';
import {
  // ListView,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import {Colors} from '../utils/Theme';
// import LoadingIndicator from './../LoadingIndicator';
// import Seperator from './../Seperator';
// import { APP_STYLES } from './../../utils/AppStyles';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  cellContainer: {
    flex: 1,
    backgroundColor: '#fff',
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.primary,
    margin: 5,
    marginTop: 10,
    marginBottom: 0,
  },
  activeCell: {
    backgroundColor: Colors.primary,
  },
  cellWrapper: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    paddingRight: 5,
    paddingLeft: 5,
  },
  titleWrapper: {
    justifyContent: 'flex-start',
    flex: 2,
  },
  name: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f5f5',
  },
});

class Seperator extends React.Component {
  render() {
    return (
      <View
        style={[{height: 1, backgroundColor: Colors.primary}, this.props.style]}
      />
    );
  }
}

export default class TimingList extends React.Component {
  renderRow(time) {
    const {selectedTime} = this.props;
    return (
      <View
        style={[
          styles.cellContainer,
          selectedTime
            ? selectedTime === time.item
              ? styles.activeCell
              : ''
            : '',
        ]}
        key={time.item}>
        <TouchableHighlight
          onPress={() => this.props.onTimeSelect(time)}
          underlayColor="transparent">
          <Text
            style={[
              styles.name,
              selectedTime
                ? selectedTime === time.item
                  ? {color: '#fff'}
                  : {}
                : {},
            ]}>
            {time.item}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    const {timings} = this.props;
    // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
    // const dataSource = timings
    //   ? ds.cloneWithRows(timings)
    //   : ds.cloneWithRows([]);
    return (
      <View>
        <View style={styles.separator} />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={timings}
          renderItem={this.renderRow.bind(this)}
          automaticallyAdjustContentInsets={false}
          style={styles.container}
          enableEmptySections
          renderFooter={() => <Seperator />}
        />
      </View>
    );
  }
}
