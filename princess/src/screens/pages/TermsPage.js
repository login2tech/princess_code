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
      order_data: [],
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
      action: NavigationActions.navigate({routeName: 'UnreadOrders'}),
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
      this.props.auth.user_role === 'client' ? (
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
          openMenuOffset={(width * 80) / 100}>
          <Header
            backgroundColor={Colors.primary}
            style={globalStyles.header}
            leftComponent={{
              icon: 'arrow-back',
              color: '#fff',
              onPress: () => {
                this.goBack();
              },
            }}
            rightComponent={
              <TopRightArea goToList={this.goToList.bind(this)} />
            }
            centerComponent={{
              text: constants.APP_TITLE,
              style: globalStyles.headerTitle,
            }}
          />
          <View style={globalStyles.innerContainer}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
                    PRINCESS privacy policy This privacy policy governs the way
                    PRINCESS collects, uses, maintains and authorizes
                    information collected by PRINCESS application users. This
                    privacy policy applies in the app and all PRINCESS products
                    and services.
                  </Text>

                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                    Personal identification information:
                  </Text>
                  <Text style={{fontSize: 20}}>
                    PRINCESS collects personally identifiable information from
                    users in different ways, including but not limited to when
                    the user visits the application, registering in the PRINCESS
                    application, completing the application, questionnaire
                    analysis form, and other activities, services, features or
                    resources we may provide on our application. Users may be
                    asked to indicate their full name, email address, phone
                    number, or credit card details.
                  </Text>

                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                    Non-personal information:
                  </Text>

                  <Text style={{fontSize: 20}}>
                    PRINCESS collects information about users wherever they
                    interact with the application. This information is not
                    personally identifiable, but may include the type of
                    smartphone and technical information about the user's
                    communication methods, such as the company used to provide
                    Internet service and other similar information. How we use
                    the information collected: PRINCESS collects and uses
                    personal information of users for the following purposes: •
                    Improve customer service quality. Your information helps us
                    more easily respond to your customer service requests and
                    support needs more effectively. • To improve the
                    application. We continuously strive to improve the offers
                    made through the application or our website in accordance
                    with the information and feedback we receive from you. •
                    Send emails periodically. The email address that users
                    register to process their request will only be used to send
                    them information and updates related to their request. It
                    may also be used to respond to inquiries, or other requests
                    or questions. If the user decides to join our mailing list,
                    he or she will receive emails that may include news,
                    updates, and application information. If the user at any
                    time wishes to cancel the registration to receive any future
                    messages, we provide him with detailed instructions on the
                    cancellation of registration at the end of each message on
                    his email, or the user can communicate with us through the
                    application or our website. How we protect your information:
                    We follow proper procedures and security standards in the
                    collection, archiving and handling of data, in order to
                    protect that data against unauthorized handling,
                    modification, disclosure or destruction of your personal
                    data, username, password, information regarding your
                    transactions and data stored on our application. Sensitive
                    and private data is exchanged between PRINCESS and its users
                    through secure communication channels and is encrypted and
                    protected by approved digital methods and methods. Share
                    personal data: At PRINCESS, we do not sell, trade, or lease
                    users' personal identity data to third parties.We may share
                    aggregated public demographic information that is not linked
                    to any personal identity information of visitors and users
                    with our partners, affiliates and advertisers for the
                    purposes described above. We may use a third party service
                    provider to assist us in the conduct of our business and
                    also in the work of the application or in the management of
                    activities on our behalf, such as sending newsletters or
                    surveys. We may share your data with this third party for
                    the purposes specified in the event that you have given us
                    permission to do so. Third Party Sites: Users may find
                    advertisements or other content on our application with
                    links to the sites and services of our partners, suppliers,
                    advertisers, sponsors, licensors, or other third party
                    entities. Please note that we do not control the content or
                    links that appear on those sites and are not responsible for
                    the practices of sites linked to our site. In addition,
                    those sites or services, including content and links, may
                    change constantly. These sites and services have their own
                    privacy policy and customer service policies. Browsing and
                    interacting with any other site, including sites that link
                    to our application, is subject to the terms and policies of
                    those sites. Changes to our Privacy Policy: PRINCESS has the
                    discretion to update this Privacy Policy at any time. When
                    we do, the user should review the update date at the bottom
                    of this page, and we'll send an email. We encourage users to
                    review our Privacy Policy frequently for changes so that
                    they are aware of what we do to protect the personal data we
                    collect. The User acknowledges and accepts his
                    responsibility to periodically review this Privacy Policy
                    and to be aware of the amendments. Agree to the Terms of
                    Use: By using this application, you agree to our privacy
                    policy and the terms and conditions governing the use of
                    this application. If you do not agree to this policy, you
                    should not use our application. You acknowledge that your
                    continued use of the Application after changes to this
                    Policy or the Terms and Conditions of Use of the Application
                    have been announced will be deemed your acceptance of such
                    changes. to contact us: If you have any questions regarding
                    this Privacy Policy, the practices of this app, or your
                    dealings with the app, you can contact us at:
                  </Text>
                  <Text style={{fontSize: 20}}>
                    Contact@princessplatform.com 05-10-2019
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
    auth: state.auth, // use store's data
  };
};

export default connect(mapStateToProps)(TermsPage);
