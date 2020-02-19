import React from 'react';
import {connect} from 'react-redux';
import {Header, Button, Icon} from 'react-native-elements';
import {globalStyles, Colors, getLanguageStrings} from '../utils/Theme';
import constants from '../utils/Constants.js';
import {NavigationActions} from 'react-navigation';

import TopRightArea from '../modules/TopRightArea';
import {Text, View, BackHandler} from 'react-native';

class BookingSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saloon_data: [],
      selected_time: null,
      selected_date: null,
      loading: false,
      visit_provider_location: false
    };
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

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress
    );
  }

  pressBack() {
    const navigateAction = NavigationActions.navigate({
      routeName: 'MyOrders',
      params: {},
      action: NavigationActions.navigate({routeName: 'MyOrders'})
    });
    this.props.navigation.dispatch(navigateAction);
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress() {
    return true;
  }
  //   BackHandler.addEventListener('hardwareBackPress', function() {
  //   // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
  //   // Typically you would use the navigator here to go to the last state.
  //
  //   if (!this.onMainScreen()) {
  //     this.goBack();
  //     return true;
  //   }
  //   return false;
  // });

  goBack() {
    const navigateAction = NavigationActions.navigate({
      routeName: 'MyOrders',
      params: {},
      action: NavigationActions.navigate({routeName: 'MyOrders'})
    });
    this.props.navigation.dispatch(navigateAction);
  }

  renderSuccess() {
    const {state} = this.props.navigation;

    const booking_no = state.params.booking_id;
    return (
      <View
        style={{
          flexDirection: 'column',
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center'
        }}
      >
        <View style={{flex: 1.7, alignSelf: 'center', width: '100%'}}>
          <Icon
            name="check"
            size={60}
            iconStyle={{color: '#fff'}}
            containerStyle={{
              backgroundColor: 'green',
              borderRadius: 40,
              height: 80,
              width: 80,
              alignSelf: 'center',
              zIndex: 1
            }}
          />
          <View
            style={{
              paddingTop: 30,
              paddingLeft: 30,
              paddingRight: 30,
              backgroundColor: '#fff',
              position: 'relative',
              marginTop: -40,
              zIndex: 0,
              minHeight: 200,
              width: '100%'
            }}
          >
            <Text
              style={[
                globalStyles.headings,
                {fontSize: 50, textAlign: 'center', color: 'green'}
              ]}
            >
              {this.lang.SUCESS_ORDER}
            </Text>
            <Text
              style={[
                globalStyles.headings,
                {fontSize: 20, textAlign: 'center'}
              ]}
            >
              {' '}
            </Text>
            <Text
              style={[
                globalStyles.headings,
                {fontSize: 20, textAlign: 'center'}
              ]}
            >
              {' '}
            </Text>
            <Text
              style={[
                globalStyles.headings,
                {fontSize: 20, textAlign: 'center', color: 'green'}
              ]}
            >
              {this.lang.SUCCESS_MSG_1}
            </Text>
            <Text
              style={[
                globalStyles.headings,
                {fontSize: 20, textAlign: 'center', color: 'green'}
              ]}
            >
              {this.lang.SUCECSS_MSG_2}
            </Text>
            <Text
              style={[
                globalStyles.headings,
                {fontSize: 20, textAlign: 'center'}
              ]}
            >
              {this.lang.BOOKING_STATUS_MSG+' #' + booking_no}
            </Text>
          </View>
        </View>

        <View style={{flex: 0.3, justifyContent: 'center'}}>
          <Button
            rightIcon={{name: 'arrow-forward', type: 'material'}}
            containerViewStyle={{
              flex: 1,
              marginLeft: 0,
              marginRight: 0,
              alignItems: 'center'
            }}
            backgroundColor={Colors.primary}
            onPress={this.pressBack.bind(this)}
            loading={this.state.loading}
            disabled={this.state.loading}
            rounded
            buttonStyle={globalStyles.Button}
            title={this.lang.TO_ORDERS}
          />
        </View>
      </View>
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

  render() {
    return (
      <View style={globalStyles.containerSplash}>
        <Header
          backgroundColor={Colors.primary}
          style={globalStyles.header}
          leftComponent={{
            icon: 'arrow-back',
            color: '#fff',
            onPress: () => {
              const navigateAction = NavigationActions.navigate({
                routeName: 'Home',
                params: {},
                action: NavigationActions.navigate({routeName: 'Home'})
              });
              this.props.navigation.dispatch(navigateAction);
            }
          }}
          rightComponent={<TopRightArea goToList={this.goToList.bind(this)} />}
          centerComponent={{
            text: constants.APP_TITLE,
            style: globalStyles.headerTitle
          }}
        />
        {/* <View> */}
        {/* <ScrollView > */}
        <View style={globalStyles.innerContainer}>{this.renderSuccess()}</View>

        {/* </ScrollView> */}
        {/* </View> */}
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

export default connect(mapStateToProps)(BookingSuccess);
