import React from 'react';
import {connect} from 'react-redux';
import SideMenu from 'react-native-side-menu';
// import { register }                        from '../actions/register';
import OrderBox from '../../modules/OrderBox';
import {Header, Icon} from 'react-native-elements';
import {globalStyles, Colors, getLanguageStrings} from '../../utils/Theme';
import constants from '../../utils/Constants.js';
import {NavigationActions} from 'react-navigation';
// import ScalingButton from '../../modules/ScalingButton';
import SlideMenu2 from './../SlideMenu';
const moment = require('moment');
import TopRightArea from '../../modules/TopRightArea';
import {
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  ScrollView
} from 'react-native';
const {width} = Dimensions.get('window');
// const popup_height = Math.min((70 * height) / 100, 600);
const endpoint = constants.BASE_URL;

class NewOrders extends React.Component {
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

  approveOrder(o_id) {
    fetch(
      endpoint +
        '?action=princess_change_status&new_status=approve&o_id=' +
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
        // alert(error.message)
        alert('something went wrong');
      });
  }
  rejectOrder(o_id) {
    // alert(o_id)
    fetch(
      endpoint + '?action=princess_change_status&new_status=reject&o_id=' + o_id
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
        '?action=princess_provider_orders&status=new&provider_id=' +
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
          key={k}
          size={20}
          color={Colors.primary}
          containerViewStyle={globalStyles.cardIcon}
        />
      );
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

  total_end_time(start, hours1, hours2) {
    if (!hours1) {
      hours1 = 0;
    }
    if (!hours2) {
      hours2 = 0;
    }
    const hours = parseInt(hours1) + parseInt(hours2);

    const m = moment(start, 'hh:mm a');
    m.add(hours, 'hours');
    return m.format('hh:mm a');
  }

  renderSaloon(obj, i) {
    return (
      <OrderBox
        approveOrder={this.approveOrder.bind(this)}
        rejectOrder={this.rejectOrder.bind(this)}
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

  render() {
    this.menuObj = this.state.isOpen ? (
      <SlideMenu2
        navigation={this.props.navigation}
        onItemSelected={this.onMenuItemSelected.bind(this)}
      />
    ) : (
      false
    );
    const len = this.state.order_data.length;
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
             <View style={{backgroundColor:Colors.pinkBg2, padding:10,width:'100%', textAlign:'center',borderBottomWidth:1, borderBottomColor:'#000'}}><Text  style={{backgroundColor:Colors.pinkBg2,textAlign:'center'}}>{this.lang.NEW_ORDERS}</Text></View>
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
                {/* {len == 0 ? (
                  <Text style={{textAlign: 'center'}}>
                    No new orders pending for your confirmation!
                  </Text>
                ) : (
                  false
                )} */}
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

export default connect(mapStateToProps)(NewOrders);
