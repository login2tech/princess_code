import {connect} from 'react-redux';
import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';

import constants from '../../utils/Constants.js';
import {
  globalStyles,
  // Colors,
  // Paddings,
  getLanguageStrings,
} from '../../utils/Theme';
import {Card, Icon, Header} from 'react-native-elements';
import SideMenu from 'react-native-side-menu';
import SlideMenu2 from './../SlideMenu';
import {
  Image,
  ImageBackground,
  Linking,
  FlatList,
  Platform,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
const width = Dimensions.get('window').width;
// import PropTypes from 'prop-types';

import mainColor from '../constants';
import TopRightArea from '../../modules/TopRightArea';
import Email from '../Email';
import Details from '../../modules/Details';
import Separator from '../Separator';
import Tel from '../Tel';
const endpoint = constants.BASE_URL;
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
  },
  emailContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 35,
  },
  headerContainer: {},
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  userImage: {
    borderColor: mainColor,
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
});

class ProviderProfile extends Component {
  // static propTypes = {
  //   avatar: PropTypes.string,
  //   avatarBackground: PropTypes.string,
  //   name: PropTypes.string,
  //   address: PropTypes.shape({
  //     'city': PropTypes.string,
  //     country: PropTypes.string,
  //   }),
  //   emails: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       email: PropTypes.string,
  //       id: PropTypes.number,
  //       name: PropTypes.string,
  //     })
  //   ),
  //   tels: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       id: PropTypes.number,
  //       name: PropTypes.string,
  //       number: PropTypes.string,
  //     })
  //   ),
  // }

  onPressPlace = () => {
    // console.log('place');
  };

  onPressTel = number => {
    Linking.openURL(`tel://${number}`).catch(
      err => {},
      //console.log('Error:', err)
    );
  };

  onPressSms = () => {
    // console.log('sms')
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isOpen: false,
      telDS: [{number: this.props.auth.user.phone_number, key: 0}],
      emailDS: [{email: this.props.auth.user.email, key: 0}],
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

  onPressEmail = email => {
    Linking.openURL(`mailto://${email}?subject=Hi&body=Hi`).catch(
      err => {}, //console.log('Error:', err)
    );
  };
  onPressInsta = email => {
    Linking.openURL(`https://instagram.com/${email}`).catch(
      err => {}, // console.log('Error:', err)
    );
  };

  getListing() {
    fetch(
      endpoint +
        '?action=get_user_info&role=' +
        this.props.auth.user_role +
        '&id=' +
        this.props.auth.user.id,
    )
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        if (responseJson.ok && responseJson.data) {
          this.setState({
            data: responseJson.data,
          });
        } else {
          // alert(responseJson.error);
        }
      })
      .catch(error => {
        // console.error(error);
        // alert(this.lang.UNABLE_TO_FETCH_LISTING);
      });
  }

  componentDidMount() {
    this.getListing();
  }

  goToList() {
    // const {navigate} = this.props.navigation;

    const navigateAction = NavigationActions.navigate({
      routeName: 'UnreadOrders',
      params: {},
      action: NavigationActions.navigate({routeName: 'UnreadOrders'}),
    });
    this.props.navigation.dispatch(navigateAction);
  }

  renderHeader = () => {
    // alert( JSON.stringify(this.props.auth ))
    const avatarBackground =
      'http://princessapp.co/wp-content/uploads/2018/08/mountain_background_by_pukahuna-d73zlo5.png';
    const avatar =
      'https://ui-avatars.com/api/?background=f64e59&color=fff&size=500&name=' +
      this.props.auth.user.name;
    const name = this.props.auth.user.name;

    // const address = {city: 'india', country: 'india'};

    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          style={styles.headerBackgroundImage}
          blurRadius={10}
          source={{
            uri: avatarBackground,
          }}>
          <Header
            backgroundColor={'transparent'}
            style={[globalStyles.header, {borderBottomWidth: 0, padding: 0}]}
            outerContainerStyles={{
              paddingTop: 0,
              paddingBottom: 0,
              height: 30,
              borderBottomWidth: 0,
            }}
            leftComponent={{
              icon: 'arrow-back',
              color: '#fff',
              onPress: () => {
                this.goBack();
              },
            }}
            // rightComponent={{ icon: 'account-circle', color: '#fff',style:  {paddingRight:10} ,
            rightComponent={
              <TopRightArea goToList={this.goToList.bind(this)} />
            }
            // onPress: ()=>{this.goAccount()}  }}
            // centerComponent={{ text: constants.APP_TITLE, style:  globalStyles.headerTitle }}
          />
          <View style={styles.headerColumn}>
            <Image
              style={styles.userImage}
              source={{
                uri: avatar,
              }}
            />
            <Text style={styles.userNameText}>{name}</Text>
            <View style={styles.userAddressRow}>
              <View>
                <Icon
                  name="account-circle"
                  underlayColor="transparent"
                  iconStyle={styles.placeIcon}
                  onPress={this.onPressPlace}
                />
              </View>
              <View style={styles.userCityRow}>
                <Text style={styles.userCityText}>
                  @{this.props.auth.user.username}
                </Text>
              </View>
            </View>
            <View style={styles.userAddressRow}>
              <View>
                <Icon
                  name="instagram"
                  type="material-community"
                  underlayColor="transparent"
                  iconStyle={styles.placeIcon}
                  onPress={this.onPressPlace}
                />
              </View>
              <View style={styles.userCityRow}>
                <TouchableOpacity
                  onPress={() =>
                    this.onPressInsta(this.props.auth.user.instagram)
                  }>
                  <Text style={styles.userCityText}>
                    {this.props.auth.user.instagram}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  renderTel = () => (
    <FlatList
      contentContainerStyle={styles.telContainer}
      data={this.state.telDS}
      renderItem={(item, index) => {
        return (
          <Tel
            key={`tel-${item.key}`}
            index={item.number}
            name={item.number}
            number={item.number}
            onPressSms={() => {
              this.onPressSms(item.number);
            }}
            onPressTel={() => {
              this.onPressTel(item.number);
            }}
          />
        );
      }}
    />
  );

  renderEmail = () => (
    <FlatList
      contentContainerStyle={styles.emailContainer}
      data={this.state.emailDS}
      renderItem={(item, index) => {
        // alert(JSON.stringify(item));
        item = item.item;
        return (
          <Email
            key={`email-${item.key}`}
            index={item.email}
            name={item.email}
            email={item.email}
            onPressEmail={() => {
              this.onPressEmail(item.email);
            }}
          />
        );
      }}
    />
  );

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
      <SideMenu
        isOpen={this.state.isOpen}
        onChange={this.onSideMenuChange.bind(this)}
        menu={this.menuObj}
        openMenuOffset={(width * 80) / 100}>
        <ScrollView style={styles.scroll}>
          <View style={styles.container}>
            <Card containerStyle={styles.cardContainer}>
              {this.renderHeader()}
              {this.renderTel()}
              {Separator()}
              {this.renderEmail()}
              {Separator()}
              <Details
                label={this.lang.CURRENT_REQUESTS}
                value={
                  this.state.data && this.state.data.CURRENT_REQUESTS
                    ? this.state.data.CURRENT_REQUESTS
                    : 0
                }
              />
              {Separator()}
              <Details
                label={this.lang.COMPLETED_REQUESTS}
                value={
                  this.state.data && this.state.data.COMPLETED_REQUESTS
                    ? this.state.data.COMPLETED_REQUESTS
                    : 0
                }
              />
              {Separator()}
              <Details
                label={this.lang.TOTAL_BALANCE}
                value={
                  this.state.data && this.state.data.TOTAL_BALANCE
                    ? this.state.data.TOTAL_BALANCE
                    : 0
                }
              />
              {Separator()}
              <Details
                label={this.lang.WALLET_BALANCE}
                value={
                  this.state.data && this.state.data.WALLET_BALANCE
                    ? this.state.data.WALLET_BALANCE
                    : 0
                }
              />
              {Separator()}
              <Details
                label={this.lang.CASH}
                value={
                  this.state.data && this.state.data.CASH
                    ? this.state.data.CASH
                    : 0
                }
              />
              {Separator()}
              <Details
                label={this.lang.SERVICE_FEE}
                value={
                  this.state.data && this.state.data.SERVICE_FEE
                    ? this.state.data.SERVICE_FEE
                    : 0
                }
              />
            </Card>
          </View>
        </ScrollView>
      </SideMenu>
    );
  }
}

//
const mapStateToProps = state => {
  return {
    auth: state.auth,
    language: state.language,
    messages: state.messages, // use store's data
  };
};

export default connect(mapStateToProps)(ProviderProfile);