import {Header, Button, Icon} from 'react-native-elements';
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
const moment = require('moment');
// import { images } from '../Utils/CoinIcons';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginBottom: 20,
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: 3,
    padding: 20,
    backgroundColor: '#fff'
  },
  upperRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center'
  },
  coinSymbol: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 5,
    fontWeight: 'bold'
  },
  coinName: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 20
  },
  seperator: {
    marginTop: 10
  },
  coinPrice: {
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 10,
    fontWeight: 'bold',
    alignSelf: 'flex-end'
  },
  image: {
    width: 35,
    height: 35
  },
  moneySymbol: {
    fontWeight: 'bold'
  },
  statisticsContainer: {
    display: 'flex',
    borderTopColor: '#FAFAFA',
    borderTopWidth: 2,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  percentChangePlus: {
    color: '#00BFA5',
    fontWeight: 'bold',
    marginLeft: 5
  },
  percentChangeMinus: {
    color: '#DD2C00',
    fontWeight: 'bold',
    marginLeft: 5
  }
});

const {
  container,
  image,
  moneySymbol,
  upperRow,
  coinSymbol,
  coinName,
  coinPrice,
  statisticsContainer,
  seperator,
  percentChangePlus,
  percentChangeMinus
} = styles;

const WalletCard = ({obj}) => {
  return (
    <View style={container}>
      <View style={upperRow}>
        {obj.amount < 0 ? (
          <Icon
            size={30}
            containerStyle={{marginTop: 10}}
            color="#DD2C00"
            name="arrow-drop-down"
          />
        ) : (
          <Icon
            size={30}
            containerStyle={{marginTop: 10}}
            color="#00BFA5"
            name="arrow-drop-up"
          />
        )}

        <Text style={seperator}>|</Text>
        <Text style={coinName}>{obj.description}</Text>
        <Text
          style={[
            obj.amount < 0 ? percentChangeMinus : percentChangePlus,
            coinPrice,
            {textAlign: 'right'}
          ]}
        >
          {obj.amount}
          <Text style={moneySymbol}> SAR </Text>
        </Text>
      </View>

      <View style={statisticsContainer}>
        <Text
          style={[
            obj.amount < 0 ? percentChangeMinus : percentChangePlus,
            {textAlign: 'left'}
          ]}
        >
          {' '}
        </Text>

        <Text
          style={[
            obj.amount < 0 ? percentChangeMinus : percentChangePlus,
            {textAlign: 'right'}
          ]}
        >
          {' '}
          {moment(obj.created_on).format('LLL')}
        </Text>
      </View>
    </View>
  );
};

export default WalletCard;
