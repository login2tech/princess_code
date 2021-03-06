import React from 'react';
import {connect} from 'react-redux';
import SideMenu from 'react-native-side-menu';
import {Header} from 'react-native-elements';
import OrderBox from '../../modules/OrderBox';
import {globalStyles, Colors, getLanguageStrings} from '../../utils/Theme';
import constants from '../../utils/Constants.js';
import {NavigationActions} from 'react-navigation';
import SlideMenu2 from './../SlideMenu';

import TopRightArea from '../../modules/TopRightArea';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
const {width} = Dimensions.get('window');
const endpoint = constants.BASE_URL;

class PaymentPendingOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      filter: '',
      sort: '',
      loaded: false,
      order_data: []
    };

    this.lang = getLanguageStrings(this.props.language.current);
  }
  goBack() {
    const toHome = NavigationActions.back();
    this.props.navigation.dispatch(toHome);
  }
  onSideMenuChange(v) {
    this.setState({isOpen: v});
  }
  onMenuItemSelected(v) {
    this.setState({isOpen: false});
  }
  toggleSideMenu() {
    this.setState({isOpen: !this.state.isOpen});
  }

  goAccount() {
    // console.log(this.props.auth)
    if (this.props.auth.user.id) {
      return;
    }
    const toHome = NavigationActions.navigate({
      routeName: 'OuterHome',
      params: {
        // saloon_id : id,
        isInner: true
      }
    });
    this.props.navigation.dispatch(toHome);
  }

  componentDidMount() {
    this.getListings();
  }
  getListings() {
    let f = '';
    if (this.state.filter) {
      f += '&filter=' + this.state.filter;
    }
    if (this.state.sort) {
      f += '&sort=' + this.state.sort;
    }
    fetch(
      endpoint +
        '?action=princess_provider_orders&status=Pending_Payment&provider_id=' +
        this.props.auth.user.id
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.ok && responseJson.orders) {
          const l = responseJson.orders;
          this.setState({
            order_data: l,
            loaded: true
          });
        } else {
          alert(responseJson.error);
        }
      })
      .catch(error => {
        // console.error(error);
        alert('unable to fetch orders');
      });
  }

  showDets(id) {
    const toHome = NavigationActions.navigate({
      routeName: 'Saloon',
      params: {
        saloon_id: id
      }
    });
    this.props.navigation.dispatch(toHome);
  }

  renderSaloon(obj, i) {
    return (
      <OrderBox
        obj={obj}
        key={i}
        isMode={'provider'}
        goToChat={this.goToChat.bind(this)}
        language={this.props.language}
      />
    );
  }
  goToList() {
    // const {navigate} = this.props.navigation;

    const navigateAction = NavigationActions.navigate({
      routeName: 'UnreadOrders',
      params: {},
      action: NavigationActions.navigate({routeName: 'UnreadOrders'})
    });
    this.props.navigation.dispatch(navigateAction);
  }

  goToChat(booking_id, listing_id, user_id, provider_id) {
    // if(this.props.auth.user.id){
    //   return;
    // }
    const toHome = NavigationActions.navigate({
      routeName: 'Chat',
      params: {
        order_id: booking_id,
        listing_id: listing_id,
        user_id: user_id,
        provider_id: provider_id
      }
    });
    this.props.navigation.dispatch(toHome);
  }
  goToList() {
    // const {navigate} = this.props.navigation;

    const navigateAction = NavigationActions.navigate({
      routeName: 'UnreadOrders',
      params: {},
      action: NavigationActions.navigate({routeName: 'UnreadOrders'})
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    this.menuObj = this.state.isOpen ? (
      <SlideMenu2
        navigation={this.props.navigation}
        onItemSelected={this.onMenuItemSelected.bind(this)}
      />
    ) : (
      false
    );

    return (
      <View style={[globalStyles.containerSplash, {backgroundColor: '#fff'}]}>
        <SideMenu
          isOpen={this.state.isOpen}
          onChange={this.onSideMenuChange.bind(this)}
          menu={this.menuObj}
          openMenuOffset={(width * 80) / 100}
        >
          <Header
            backgroundColor={Colors.primary}
            style={globalStyles.header}
            leftComponent={{
              icon: 'arrow-back',
              color: '#fff',
              onPress: () => {
                this.goBack();
              }
            }}
            rightComponent={
              <TopRightArea goToList={this.goToList.bind(this)} />
            }
            centerComponent={{
              text: constants.APP_TITLE,
              style: globalStyles.headerTitle
            }}
          />

          <View>
            <ScrollView>
            <View style={{backgroundColor:Colors.pinkBg2, padding:10,width:'100%', textAlign:'center',borderBottomWidth:1, borderBottomColor:'#000'}}><Text  style={{backgroundColor:Colors.pinkBg2,textAlign:'center'}}>{this.lang.PENDING_PAYMENT_ORDERS}</Text></View>
              <Text style={{textAlign: 'center'}}>{this.lang.START_CHAT}</Text>
              <View style={globalStyles.innerContainer}>
                {this.state.order_data.map((obj, i) => {
                  return this.renderSaloon(obj, i);
                })}
                {!this.state.loaded && <ActivityIndicator />}
                {this.state.loaded && this.state.order_data.length < 1 ? (
                  <Text style={{textAlign: 'center'}}>
                    {this.lang.NO_ORDERS}
                  </Text>
                ) : (
                  false
                )}
                <View style={globalStyles.emptySpace} />
              </View>
            </ScrollView>
          </View>
        </SideMenu>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = state => {
  return {
    messages: state.messages,
    auth: state.auth,
    language: state.language
  };
};

export default connect(mapStateToProps)(PaymentPendingOrders);
