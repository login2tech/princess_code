import React from 'react';
import {connect} from 'react-redux';
import SideMenu from 'react-native-side-menu';
import {Header, Icon, Button} from 'react-native-elements';
import {
  globalStyles,
  Colors,
  // Paddings,
  getLanguageStrings
} from '../../utils/Theme';
import constants from '../../utils/Constants.js';
import {NavigationActions} from 'react-navigation';
// import ScalingButton from '../../modules/ScalingButton';
import OrderBox from '../../modules/OrderBox';
import SlideMenu2 from '../SlideMenu2';
import SlideMenu from '../SlideMenu';
// const moment = require('moment');
import TopRightArea from '../../modules/TopRightArea';
import {Text, View, Dimensions, ScrollView} from 'react-native';
// const width = Dimensions.get('window').width;
const {width} = Dimensions.get('window');
// const popup_height = Math.min((70 * height) / 100, 600);
const endpoint = constants.BASE_URL;

class MyOrders extends React.Component {
  constructor(props) {
    super(props);
    //alert();
    this.state = {
      isOpen: false,
      filter: '',
      sort: '',
      order_data: [],
      role: 'messages',
      loading_messages: false,
      loading_events: false,
      eventsData: [],
      messagesData: []
    };
    this.lang = getLanguageStrings(this.props.language.current);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.language.current != newProps.language.current) {
      this.lang = getLanguageStrings(newProps.language.current);
    }
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

  goBack() {
    const toHome = NavigationActions.back();
    this.props.navigation.dispatch(toHome);
  }

  fetchEvents() {
    this.setState(
      {
        loading_messages: false,
        loading_events: true
      },
      () => {
        fetch(
          endpoint +
            '?action=event_notifications_re&uid=' +
            this.props.auth.user.id +
            '&role=' +
            this.props.auth.user_role
        )
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.ok && responseJson.rows) {
              const l = responseJson.rows;
              // alert(l.length);
              this.setState({
                eventsData: l,
                loading_events: false,
                loading_messages: false
              });
            } else {
              this.setState({
                eventsData: [],
                loading_events: false,
                loading_messages: false
              });
              alert(responseJson.error);
            }
          })
          .catch(error => {
            // console.error(error);
            alert('unable to fetch orders');
            this.setState({
              eventsData: [],
              loading_events: false,
              loading_messages: false
            });
          });
      }
    );
  }

  fetchMessages() {
    this.setState(
      {
        loading_messages: true,
        loading_events: false
      },
      () => {
        fetch(
          endpoint +
            '?action=princess_user_orders_n&user_id=' +
            this.props.auth.user.id +
            '&user_role=' +
            this.props.auth.user_role
        )
          .then(response => response.json())
          .then(responseJson => {
            // alert(JSON.stringify(responseJson));
            if (responseJson.ok && responseJson.orders) {
              const l = responseJson.orders;
              // alert(l.length);
              this.setState({
                messagesData: l,
                loading_events: false,
                loading_messages: false
              });
            } else {
              this.setState({
                messagesData: [],
                loading_events: false,
                loading_messages: false
              });
              alert(responseJson.error);
            }
          })
          .catch(error => {
            this.setState({
              messagesData: [],
              loading_events: false,
              loading_messages: false
            });
            alert('unable to fetch orders');
          });
      }
    );
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
    this.fetchMessages();
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

  renderSaloon(obj, i) {
    return (
      <OrderBox
        obj={obj}
        key={i}
        isMode={'messages'}
        goToChat={this.goToChat.bind(this)}
        language={this.props.language}
      />
    );
  }

  renderMessage(obj, i) {
    return (
      <View
        key={i}
        style={[
          globalStyles.saloon_card,
          {
            borderLeftColor: Colors.primary,
            borderLeftWidth: 5,
            padding: 10,
            marginBottom: 5
          }
        ]}
      >
        <Text
          style={{
            fontFamily: 'Gotham-Light',
            color: '#000',
            fontSize: 14
          }}
        >
          {this.lang.CUR_LANG == 'en' ? obj.msg : obj.msg_ar}
        </Text>
      </View>
    );
  }

  render() {
    const k =
      this.props.auth.user_role == 'client' ? (
        <SlideMenu2
          navigation={this.props.navigation}
          onItemSelected={this.onMenuItemSelected.bind(this)}
        />
      ) : (
        <SlideMenu
          navigation={this.props.navigation}
          onItemSelected={this.onMenuItemSelected.bind(this)}
        />
      );
    this.menuObj = this.state.isOpen ? k : false;

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
            <View
              style={{
                justifyContent: 'flex-start',
                flexDirection: 'row',
                width: '100%',
                marginTop: 50,
                alignSelf: 'stretch',
                alignItems: 'center'
              }}
            >
              <View style={globalStyles.inputWrapNoBorder}>
                <Button
                  rounded
                  color={
                    this.state.role == 'messages' ? '#fff' : Colors.primary
                  }
                  backgroundColor={
                    this.state.role == 'messages' ? Colors.primary : '#fff'
                  }
                  loading={this.state.loading_messages}
                  buttonStyle={globalStyles.ButtonTab}
                  containerViewStyle={{
                    width: '100%',
                    flex: 1
                  }}
                  onPress={() =>
                    this.setState({role: 'messages'}, () => {
                      this.fetchMessages();
                    })
                  }
                  title={this.lang.MESSAGES}
                />
                <Button
                  rounded
                  color={this.state.role == 'events' ? '#fff' : Colors.primary}
                  backgroundColor={
                    this.state.role == 'events' ? Colors.primary : '#fff'
                  }
                  buttonStyle={globalStyles.ButtonTab}
                  loading={this.state.loading_events}
                  containerViewStyle={{
                    width: '100%',
                    flex: 1
                  }}
                  onPress={() =>
                    this.setState({role: 'events'}, () => {
                      this.fetchEvents();
                    })
                  }
                  title={this.lang.EVENTS}
                />
              </View>
            </View>

            {this.state.role == 'events' ? (
              <ScrollView>
                <Text style={{textAlign: 'center'}}>
                  {this.lang.START_CHAT}
                </Text>
                <View style={globalStyles.innerContainer}>
                  {this.state.eventsData.map((obj, i) => {
                    return this.renderMessage(obj, i);
                  })}
                  <View style={globalStyles.emptySpace} />
                </View>
              </ScrollView>
            ) : (
              false
            )}
            {this.state.role == 'messages' ? (
              <ScrollView>
                <Text style={{textAlign: 'center'}}>
                  {this.lang.START_CHAT}
                </Text>
                <View style={globalStyles.innerContainer}>
                  {this.state.messagesData.map((obj, i) => {
                    return this.renderSaloon(obj, i);
                  })}
                  <View style={globalStyles.emptySpace} />
                </View>
              </ScrollView>
            ) : (
              false
            )}
          </View>
        </SideMenu>
      </View>
    );
  }
}

// const styles = StyleSheet.create({});

const mapStateToProps = state => {
  return {
    messages: state.messages,
    auth: state.auth,
    language: state.language
  };
};

export default connect(mapStateToProps)(MyOrders);
