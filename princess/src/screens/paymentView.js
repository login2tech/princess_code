import React from 'react';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {WebView, View} from 'react-native';
import {globalStyles} from '../utils/Theme';
import constants from '../utils/Constants.js';
const endpoint = constants.BASE_URL;

class paymentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  queryStringToJSON(qs) {
    qs = qs || location.search.slice(1);

    const pairs = qs.split('&');
    const result = {};
    pairs.forEach(function(p) {
      const pair = p.split('=');
      const key = pair[0];
      const value = decodeURIComponent(pair[1] || '');

      if (result[key]) {
        if (Object.prototype.toString.call(result[key]) === '[object Array]') {
          result[key].push(value);
        } else {
          result[key] = [result[key], value];
        }
      } else {
        result[key] = value;
      }
    });

    return JSON.parse(JSON.stringify(result));
  }

  _onNavigationStateChange(webViewState) {
    if (webViewState.loading != false) {
      return;
    }
    // console.log(webViewState)
    if (webViewState.url.startsWith(endpoint)) {
      let url_query = webViewState.url.replace(endpoint + '?', '');
      url_query = this.queryStringToJSON(url_query);
      //console.log(url_query);
      if ((url_query.action = 'princess_pay_success')) {
        setTimeout(() => {
          this.goTo('BookingSuccess');
        }, 1000);
      } else {
        // alert('Paym')
        // failed redirect to failed page
      }
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

  render() {
    const {state} = this.props.navigation;

    // console.log(state);
    return (
      <View style={globalStyles.containerSplash}>
        <View style={globalStyles.innerContainer}>
          <WebView
            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
            javaScriptEnabled
            source={{uri: state.params.links[0]}}
            style={{marginTop: 20}}
            scalesPageToFit
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    messages: state.messages, // use store's data
    language: state.language,
    auth: state.auth // use store's data
  };
};

export default connect(mapStateToProps)(paymentView);
