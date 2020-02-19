import React from 'react';
import {connect} from 'react-redux';
import SideMenu from 'react-native-side-menu';
import {Header, Icon} from 'react-native-elements';
import {globalStyles, Colors, getLanguageStrings} from '../../utils/Theme';
import constants from '../../utils/Constants.js';
import {NavigationActions} from 'react-navigation';
import OrderBox from '../../modules/OrderBox';
import SlideMenu2 from '..//SlideMenu2';
import TopRightArea from '../../modules/TopRightArea';
import {Text, View, ScrollView, Dimensions} from 'react-native';
const width = Dimensions.get('window').width;
const endpoint = constants.BASE_URL;

class MyOrdersConfirmed extends React.Component {
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

  componentWillReceiveProps(newProps) {
    if (this.props.language.current != newProps.language.current) {
      this.lang = getLanguageStrings(newProps.language.current);
    }
  }

  rejectOrder(o_id, by) {
    let status = 'reject';
    if (by == 'client') {
      status = 'cancel';
    }
    fetch(
      endpoint +
        '?action=princess_change_status&new_status=' +
        status +
        '&o_id=' +
        o_id
    )
      .then(response => response.json())
      .then(json => {
        if (json.ok) {
          alert(this.lang.STATUS_CHANGED);
          this.getListings();
        } else {
          alert(json.error);
        }
      })
      .catch(error => {
        alert('something went wrong');
      });
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
    // let f = '';
    // if (this.state.filter) {
    //   f += '&filter=' + this.state.filter;
    // }
    // if (this.state.sort) {
    //   f += '&sort=' + this.state.sort;
    // }
    fetch(
      endpoint +
        '?action=princess_user_orders&status=Confirmed&user_id=' +
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

  ratingStyle(rating) {
    if (rating >= 4) {
      return globalStyles.saloon_green;
    } else if (rating >= 2) {
      return globalStyles.saloon_yellow;
    }
    return globalStyles.saloon_red;
  }

  renderCostLevel(c) {
    const cols = [];
    c = parseInt(c).toString().length;
    for (let i = 0; i < c; i++) {
      cols.push(i);
    }
    return cols.map((i, k) => {
      return (
        <Icon
          name="attach-money"
          key={i}
          size={20}
          color={Colors.primary}
          containerViewStyle={globalStyles.cardIcon}
        />
      );
    });
  }

  renderSaloon(obj, i) {
    return (
      <OrderBox
        obj={obj}
        key={i}
        isMode={'client'}
        rejectOrder={this.rejectOrder.bind(this)}
        goToChat={this.goToChat.bind(this)}
        language={this.props.language}
        showPaymentButton
      />
    );
  }
  goToList() {
    const navigateAction = NavigationActions.navigate({
      routeName: 'UnreadOrders',
      params: {},
      action: NavigationActions.navigate({routeName: 'UnreadOrders'})
    });
    this.props.navigation.dispatch(navigateAction);
  }

  goBack() {
    const toHome = NavigationActions.back();
    this.props.navigation.dispatch(toHome);
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
      <View style={globalStyles.containerSplash}>
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
              <View
                style={{
                  backgroundColor: Colors.pinkBg2,
                  padding: 10,
                  width: '100%',
                  textAlign: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: '#000'
                }}
              >
                <Text
                  style={{backgroundColor: Colors.pinkBg2, textAlign: 'center'}}
                >
                  {this.lang.CONFIRMED_ORDERS}
                </Text>
              </View>
              <Text style={{textAlign: 'center'}}>{this.lang.START_CHAT}</Text>
              <View style={globalStyles.innerContainer}>
                {this.state.order_data.map((obj, i) => {
                  return this.renderSaloon(obj, i);
                })}
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

const mapStateToProps = state => {
  return {
    messages: state.messages,
    auth: state.auth,
    language: state.language
  };
};

export default connect(mapStateToProps)(MyOrdersConfirmed);
