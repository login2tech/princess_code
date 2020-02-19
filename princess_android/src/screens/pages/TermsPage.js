import React from 'react';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {Header, Avatar, Text} from 'react-native-elements';
import {globalStyles, Colors, getLanguageStrings} from '../../utils/Theme';
import constants from '../../utils/Constants.js';
import SideMenu from 'react-native-side-menu';
import {View, Dimensions, ScrollView, Linking} from 'react-native';
const width = Dimensions.get('window').width;
import SlideMenu2 from './../SlideMenu2';
import SlideMenu from './../SlideMenu';
// const endpoint = constants.BASE_URL;
import TopRightArea from '../../modules/TopRightArea';
class TermsPage extends React.Component {
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

  goBack() {
    const toHome = NavigationActions.back();
    this.props.navigation.dispatch(toHome);
  }
  openURL(url) {
    Linking.openURL(url).catch(err => {});
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
    // const list2 = [
    //   {
    //     name: '+91-999-999-9999',
    //     action: 'tel://+91-999-999-9999',
    //     icon: 'local-phone',
    //     subtitle: this.lang.PHONE
    //   }
    // ];
    //

    //
    // const {state} = this.props.navigation;

    // this.menuObj = this.state.isOpen ?  (<SlideMenu2 navigation={this.props.navigation}  onItemSelected={this.onMenuItemSelected.bind(this)}  />) : false;

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
                  source={require('../../assets/images/logo2.png')}
                  onPress={() => {}}
                  activeOpacity={0.7}
                />
              </View>
            </View>

            <View style={{flex: 5}}>
              <ScrollView>
                <View>
                  <Text style={{fontSize: 30, textAlign: 'center'}}>Terms</Text>
                  <Text style={{fontSize: 20}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec luctus odio at bibendum feugiat. Aliquam id odio odio.
                    Suspendisse consequat sapien purus, quis eleifend felis
                    ultrices sed. Nunc odio ligula, tincidunt id vulputate vel,
                    vestibulum vel quam. Cras in feugiat sapien, quis volutpat
                    odio. Ut malesuada orci vitae tempor condimentum. Donec orci
                    justo, sagittis non faucibus ut, eleifend a ante. Praesent
                    feugiat enim ac dui luctus sodales. Donec bibendum odio non
                    diam euismod feugiat. Sed pellentesque, sapien in tincidunt
                    ultricies, dui lacus rutrum eros, in facilisis sem lectus et
                    sapien.
                    {'\n\n'}
                    Aliquam erat volutpat. Ut lacinia ligula vel ex malesuada,
                    vel maximus nulla euismod. Mauris eu mattis mi. Fusce
                    imperdiet ex quis nisl laoreet auctor. Donec imperdiet
                    ultricies blandit. Quisque luctus est id bibendum lobortis.
                    Cras nec massa augue. Nulla at dapibus sem. Sed ac dapibus
                    orci. Fusce eu ornare neque. Morbi tellus sapien, tempus a
                    orci feugiat, tristique tincidunt nisi.
                    {'\n\n'}
                    In vel nisi quis felis posuere volutpat. Aliquam nec velit
                    nunc. Cras in tortor eget tortor dapibus mattis. Praesent
                    pulvinar mauris ut dolor porta cursus. Nullam at nisi quis
                    dui convallis ornare. Sed bibendum nisi sed pulvinar congue.
                    Pellentesque ac urna eros. Phasellus augue nisl, malesuada
                    at finibus nec, faucibus id libero. Quisque sollicitudin
                    urna eget justo lobortis mollis. Suspendisse varius interdum
                    tellus, sit amet tristique diam sagittis id. Etiam lectus
                    sem, dictum at purus ac, vehicula semper elit. Nam posuere
                    arcu nec est interdum varius. Etiam id ullamcorper nulla.
                    Donec molestie felis sit amet efficitur porttitor.
                    Vestibulum suscipit congue nisi. Nam non varius lacus.
                    {'\n\n'}
                    Sed at purus velit. Sed sem eros, iaculis quis rutrum sit
                    amet, dignissim eu purus. Sed elementum nibh in dolor
                    aliquet tincidunt. Vestibulum eleifend arcu in enim lobortis
                    tincidunt. Maecenas et ligula quis libero tempor dictum. Sed
                    malesuada non quam vel dignissim. Integer semper cursus
                    elementum. Duis ornare, felis sit amet hendrerit pretium,
                    massa elit ornare ex, sed ultrices nisl urna vitae odio.
                    Nunc scelerisque posuere turpis quis accumsan. Vestibulum
                    ante ipsum primis in faucibus orci luctus et ultrices
                    posuere cubilia Curae;
                    {'\n\n'}
                    Cras metus augue, accumsan a ex in, ullamcorper efficitur
                    nibh. Donec erat velit, tempor quis sapien at, porttitor
                    pretium ligula. Integer diam neque, blandit ac nisl a,
                    feugiat fermentum leo. Mauris diam leo, bibendum ut magna
                    mollis, commodo ornare nisl. Praesent iaculis orci purus,
                    nec eleifend sapien condimentum vel. Nulla pharetra, leo eu
                    congue fermentum, odio enim fermentum velit, ac finibus
                    ligula mauris eget justo. Vivamus ut mi sed turpis vehicula
                    cursus. Ut pellentesque tellus ac metus scelerisque
                    venenatis nec at enim. Maecenas metus tellus, finibus eget
                    elementum ut, iaculis id ante. Vivamus quis urna sit amet
                    neque mollis malesuada.
                  </Text>
                </View>
              </ScrollView>
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

export default connect(mapStateToProps)(TermsPage);
