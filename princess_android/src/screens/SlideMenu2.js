import OneSignal from 'react-native-onesignal'; // Import package from node modules
import React from 'react';
import {List, ListItem} from 'react-native-elements';
import {connect} from 'react-redux';
import {getLanguageStrings, Colors} from '../utils/Theme';
import {StyleSheet, ScrollView} from 'react-native';

import {NavigationActions, StackActions} from 'react-navigation';

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
    borderTopWidth: 0,
    borderWidth: 0
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
class MySideMenu2 extends React.Component {
  constructor(props) {
    super(props);
    this.lang = getLanguageStrings(this.props.language.current);
  }

  goTo(path) {
    const navigateAction = NavigationActions.navigate({
      routeName: path,
      params: {},
      action: NavigationActions.navigate({routeName: path})
    });
    this.props.navigation.dispatch(navigateAction);
  }

  switchTo(l) {
    if (l != 'ar') {
      l = 'en';
    }
    this.props.dispatch({
      type: 'CHANGE_LANGUAGE',
      new: l
    });
    //  this.lang = getLanguageStrings(l);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.language.current != newProps.language.current) {
      this.lang = getLanguageStrings(newProps.language.current);
    }
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
    const list = [
      {
        title: this.lang.FIND_PROVIDERS,
        id: 'find_providers',
        key: 1,
        icon: 'business',
        onPress: () => this.goTo('Home')
      },
      {
        title: this.lang.PROFILE,
        id: 'profile',
        key: 1,
        icon: 'account-circle',
        onPress: () => this.goTo('Profile')
      },

      {
        title: this.lang.WALLET,
        id: 'profile',
        key: 1,
        icon: 'account-balance-wallet',
        onPress: () => this.goTo('ClientWallet')
      }
    ];

    const list2 = [
      {
        title: this.lang.NEW_ORDERS,
        id: 'new_orders',
        icon: 'add-shopping-cart',
        onPress: () => this.goTo('MyOrdersNew'),
        key: 2
      },
      {
        title: this.lang.CONFIRMED_ORDERS,
        id: 'confirmedOrders',
        icon: 'confirmation-number',
        onPress: () => this.goTo('MyOrdersConfirmed'),
        key: 2
      },
      {
        title: this.lang.PENDING_PAYMENT_ORDERS,
        id: 'confirmedOrders',
        icon: 'event-busy',
        onPress: () => this.goTo('MyOrdersPendingPayment'),
        key: 2
      },

      {
        title: this.lang.ALL_ORDERS,
        id: 'all_orders',
        key: 3,
        icon: 'book',
        onPress: () => this.goTo('MyOrders')
      }
    ];

    const list3 = [
      {
        title: this.lang.TERMS,
        id: 'contant_admin',
        icon: 'tooltip-text',
        type: 'material-community',
        key: 8,
        onPress: () => this.goTo('TermsPage')
      },
      {
        title: this.lang.CONTACT_ADMIN,
        id: 'contant_admin',
        icon: 'contact-mail',
        key: 9,
        onPress: () => this.goTo('ContactPage')
      }
    ];
    if (this.props.auth && this.props.auth.user) {
      list3.push({
        title: this.lang.LOGOUT,
        id: 'logoff',
        icon: 'exit-to-app',
        key: 10,
        onPress: () => this.doLogout()
      });
    }

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
        icon: 'language',
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
        <List style={styles.avatarContainer}>
          {list.map((item, i) => (
            <ListItem
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

        <List style={styles.avatarContainer}>
          {list2.map((item, i) => (
            <ListItem
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

        <List style={styles.avatarContainer}>
          {list3.map((item, i) => (
            <ListItem
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
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    language: state.language,
    auth: state.auth
  };
};

export default connect(mapStateToProps)(MySideMenu2);
