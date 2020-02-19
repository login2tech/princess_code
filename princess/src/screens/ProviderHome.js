import React from 'react';
import SideMenu from 'react-native-side-menu';
import {connect} from 'react-redux';

import ModalSelector from '../modules/modal_selector';
import {providerListing} from '../actions/register';
import {
  Header,
  Button,
  Icon,
  CheckBox,
  FormLabel,
  Divider,
} from 'react-native-elements';
//import RNGooglePlacePicker from 'react-native-google-place-picker';
import RNGooglePlaces from 'react-native-google-places';
import {globalStyles, Colors, getLanguageStrings} from '../utils/Theme';
import cities from '../languages/cities';
import constants from '../utils/Constants.js';
import YesNoSwitch from '../modules/YesNoSwitch';
import SlideMenu from './SlideMenu';
import {NavigationActions} from 'react-navigation';
// import PhotoUpload from 'react-native-photo-upload'
// import Gallery                             from 'react-native-image-gallery';
const endpoint = constants.BASE_URL;
import TopRightArea from '../modules/TopRightArea';
import {
  View,
  // Picker,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  textBox1: {
    flex: 0.2,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 10,
  },
});

class ProviderHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      loading: false,
      contact_no: this.props.user ? this.props.user.phone_number : null,
      location: null,
      colony: null,
      city: '',
      do_bridal_makeup: 0,
      other_cities: 0,
      visit_location: '',
      go_to_customer_home: 0,
      at_provider_location: 0,
      items: [],
      item_prices: {},
      discount_my_location: null,
      discount_type: 'flat',
      listing_name: '',
      description: '',
      bookable_hours: '',
      bookable_days: [],
      image_url: null,
      gallery: [],
      booking_status: 'available',
      terms_check: false,
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

  componentWillReceiveProps(newProps) {
    if (this.props.language.current != newProps.language.current) {
      this.lang = getLanguageStrings(newProps.language.current);
    }
  }

  componentDidMount() {
    // const {state} = this.props.navigation;
    //provider_id
    // console.log( endpoint+'?action=princess_my_listing&provider_id='+this.props.auth.user.id );
    fetch(
      endpoint +
        '?action=princess_my_listing&provider_id=' +
        this.props.auth.user.id,
    )
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        if (responseJson.listing) {
          const l = responseJson.listing;
          this.setState({
            at_provider_location: parseInt(l.at_provider_location),
            contact_no: l.contact,
            location: l.location,
            colony: l.colony,
            city: l.city ? l.city : '',
            do_bridal_makeup: parseInt(l.do_bridal_makeup),

            other_cities: parseInt(l.other_cities),
            visit_location: l.visit_location,
            go_to_customer_home: parseInt(l.go_to_customer_home),
            discount_my_location: l.discount_my_location,
            discount_type: l.discount_type,
            listing_name: l.listing_name,
            description: l.description,
            terms_check: true,
            booking_status: l.booking_status,

            item_prices: l.item_prices,
          });
        }

        fetch(endpoint + '?action=list_services')
          .then(response2 => response2.json())
          .then(responseJson2 => {
            this.setState({
              items: responseJson2.items,
            });
          })
          .catch(error => {
            // alert('unable to fetch your listing details');
          });
      })
      .catch(error => {
        alert('unable to fetch your listing details');
      });
  }

  showLocationPicker(type) {
    if (!type) {
      type = 'location';
    }
    RNGooglePlaces.openAutocompleteModal({}, ['placeID']).then(response => {
      if (response.didCancel) {
        //
      } else if (response.error) {
        console.log('PlacePicker Error: ', response.error);
      } else {
        this.setState({
          [type]: response.address ? response.address : '',
        });
      }
    });
  }

  updateListing() {
    if (this.state.terms_check == false) {
      alert(this.lang.ACCEPT_TERMS);
      return;
    }

    if (this.state.at_provider_location && !this.state.visit_location) {
      alert(this.lang.ACCEPT_TERMS);
      return;
    }

    let has_main = false;

    for (let i = 0; i < this.state.items.length; i++) {
      if (this.state.items[i].is_main) {
        if (
          this.state.item_prices[this.state.items[i].name] &&
          this.state.item_prices[this.state.items[i].name] != 'no' &&
          parseFloat(this.state.item_prices[this.state.items[i].name]) > 0
        ) {
          has_main = true;
        }
      }
    }
    if (!has_main) {
      alert(this.lang.ENTER_PRICE);
      return;
    }
    this.setState({loading: true});
    this.props.dispatch(
      providerListing(
        {
          contact_no: this.state.contact_no,
          location: this.state.location,
          colony: this.state.colony,
          city: this.state.city,
          do_bridal_makeup: this.state.do_bridal_makeup,

          visit_location: this.state.visit_location,

          other_cities: this.state.other_cities,
          go_to_customer_home: this.state.go_to_customer_home,
          at_provider_location: this.state.at_provider_location,
          discount_my_location: this.state.discount_my_location,
          discount_type: this.state.discount_type,
          listing_name: this.state.listing_name,
          description: this.state.description,
          // bookable_hours: this.state.bookable_hours,
          booking_status: this.state.booking_status,
          item_prices: this.state.item_prices,
          // bookable_days: this.state.bookable_days,
          // image_url: this.state.image_url,
          // gallery: this.state.gallery
        },
        this.props.auth.user.id,
        this.props.navigation,
        () => {
          this.setState({loading: false});
        },
      ),
    );
  }
  goTo(path) {
    const navigateAction = NavigationActions.navigate({
      routeName: path,
      params: {},
      action: NavigationActions.navigate({routeName: path}),
    });
    this.props.navigation.dispatch(navigateAction);
  }

  goToList() {
    const navigateAction = NavigationActions.navigate({
      routeName: 'UnreadOrders',
      params: {},
      action: NavigationActions.navigate({routeName: 'UnreadOrders'}),
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    this.menuObj = this.state.isOpen ? (
      <SlideMenu
        navigation={this.props.navigation}
        onItemSelected={this.onMenuItemSelected.bind(this)}
      />
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
              icon: 'menu',
              color: '#fff',
              onPress: () => {
                this.toggleSideMenu();
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
            <ScrollView>
              <View>
                <FormLabel
                  labelStyle={{color: Colors.primary, textAlign: 'center'}}>
                  {this.lang.LBL_USER_NAME}
                </FormLabel>
                <View style={styles.textBox1}>
                  <TextInput
                    editable={false}
                    style={globalStyles.inputWithBox}
                    underlineColorAndroid="transparent"
                    placeholderTextColor={Colors.primary}
                    value={this.props.auth.user.username}
                  />
                </View>

                <FormLabel
                  labelStyle={{color: Colors.primary, textAlign: 'center'}}>
                  {this.lang.LBL_EMAILADDRESS}
                </FormLabel>
                <View style={styles.textBox1}>
                  <TextInput
                    editable={false}
                    style={globalStyles.inputWithBox}
                    underlineColorAndroid="transparent"
                    placeholderTextColor={Colors.primary}
                    value={this.props.auth.user.email}
                  />
                </View>

                <FormLabel
                  labelStyle={{color: Colors.primary, textAlign: 'center'}}>
                  {this.lang.LBL_LISTING_NAME}
                </FormLabel>
                <View style={styles.textBox1}>
                  <TextInput
                    enablesReturnKeyAutomatically
                    returnKeyType={'next'}
                    style={globalStyles.inputWithBox}
                    underlineColorAndroid="transparent"
                    placeholderTextColor={Colors.primary}
                    onChangeText={listing_name => this.setState({listing_name})}
                    value={this.state.listing_name}
                    placeholder={this.lang.PlACE_LISTING_NAME}
                  />
                </View>

                <FormLabel
                  labelStyle={{color: Colors.primary, textAlign: 'center'}}>
                  {this.lang.LBL_DESC}
                </FormLabel>
                <View style={styles.textBox1}>
                  <TextInput
                    enablesReturnKeyAutomatically
                    returnKeyType={'done'}
                    multiline
                    style={globalStyles.inputWithBoxMultiline}
                    underlineColorAndroid="transparent"
                    placeholderTextColor={Colors.primary}
                    onChangeText={description => this.setState({description})}
                    value={this.state.description}
                    placeholder={this.lang.PLACE_DESC}
                  />
                </View>

                <FormLabel
                  labelStyle={{color: Colors.primary, textAlign: 'center'}}>
                  {this.lang.LBL_PLACE_CONTACT}
                </FormLabel>
                <View style={styles.textBox1}>
                  <TextInput
                    enablesReturnKeyAutomatically
                    returnKeyType={'next'}
                    keyboardType={'phone-pad'}
                    style={globalStyles.inputWithBox}
                    underlineColorAndroid="transparent"
                    placeholderTextColor={Colors.primary}
                    onChangeText={contact_no => this.setState({contact_no})}
                    value={this.state.contact_no}
                    placeholder={this.lang.PLACE_CONTACT}
                  />
                </View>

                <FormLabel
                  labelStyle={{color: Colors.primary, textAlign: 'center'}}>
                  {this.lang.LBL_ADDERSS}
                </FormLabel>
                <View style={globalStyles.row}>
                  <View style={[globalStyles.col80]}>
                    <TextInput
                      enablesReturnKeyAutomatically
                      returnKeyType={'next'}
                      style={globalStyles.inputWithBox}
                      underlineColorAndroid="transparent"
                      placeholderTextColor={Colors.primary}
                      onChangeText={location => this.setState({location})}
                      value={this.state.location}
                      placeholder={this.lang.PLACE_ADDR}
                    />
                  </View>
                  <View style={globalStyles.col20}>
                    <Icon
                      name="google-maps"
                      type="material-community"
                      size={15}
                      reverse
                      color={Colors.primary}
                      onPress={() => {
                        this.showLocationPicker();
                      }}
                    />
                  </View>
                </View>

                <FormLabel
                  labelStyle={{color: Colors.primary, textAlign: 'center'}}>
                  {this.lang.LBL_NEIGHBOURHOOD}
                </FormLabel>

                <View style={styles.textBox1}>
                  <TextInput
                    enablesReturnKeyAutomatically
                    returnKeyType={'next'}
                    style={globalStyles.inputWithBox}
                    underlineColorAndroid="transparent"
                    placeholderTextColor={Colors.primary}
                    onChangeText={colony => this.setState({colony})}
                    value={this.state.colony}
                    placeholder={this.lang.PLACE_COLONY}
                  />
                </View>

                <FormLabel
                  labelStyle={{color: Colors.primary, textAlign: 'center'}}>
                  {this.lang.LBL_CITY}
                </FormLabel>
                <View style={styles.textBox1}>
                  <View
                    style={[
                      globalStyles.inputWithBox,
                      {paddingRight: 20, paddingBottom: 10},
                    ]}>
                    <ModalSelector
                      data={cities}
                      initValue={this.lang.DAY_START}
                      onChange={option => {
                        this.setState({
                          city: option[this.lang.LANG],
                          city_obj: option,
                        });
                      }}>
                      <TextInput
                        style={{
                          padding: 10,
                          height: 40,
                        }}
                        editable={false}
                        value={
                          this.state.city_obj &&
                          this.state.city_obj[this.lang.LANG]
                            ? this.state.city_obj[this.lang.LANG]
                            : this.lang.DROP_CITY
                        }
                      />
                    </ModalSelector>
                  </View>
                </View>

                <Divider
                  style={{backgroundColor: Colors.primary, marginBottom: 40}}
                />

                {/*}<FormLabel
                  labelStyle={{color: Colors.primary, textAlign: 'center'}}
                >
                  {this.lang.LEAVE_EMPTY}
                </FormLabel>*/}
                {this.state.items.map((item, i) => {
                  return [
                    <View
                      key={i}
                      style={{
                        backgroundColor: '#eee',
                        marginBottom: 20,
                        padding: 10,
                        borderRadius: 5,
                      }}>
                      <CheckBox
                        title={
                          this.lang.LANG == 'en' ? item.name : item.name_ar
                        }
                        checked={
                          typeof this.state.item_prices[item.name] !==
                            'undefined' &&
                          this.state.item_prices[item.name] != 'no'
                            ? true
                            : false
                        }
                        onPress={() => {
                          let new_val = 0;
                          if (this.state.item_prices[item.name] == 'no') {
                            //
                          } else {
                            new_val = 'no';
                          }
                          const item_prices = JSON.parse(
                            JSON.stringify(this.state.item_prices),
                          );
                          item_prices[item.name] = new_val;
                          this.setState({item_prices: item_prices});
                        }}
                      />
                      {this.state.item_prices[item.name] != 'no' ? (
                        <View
                          style={[styles.textBox1, {flexDirection: 'column'}]}
                          key={'item_' + item.name + '_' + 2}>
                          <FormLabel
                            key={'item_' + item.name + '_' + 1}
                            labelStyle={{
                              color: Colors.primary,
                              textAlign: 'left',
                            }}>
                            {this.lang.LBL_PRICE_FOR +
                              ' ' +
                              (this.lang.LANG == 'en'
                                ? item.name
                                : item.name_ar)}
                          </FormLabel>
                          <TextInput
                            enablesReturnKeyAutomatically
                            returnKeyType={'next'}
                            keyboardType={'numeric'}
                            style={globalStyles.inputWithBox}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={'#444'}
                            onChangeText={normal_price => {
                              const item_prices = JSON.parse(
                                JSON.stringify(this.state.item_prices),
                              );
                              item_prices[item.name] = normal_price;
                              this.setState({item_prices: item_prices});
                            }}
                            value={
                              this.state.item_prices[item.name]
                                ? this.state.item_prices[item.name]
                                : ''
                            }
                            placeholder={
                              this.lang.LBL_PRICE_FOR + ' ' + item.name
                            }
                          />
                        </View>
                      ) : (
                        false
                      )}
                    </View>,
                  ];
                })}

                <Divider
                  style={{backgroundColor: Colors.primary, marginBottom: 40}}
                />

                <FormLabel
                  labelStyle={{color: Colors.primary, textAlign: 'center'}}>
                  {this.lang.LBL_CLIENT_LOC}
                </FormLabel>
                <YesNoSwitch
                  primaryColor={Colors.primary}
                  secondaryColor={Colors.pinkBg}
                  val={this.state.go_to_customer_home}
                  update={v => {
                    this.setState({go_to_customer_home: v});
                  }}
                />

                <FormLabel
                  labelStyle={{color: Colors.primary, textAlign: 'center'}}>
                  {this.lang.LBL_OTHER_CITIES}
                </FormLabel>
                <YesNoSwitch
                  primaryColor={Colors.primary}
                  secondaryColor={Colors.pinkBg}
                  val={this.state.other_cities}
                  update={v => {
                    this.setState({other_cities: v});
                  }}
                />

                <FormLabel
                  labelStyle={{color: Colors.primary, textAlign: 'center'}}>
                  {this.lang.LBL_AT_UR_LOC}
                </FormLabel>
                <YesNoSwitch
                  primaryColor={Colors.primary}
                  secondaryColor={Colors.pinkBg}
                  val={this.state.at_provider_location}
                  update={v => {
                    this.setState({at_provider_location: v});
                  }}
                />
                {this.state.at_provider_location ? (
                  <View style={globalStyles.row}>
                    <View style={globalStyles.col80}>
                      <FormLabel
                        labelStyle={{
                          color: Colors.primary,
                          textAlign: 'center',
                        }}>
                        {this.lang.LBL_VISIT_ADDR}
                      </FormLabel>
                      <TextInput
                        enablesReturnKeyAutomatically
                        returnKeyType={'next'}
                        style={globalStyles.inputWithBox}
                        underlineColorAndroid="transparent"
                        placeholderTextColor={Colors.primary}
                        onChangeText={visit_location =>
                          this.setState({visit_location})
                        }
                        value={this.state.visit_location}
                        placeholder={this.lang.LBL_VISIT_ADDR}
                      />
                    </View>
                    <View style={globalStyles.col20}>
                      <FormLabel
                        labelStyle={{
                          color: Colors.primary,
                          textAlign: 'center',
                        }}>
                        {' '}
                      </FormLabel>
                      <Icon
                        name="google-maps"
                        type="material-community"
                        size={15}
                        reverse
                        color={Colors.primary}
                        onPress={() => {
                          this.showLocationPicker('visit_location');
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  false
                )}
                {this.state.at_provider_location ? (
                  <View>
                    <FormLabel
                      labelStyle={{color: Colors.primary, textAlign: 'center'}}>
                      {this.lang.LBL_DISCOUNT_AMOUNT}
                    </FormLabel>
                    <View style={styles.textBox1}>
                      <TextInput
                        enablesReturnKeyAutomatically
                        returnKeyType={'next'}
                        keyboardType={'numeric'}
                        style={globalStyles.inputWithBox}
                        underlineColorAndroid="transparent"
                        placeholderTextColor={Colors.primary}
                        onChangeText={discount_my_location =>
                          this.setState({discount_my_location})
                        }
                        value={this.state.discount_my_location}
                        placeholder={this.lang.LBL_DISC}
                      />
                    </View>
                  </View>
                ) : (
                  false
                )}
                {this.state.at_provider_location ? (
                  <View>
                    <FormLabel
                      labelStyle={{color: Colors.primary, textAlign: 'center'}}>
                      {this.lang.DISCOUNT_TYPE}
                    </FormLabel>
                    <YesNoSwitch
                      primaryColor={Colors.primary}
                      secondaryColor={Colors.pinkBg}
                      val1={'flat'}
                      val2={'percentage'}
                      label1={this.lang.FLAT}
                      label2={this.lang.PERCENTAGE}
                      val={this.state.discount_type}
                      update={v => {
                        this.setState({discount_type: v});
                      }}
                    />
                  </View>
                ) : (
                  false
                )}

                <Divider style={{backgroundColor: Colors.primary}} />

                <View style={styles.textBox1}>
                  <CheckBox
                    title={this.lang.TERMS_CHECK}
                    checked={this.state.terms_check}
                    onPress={() =>
                      this.setState({terms_check: !this.state.terms_check})
                    }
                  />
                </View>
                <View style={styles.textBox1}>
                  <Button
                    containerViewStyle={{width: '100%', flex: 1}}
                    color={Colors.primary}
                    title={this.lang.TAP_TO_READ}
                    textStyle={{fontSize: 12}}
                    backgroundColor={'transparent'}
                    onPress={() => this.goTo('Terms')}
                  />
                </View>

                <FormLabel
                  labelStyle={{color: Colors.primary, textAlign: 'center'}}>
                  {this.lang.LBL_LISTING_AVAILABILITY}
                </FormLabel>
                <View style={styles.textBox1}>
                  <YesNoSwitch
                    primaryColor={Colors.primary}
                    secondaryColor={Colors.pinkBg}
                    val1={'available'}
                    val2={'unavailable'}
                    label1={this.state.AVAILABLE}
                    label2={this.state.UNAVAILABLE}
                    val={this.state.booking_status}
                    update={v => {
                      this.setState({booking_status: v});
                    }}
                  />
                </View>

                <View style={styles.textBox1}>
                  <Button
                    containerViewStyle={{width: '100%', flex: 1}}
                    backgroundColor={Colors.primary}
                    onPress={() => {
                      this.updateListing();
                    }}
                    loading={this.state.loading}
                    disabled={this.state.loading}
                    rounded
                    title={this.lang.BTN_UPDATE_LIST}
                    buttonStyle={globalStyles.Button}
                  />
                </View>
                <View style={globalStyles.emptySpace} />
              </View>
            </ScrollView>
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

export default connect(mapStateToProps)(ProviderHome);
