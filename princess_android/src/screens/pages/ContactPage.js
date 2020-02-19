import React from 'react';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {
  Header,
  List,
  ListItem,
  Avatar,
  SocialIcon
} from 'react-native-elements';
import {globalStyles, Colors, getLanguageStrings} from '../../utils/Theme';
import constants from '../../utils/Constants.js';
import SideMenu from 'react-native-side-menu';
import {View, Dimensions, Linking} from 'react-native';
const width = Dimensions.get('window').width;
import SlideMenu2 from './../SlideMenu2';
import SlideMenu from './../SlideMenu';
//const endpoint = constants.BASE_URL;
import TopRightArea from '../../modules/TopRightArea';
class ContactPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      filter: '',
      sort: '',
      order_data: []
    };

    this.lang = getLanguageStrings(this.props.language.current);
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

  openURL(url) {
    Linking.openURL(url).catch(err => {});
  }

  goBack() {
    const toHome = NavigationActions.back();
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
    const list = [
      {
        name: 'admin@princessapp.co',
        icon: 'email',
        subtitle: this.lang.EMAIL,
        action: 'mailto:admin@princessapp.co'
      }
    ];

    const list2 = [
      {
        name: '00966560020121',
        action: 'tel://00966560020121',
        icon: 'local-phone',
        subtitle: this.lang.PHONE
      }
    ];

    const list3 = [
      {
        name: 'http://princessapp.co',
        icon: 'web',
        action: 'http://princessapp.co',
        subtitle: this.lang.WEBSITE
      }
    ];

    // const {state} = this.props.navigation;

    this.menuObj = this.state.isOpen ? (
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
      )
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
          <View style={globalStyles.innerContainer}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            >
              <View>
                <Avatar
                  large
                  rounded
                  source={require('../../assets/images/logo.png')}
                  onPress={() => {}}
                  activeOpacity={0.7}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                <SocialIcon
                  onPress={() => {
                    this.openURL('https://twitter.com');
                  }}
                  type="twitter"
                />
                <SocialIcon
                  onPress={() => {
                    this.openURL('https://facebook.com');
                  }}
                  type="facebook"
                />
                <SocialIcon
                  onPress={() => {
                    this.openURL('https://instagram.com');
                  }}
                  type="instagram"
                />
                <SocialIcon
                  onPress={() => {
                    this.openURL('https://medium.com');
                  }}
                  type="medium"
                />
                <SocialIcon
                  onPress={() => {
                    this.openURL('https://pinterest.com');
                  }}
                  type="pinterest"
                />
                <SocialIcon
                  onPress={() => {
                    this.openURL('https://youtube.com');
                  }}
                  type="youtube"
                />
              </View>
            </View>

            <View style={{flex: 2}}>
              <List containerStyle={{marginBottom: 20}}>
                {list.map(l => (
                  <ListItem
                    onPress={() => this.openURL(l.action)}
                    key={l.name}
                    subtitle={l.subtitle}
                    title={l.name}
                    leftIcon={{name: l.icon}}
                  />
                ))}
              </List>

              <List containerStyle={{marginBottom: 20}}>
                {list2.map(l => (
                  <ListItem
                    onPress={() => this.openURL(l.action)}
                    key={l.name}
                    subtitle={l.subtitle}
                    title={l.name}
                    leftIcon={{name: l.icon}}
                  />
                ))}
              </List>

              <List containerStyle={{marginBottom: 20}}>
                {list3.map(l => (
                  <ListItem
                    onPress={() => this.openURL(l.action)}
                    key={l.name}
                    subtitle={l.subtitle}
                    title={l.name}
                    leftIcon={{name: l.icon, type: 'materialize-community'}}
                  />
                ))}
              </List>
            </View>
          </View>
        </SideMenu>
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

export default connect(mapStateToProps)(ContactPage);
