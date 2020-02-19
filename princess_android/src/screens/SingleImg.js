import React from 'react';
import {connect} from 'react-redux';
// import { registerStep1 }                   from '../actions/registerDevice';
import {Header} from 'react-native-elements';
import {globalStyles, Colors, Paddings} from '../utils/Theme';
import constants from '../utils/Constants.js';
import {NavigationActions} from 'react-navigation';
// import Gallery from 'react-native-photo-gallery';
import TopRightArea from '../modules/TopRightArea';
import {Text, View, Dimensions, Image} from 'react-native';
const {width, height} = Dimensions.get('window');

class SingleImg extends React.Component {
  componentDidMount() {}

  goBack() {
    const toHome = NavigationActions.back();
    this.props.navigation.dispatch(toHome);
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
    const {state} = this.props.navigation;
    // alert(JSON.stringify(state));
    // this.getListing(state.params.saloon_id);
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
        <View style={globalStyles.innerContainer}>
          <Image
            source={{uri: state.params.img}}
            style={{
              width: width - Paddings.big * 2,
              height: height,
              flex: 1,
              resizeMode: 'contain'
            }}
          />
          <Text style={{textAlign: 'center', fontSize: 24}}>
            {state.params.text}
          </Text>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    language: state.language,
    messages: state.messages // use store's data
  };
};

export default connect(mapStateToProps)(SingleImg);
