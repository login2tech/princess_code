import React from 'react';
import OneSignal from 'react-native-onesignal'; // Import package from node modules

import {List, ListItem} from 'react-native-elements';
import {connect} from 'react-redux';
import {getLanguageStrings} from '../utils/Theme';
import {StyleSheet, ScrollView, View} from 'react-native';
import {Colors} from '../utils/Theme';

import {StackActions, NavigationActions} from 'react-navigation';

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#fff',
    padding: 20
  },
  avatarContainer: {
    marginBottom: 10,
    marginTop: 10,
    borderTopWidth: 0
  },

  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5
  },

  menuLinksTitle: {
    fontSize: 25
  },
  content: {
    backgroundColor: 'transparent',
    flex: 1
  }
});

class MySideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.lang = getLanguageStrings(this.props.language.current);
  }

  switchTo(l) {
    if (l != 'ar') {
      l = 'en';
    }
    this.props.dispatch({
      type: 'CHANGE_LANGUAGE',
      new: l
    });
    //this.lang = getLanguageStrings(l);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.language.current != newProps.language.current) {
      this.lang = getLanguageStrings(newProps.language.current);
    }
  }

  goTo(path) {
    const navigateAction = NavigationActions.navigate({
      routeName: path,
      params: {},
      action: NavigationActions.navigate({routeName: path})
    });
    this.props.navigation.dispatch(navigateAction);
  }

  doLogout() {
    OneSignal.logoutEmail(error => {
      //handle error if it occurred
    });
    this.props.dispatch({type: 'LOGOUT_SUCCESS'});

    const toHome = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'OuterHome'})]
    });
    this.props.navigation.dispatch(toHome);
  }

  render() {
    const list1 = [
      {
        title: this.lang.PROFILE,
        id: 'profile',
        key: 1,
        icon: 'account-circle',
        onPress: () => this.goTo('ProviderProfile')
      },
      {
        title: this.lang.WALLET,
        id: 'wallet',
        key: 1,
        icon: 'account-balance-wallet',
        onPress: () => this.goTo('ClientWallet')
      },
      {
        title: this.lang.MY_LISTING,
        id: 'my_listings',
        key: 1,
        icon: 'edit',
        onPress: () => this.goTo('ProviderHome')
      },

      {
        title: this.lang.MY_LISTING_GALLERY,
        id: 'my_listings_gallery',
        key: 1,
        icon: 'add-a-photo',
        onPress: () => this.goTo('ProverGallery')
      },
      {
        title: this.lang.MY_LISTING_AVAILABILITY,
        id: 'my_listings_avail',
        key: 1,
        icon: 'event-available',
        onPress: () => this.goTo('Schedule')
      }
    ];

    const list2 = [
      {
        title: this.lang.NEW_ORDERS,
        id: 'new_orders',
        icon: 'add-shopping-cart',
        onPress: () => this.goTo('NewOrders'),
        key: 2
      },
      {
        title: this.lang.CONFIRMED_ORDERS,
        id: 'confirmedOrders',
        icon: 'confirmation-number',
        onPress: () => this.goTo('ConfirmedOrders'),
        key: 2
      },
      {
        title: this.lang.PENDING_PAYMENT_ORDERS,
        id: 'pendingOrders',
        icon: 'event-busy',
        onPress: () => this.goTo('PaymentPendingOrders'),
        key: 2
      },

      {
        title: this.lang.ALL_ORDERS,
        id: 'all_orders',
        key: 3,
        icon: 'book',
        onPress: () => this.goTo('AllOrders')
      }
    ];

    const list3 = [
      {
        title: this.lang.MY_PAYOUTS,
        id: 'my_payouts',
        key: 4,
        icon: 'attach-money',
        onPress: () => this.goTo('Payouts')
      },

      {
        title: this.lang.CONTACT_ADMIN,
        id: 'contant_admin',
        icon: 'contact-mail',
        key: 9,
        onPress: () => this.goTo('ContactPage')
      },
      {
        title: this.lang.TERMS,
        id: 'terms',
        icon: 'tooltip-text',
        type: 'material-community',
        key: 10,
        onPress: () => this.goTo('TermsPage')
      }
    ];
    if (this.props.auth && this.props.auth.user) {
      list3.push({
        title: this.lang.LOGOUT,
        id: 'logoff',
        icon: 'exit-to-app',
        key: 11,
        onPress: () => this.doLogout()
      });
    }
    // const list4 = [];
    if (this.props.language.current == 'en') {
      list3.push({
        title: this.lang.SWITCH_TO_ARABIC,
        id: 'switch',
        key: 10,
        icon: 'language',
        onPress: () => this.switchTo('ar')
      });
    } else {
      list3.push({
        title: this.lang.SWITCH_TO_ENGLISH,
        id: 'switch',
        key: 10,
        onPress: () => this.switchTo('en')
      });
    }
    return (
      <ScrollView
        scrollsToTop={false}
        style={[styles.menu, {backgroundColor: '#fff'}]}
      >
        <List containerStyle={styles.avatarContainer}>
          {list1.map((item, i) => (
            <ListItem
              fontFamily={'Gotham-Medium'}
              onPress={item.onPress}
              key={item.id}
              // badge={item.badge}
              title={item.title}
              leftIcon={{
                name: item.icon,
                style: {marginRight: 0, color: Colors.primary}
              }}
              leftIconContainerStyle={{
                backgroundColor: '#fff',
                borderRadius: 5,
                padding: 5,
                marginRight: 5
              }}
              containerStyle={{
                backgroundColor: Colors.pinkBg,
                borderBottomWidth: 0,
                marginBottom: 5,
                borderRadius: 10,
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 2,

                paddingRight: 5
              }}
            />
          ))}
        </List>

        <List containerStyle={styles.avatarContainer}>
          {list2.map((item, i) => (
            <ListItem
              fontFamily={'Gotham-Medium'}
              onPress={item.onPress}
              key={item.id}
              // badge={item.badge}
              title={item.title}
              leftIcon={{
                name: item.icon,
                style: {marginRight: 0, color: Colors.primary}
              }}
              leftIconContainerStyle={{
                backgroundColor: '#fff',
                borderRadius: 5,
                padding: 5,
                marginRight: 5
              }}
              containerStyle={{
                backgroundColor: Colors.pinkBg,
                borderBottomWidth: 0,
                marginBottom: 5,
                borderRadius: 10,
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 2,
                paddingRight: 5
              }}
            />
          ))}
        </List>

        <List containerStyle={styles.avatarContainer}>
          {list3.map((item, i) => (
            <ListItem
              fontFamily={'Gotham-Medium'}
              onPress={item.onPress}
              key={item.id}
              // badge={item.badge}
              title={item.title}
              leftIcon={{
                name: item.icon,
                type: item.type ? item.type : 'material',
                style: {marginRight: 0, color: Colors.primary}
              }}
              leftIconContainerStyle={{
                backgroundColor: '#fff',
                borderRadius: 5,
                padding: 5,
                marginRight: 5
              }}
              containerStyle={{
                backgroundColor: Colors.pinkBg,
                borderBottomWidth: 0,
                marginBottom: 5,
                borderRadius: 10,
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 2,

                paddingRight: 5
              }}
            />
          ))}
        </List>

        <View style={{height: 20}} />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    // messages: state.messages, // use store's data
    language: state.language,
    auth: state.auth // use store's data
  };
};

export default connect(mapStateToProps)(MySideMenu);
