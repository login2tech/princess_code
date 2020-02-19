import React from 'react';
import {connect} from 'react-redux';
import {GiftedChat} from 'react-native-gifted-chat';
import constants from '../utils/Constants.js';
import {Header} from 'react-native-elements';
const endpoint = constants.BASE_URL;
import TopRightArea from '../modules/TopRightArea';
import {NavigationActions} from 'react-navigation';

import {globalStyles, Colors} from '../utils/Theme';
import {View, Text} from 'react-native';

import AccessoryBar from '../modules/AccessoryBar'
// import CustomActions from '../modules/CustomActions'
import CustomView from '../modules/CustomView'
class Chat extends React.Component {
  state = {
    messages: []
  };

  fetchChat() {
    const {state} = this.props.navigation;
    const order_id = state.params.order_id;

    fetch(
      endpoint +
        '?action=list_msgs&order_id=' +
        order_id +
        '&role=' +
        this.props.auth.user_role
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.ok && responseJson.msgs) {
          const l = responseJson.msgs;
          const len = l.length;
          let tmp = {};
          const msgs = [];
          let nm = '';
          for (let i = 0; i < len; i++) {
            nm = l[i].msg_by == 'client' ? l[i].c_name : l[i].p_name;
            tmp = {
              _id: l[i].id,
              text: l[i].msg,
              read_msg : l[i].read_msg,
              location : l[i].location,
              image : l[i].image,
              createdAt: new Date(),
              user: {
                _id:
                  l[i].msg_by == 'client'
                    ? 'C' + l[i].user_id
                    : 'P' + l[i].provider_id,
                name: nm,
                avatar:
                  'https://ui-avatars.com/api/?background=f64e59&color=fff&size=500&name=' +
                  nm
              }
            };
            msgs.push(tmp);
          }
          this.setState({
            messages: msgs
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

  componentDidMount() {
    this.fetchChat();
  }

  goBack() {
    const toHome = NavigationActions.back();
    this.props.navigation.dispatch(toHome);
  }

  onSend(messages = [], skip_append) {
    // alert(JSON.stringify(messages));
    if (!messages.length) {
      return;
    }
    messages = messages[0];

    const {state} = this.props.navigation;
    const order_id = state.params.order_id;
    const user_id = state.params.user_id;
    const me = this.props.auth.user;
    const provider_id = state.params.provider_id;

    fetch(endpoint + '?action=new_msg', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'new_msg',
        text: messages.text ?  messages.text  :'',
        order_id: order_id,
        location : messages.location?messages.location : false,
        image : messages.image?messages.image:false,
        provider_id: provider_id,
        user_id: user_id,
        msg_by: this.props.auth.user_role
      })
    }).then(function(){

    }).catch(function(err){alert(err.message);})
    messages.user = {
      _id: this.props.auth.user_role == 'client' ? 'C' + me.id : 'P' + me.id,
      name: me.name,
      avatar:
        'https://ui-avatars.com/api/?background=f64e59&color=fff&size=500&name=' +
        me.name
    };
    // if(!)
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
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


  onSendFromUser = (messages = []) => {
    // alert(messages);
    const createdAt = new Date()
    const messagesToUpload = messages.map(message => ({
      ...message,
      // user,
      createdAt,
      _id: Math.round(Math.random() * 1000000),
    }))
    this.onSend(messagesToUpload)
  }

  renderAccessory = () => <AccessoryBar onSend={this.onSendFromUser}  />
  //
  // renderCustomActions = props => {
  //   return <CustomActions {...props} onSend={this.onSendFromUser} />
  // }
  renderCustomView(props) {
    return <CustomView {...props} />
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
              this.goBack();
            }
          }}
          rightComponent={<TopRightArea goToList={this.goToList.bind(this)} />}
          centerComponent={{
            text: constants.APP_TITLE,
            style: globalStyles.headerTitle
          }}
        />

        <GiftedChat
          messages={this.state.messages}
          keyboardShouldPersistTaps={'handled'}
          showUserAvatar={true}
          text={this.state.text}
          onInputTextChanged={text => this.setState({ text })}
          isAnimated
          renderCustomView={this.renderCustomView}
renderTicks = {(currentMessage) => {
   // i
  return (
    <View>

        {currentMessage.read_msg == 1 ? (
           <Text style={[  { color: 'blue', fontSize:10 }]}>✓✓ </Text>
         ): (
           <Text style={[  { color: 'lightblue', fontSize:10 }]}>✓ </Text>
         )}
    </View>
  )
} }
          renderAvatarOnTop
          scrollToBottom
          renderAccessory={this.renderAccessory}
          // renderActions={this.renderCustomActions}
          onSend={message => this.onSend(message)}
          alwaysShowSend={
            this.state.text ? true : false || this.state.image ? true : false
          }
          user={{
            _id:
              this.props.auth.user_role == 'client'
                ? 'C' + this.props.auth.user.id
                : 'P' + this.props.auth.user.id,
            name: this.props.auth.user.name,
            avatar:
              'https://ui-avatars.com/api/?background=f64e59&color=fff&size=500&name=' +
              this.props.auth.user.name
          }}
        />
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

export default connect(mapStateToProps)(Chat);
