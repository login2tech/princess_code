import React from 'react';
import {connect} from 'react-redux';
// import SideMenu                            from 'react-native-side-menu'
// import { register }                        from '../actions/register';
import {Header, Badge, Icon} from 'react-native-elements';
import {
  globalStyles,
  Colors,
  Paddings,
  getLanguageStrings
} from '../utils/Theme';
import constants from '../utils/Constants.js';
// import {NavigationActions}                 from 'react-navigation';
// import ScalingButton                       from '../modules/ScalingButton';
// import TopRightArea                       from '../modules/TopRightArea';
// import SlideMenu2                           from './SlideMenu2';
const moment = require('moment');

import {
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Linking
} from 'react-native';
const {width, height} = Dimensions.get('window');
const popup_height = Math.min((70 * height) / 100, 600);
const endpoint = constants.BASE_URL;

import {StackActions, NavigationActions} from 'react-navigation';

class TopRightArea extends React.Component {
  state = {unread_count: 0};

  componentDidMount() {
    setInterval(()=>{
    this.fetchD(this.props);
  }, 1000);

  }

  fetchD(p) {
    if (p && p.auth && p.user) {
      fetch(
        endpoint +
          '?action=list_msgs_count&user_id=' +
          p.auth.user.id +
          '&user_role=' +
          p.auth.user_role
      )
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.ok && responseJson.unread_count) {
            const l = responseJson.unread_count;
            this.setState({
              unread_count: l
            });
          } else {
            alert(responseJson.error);
          }
        })
        .catch(error => {
          alert(error);
          alert('unable to fetch orders');
        });
    }
  }

  componentWillReceiveProps(newProps) {
    this.fetchD(newProps);
  }
  goTo() {
    const {navigate} = this.props.navigation;

    const navigateAction = NavigationActions.navigate({
      routeName: 'UnreadOrders',
      params: {},
      action: NavigationActions.navigate({routeName: 'UnreadOrders'})
    });
    navigate.dispatch(navigateAction);
  }

  render() {
    if(!this.props.auth.user)
    return false;
    return (
      <>

      <Badge onPress={() => this.props.goToList()}
        containerStyle={{ backgroundColor: Colors.pinkBg, position:'absolute', height:25,padding:0,width:25,top:-20,right:-5, zIndex:5 }}>
        <Text style={{color:'#000',fontSize:12, lineHeight:20,height:25,position:'absolute', color:'#000'}}>{this.state.unread_count ? this.state.unread_count : '0'}</Text>
     </Badge>
 <Icon
 name="bell" type="material-community" color={'#fff'}  size={30} onPress={() => this.props.goToList()} />

      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    // messages : state.messages,
    auth: state.auth,
    language: state.language
  };
};

export default connect(mapStateToProps)(TopRightArea);
