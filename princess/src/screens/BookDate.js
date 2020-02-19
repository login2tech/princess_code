import React from 'react';
import {connect} from 'react-redux';
import {doOrder} from '../actions/register';
import {Picker} from 'react-native';
import ModalSelector from '../modules/modal_selector';

// DeviceEventEmitter
import {Header, Button, Divider, CheckBox} from 'react-native-elements';
// import RNGooglePlacePicker from 'react-native-google-place-picker';
import RNGooglePlaces from 'react-native-google-places';
import {
  globalStyles,
  Colors,
  Paddings,
  getLanguageStrings,
} from '../utils/Theme';
import constants from '../utils/Constants.js';
import TimingList from '../modules/TimingList';
import {NavigationActions} from 'react-navigation';
import CalendarPicker from 'react-native-calendar-picker';
const moment = require('moment');
const endpoint = constants.BASE_URL;
import TopRightArea from '../modules/TopRightArea';
import {
  Text,
  View,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
const {width} = Dimensions.get('window');

// import {CreditCardInput} from 'react-native-credit-card-input';

// import OppwaCore from 'react-native-oppwa';

// var Oppwa = require('r/eact-native-oppwa');

class BookDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saloon_data: {item_prices: {}},
      selected_time: null,
      selected_date: null,
      loading: false,
      visit_provider_location: false,
      credit_balance: 0,
      admin_commission: 0,
      service_fee: 0,
      paid_partial: false,
      items: [],
      saloon_loaded: false,
      user_location: '',
      slots: {},
      slot_labels: {},
      timings: [],
      // slots_bridal: 0
    };
    this.lang = getLanguageStrings(this.props.language.current);
  }

  getListing(id, package_name) {
    // console.log(package_name)
    if (!id) {
      return;
    }
    fetch(endpoint + '?action=princess_get_listing&id=' + id)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.ok && responseJson.listing) {
          const l = responseJson.listing;
          // alert(package_name);
          this.setState({
            saloon_data: l,
            saloon_loaded: true,
            slots: {
              [package_name.name]: '1',
            },
            // slot_labels: {
            //   [package_name.name]: '1',
            // },
          });
        } else {
          // alert(responseJson.error);
        }
        // this.getCreditBalance();
      })
      .catch(error => {
        // this.getCreditBalance();
        // alert(this.lang.UNABLE_TO_FETCH_LISTING)
      });
  }

  updateState(state) {
    this.setState(
      {
        items: state.params.items,
        admin_commission: state.params.admin_commission,
        service_fee: state.params.service_fee,
      },
      () => {
        this.getListing(state.params.saloon_id, state.params.package_name);
      },
    );
  }

  componentDidMount() {
    const {state} = this.props.navigation;
    this.updateState(state);
    // console.log(state.params.package_name);
  }

  goBack() {
    const toHome = NavigationActions.back();
    this.props.navigation.dispatch(toHome);
  }

  checkIfDateDisabled(p) {
    // console.log(p);
    return false;
  }

  onDateChange(a) {
    const {state} = this.props.navigation;

    const dt = moment(a).format('YYYY-MM-DD');

    fetch(
      endpoint +
        '?action=listing_times&dt=' +
        dt +
        '&id=' +
        state.params.saloon_id,
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.ok && responseJson.timings) {
          // alert(responseJson.timings.length)
          const l = responseJson.timings;
          this.setState({
            timings: l,
            selected_date: a,
            selected_time: null,
          });
        } else {
          this.setState({
            timings: [],
            selected_date: a,
            selected_time: null,
          });
        }
      })
      .catch(function(err) {
        // alert(err);
        this.setState({
          timings: [],
          selected_date: a,
          selected_time: null,
        });
      });
  }

  onTimeChange(a) {
    this.setState({selected_time: a});
  }

  doPayment() {
    if (!this.state.selected_date) {
      alert(this.lang.VALID_DATE);
      return;
    }
    if (!this.state.selected_time) {
      alert(this.lang.VALID_TIME);
      return;
    }

    if (this.subtotals < 0.1) {
      alert(this.lang.VALID_SLOT);
      return;
    }
    if (!this.state.visit_provider_location && this.state.user_location == '') {
      alert(this.lang.VALID_ADDR);
      return;
    }

    let has_main = false;
    for (let i = 0; i < this.state.items.length; i++) {
      const tmp = this.state.items[i];
      if (parseInt(this.state.slots[tmp.name]) > 0) {
        if (tmp.is_main) {
          has_main = true;
          break;
        }
      }
    }

    if (!has_main) {
      alert(this.lang.MAIN_SLOTS);
      return;
    }

    const {state} = this.props.navigation;

    this.setState({loading: true});

    const data = {
      listing_id: state.params.saloon_id,
      selected_date: moment(this.state.selected_date).format('YYYY-MM-DD'),
      selected_time: this.state.selected_time,
      end_time: this.total_end_time(this.state.selected_time),
      discount: this.discount,
      before_discount: this.before_discount,
      subtotals: this.subtotals,
      totals: this.totals,
      slots: this.state.slots,
      service_fee: this.service_fee,
      via_cash: this.payable_cash,
      paid_full: 0,
      provider_id: state.params.saloon_data.provider_id,
      client_location: this.state.visit_provider_location ? 0 : 1,
      booking_location: this.state.visit_provider_location
        ? state.params.saloon_data.visit_location
        : this.state.user_location,
      user_id: this.props.auth.user.id,
    };

    this.props.dispatch(
      doOrder(data, this.props.navigation, () => {
        this.setState({loading: false});
        // }
      }),
    );
  }

  total_end_time(start) {
    let total_time_to_add = 0;
    for (let i = 0; i < this.state.items.length; i++) {
      const tmp = this.state.items[i];
      total_time_to_add += this.state.slots[tmp.name]
        ? parseInt(this.state.slots[tmp.name]) * tmp.time
        : 0;
    }

    // const hours = parseInt(hours1) + parseInt(hours2);

    const m = moment(start, 'hh:mm a');
    m.add(total_time_to_add, 'minutes');
    return m.format('hh:mm a');
  }

  showLocationPicker() {
    RNGooglePlaces.openAutocompleteModal({}, ['placeID']).then(place => {
      // alert(place.address);
      // alert(response.address)
      // console.log(response)
      // if (response.didCancel) {
      //   // alert('you cancelled')
      //   // console.log('User cancelled GooglePlacePicker');
      // } else if (response.error) {
      //   // alert(response.error)
      //   console.log('PlacePicker Error: ', response.error);
      // } else {
      this.setState({
        user_location: place.address ? place.address : '',
      });
      // }
    });
  }

  renderSaloon() {
    const {state} = this.props.navigation;
    // console.log(state.params);
    const obj = state.params.saloon_data;
    // const saloon_id = state.params.saloon_id;

    const minDate = new Date(); // Today

    this.single =
      state.params.package_name === 'normal_price'
        ? obj.normal_service_price
        : obj.bridal_service_price;

    this.before_discount = 0;

    // let total_slots = 0;

    for (let i = 0; i < this.state.items.length; i++) {
      const tmp = this.state.items[i];
      this.before_discount += this.state.slots[tmp.name]
        ? parseInt(this.state.slots[tmp.name]) *
          this.state.saloon_data.item_prices[tmp.name]
        : 0;
    }
    this.before_discount = this.before_discount.toFixed(2);
    this.before_discount = parseFloat(this.before_discount);

    if (this.state.visit_provider_location) {
      if (obj.discount_type == 'percentage') {
        this.discount = (obj.discount_my_location * this.before_discount) / 100;
      } else {
        this.discount = parseFloat(obj.discount_my_location);
      }
      this.discount = this.discount.toFixed(2);
      this.discount = parseFloat(this.discount);
    } else {
      this.discount = 0.0;
    }

    this.subtotals = this.before_discount - this.discount;
    this.service_fee = (this.state.service_fee / 100) * this.subtotals;
    this.service_fee = this.service_fee.toFixed(2);
    this.service_fee = parseFloat(this.service_fee);
    this.totals = this.subtotals + this.service_fee;
    this.totals = this.totals.toFixed(2);
    this.totals = parseFloat(this.totals);

    if (this.totals < 0) {
      this.totals = 0;
    }
    this.payable_cash = (4 * this.totals) / 5;

    this.payable_cash = this.payable_cash.toFixed(2);
    this.payable_cash = parseFloat(this.payable_cash);

    this.payable_online = this.totals - this.payable_cash;

    this.payable_online = this.payable_online.toFixed(2);
    this.payable_online = parseFloat(this.payable_online);

    let bookable_days = obj.bookable_days;
    bookable_days = JSON.parse(bookable_days);
    const allowedDates = bookable_days[1] ? bookable_days[1] : [];
    bookable_days = bookable_days[0];

    this.secondaryRow = {
      padding: 5,
      flexDirection:
        this.props.language.current == 'en' ? 'row' : 'row-reverse',
    };

    return (
      <View>
        <View style={[globalStyles.saloon_card, {padding: Paddings.big}]}>
          <CalendarPicker
            scaleFactor={width + 2 * Paddings.big + 20}
            minDate={minDate}
            disabledDays={bookable_days}
            allowedDates={allowedDates}
            alwaysAvailable={obj.always_available == 1 ? true : false}
            todayBackgroundColor={Colors.pinkBg}
            disabledDatesFunc={f => {
              return this.checkIfDateDisabled(f);
            }}
            selectedDayColor={Colors.button}
            // selectedDayStyle={{backgroundColor:olors.pram}}
            onDateChange={a => {
              this.onDateChange(a);
            }}
            mainColor={Colors.primary}
            selectedDayTextColor="#FFFFFF"
          />
        </View>

        <Text
          style={[
            globalStyles.salooon_card_title,
            {
              textAlign: this.props.language.current == 'en' ? 'left' : 'right',
            },
          ]}>
          {this.lang.SERVICES}
        </Text>
        {!this.state.saloon_loaded && <ActivityIndicator />}
        {this.state.items.map((item, i) => {
          if (
            !this.state.saloon_data.item_prices[item.name] ||
            this.state.saloon_data.item_prices[item.name] == 'no'
          ) {
            return false;
          }
          let cities = [
            {
              key: '0',
              value: '0',
              label:
                this.lang.SLOTS +
                ' ' +
                (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),
            },
            {
              key: '1',
              value: '1',
              label:
                this.lang.SLOTS +
                '1 x ' +
                (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),
            },
            {
              key: '2',
              value: '2',
              label:
                this.lang.SLOTS +
                '2 x ' +
                (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),
            },
            {
              key: '3',
              value: '3',
              label:
                this.lang.SLOTS +
                '3 x ' +
                (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),
            },
            {
              key: '4',
              value: '4',
              label:
                this.lang.SLOTS +
                '4 x ' +
                (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),
            },
            {
              key: '5',
              value: '5',
              label:
                this.lang.SLOTS +
                '5 x ' +
                (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),
            },
            {
              key: '6',
              value: '6',
              label:
                this.lang.SLOTS +
                '6 x ' +
                (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),
            },
            {
              key: '7',
              value: '7',
              label:
                this.lang.SLOTS +
                '7 x ' +
                (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),
            },
            {
              key: '8',
              value: '8',
              label:
                this.lang.SLOTS +
                '8 x ' +
                (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),
            },
          ];

          let cities_label = {
            key_0:
              this.lang.SLOTS +
              ' ' +
              (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),

            key_1:
              this.lang.SLOTS +
              '1 x ' +
              (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),

            key_2:
              this.lang.SLOTS +
              '2 x ' +
              (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),

            key_3:
              this.lang.SLOTS +
              '3 x ' +
              (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),

            key_4:
              this.lang.SLOTS +
              '4 x ' +
              (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),

            key_5:
              this.lang.SLOTS +
              '5 x ' +
              (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),

            key_6:
              this.lang.SLOTS +
              '6 x ' +
              (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),

            key_7:
              this.lang.SLOTS +
              '7 x ' +
              (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),

            key_8:
              this.lang.SLOTS +
              '8 x ' +
              (this.lang.CUR_LANG === 'en' ? item.name : item.name_ar),
          };
          return (
            <View
              style={[globalStyles.saloon_card, {padding: Paddings.big}]}
              key={item.name}>
              <ModalSelector
                data={cities}
                initValue={this.state.slots[item.name]}
                onChange={option => {
                  // this.setState({
                  // city: option[this.lang.LANG],
                  // city_obj: option,
                  const slots = JSON.parse(JSON.stringify(this.state.slots));
                  slots[item.name] = option.value;
                  this.setState({slots: slots});
                  // });
                }}>
                <TextInput
                  style={{
                    padding: 10,
                    height: 40,
                  }}
                  editable={false}
                  value={
                    cities_label[
                      'key_' +
                        (this.state.slots[item.name]
                          ? this.state.slots[item.name]
                          : '0')
                    ]
                  }
                />
              </ModalSelector>
              {/*}
              <Picker
                selectedValue={this.state.slots[item.name]}
                style={{height: 50, width: '100%'}}
                onValueChange={(itemValue, itemIndex) => {
                  const slots = JSON.parse(JSON.stringify(this.state.slots));
                  slots[item.name] = itemValue;
                  this.setState({slots: slots});
                }}>
                <Picker.Item
                  label={
                    this.lang.SLOTS +
                    ' ' +
                    (this.lang.CUR_LANG == 'en' ? item.name : item.name_ar)
                  }
                  value="0"
                />
                <Picker.Item
                  label={
                    '1 x ' +
                    (this.lang.CUR_LANG == 'en' ? item.name : item.name_ar)
                  }
                  value="1"
                />
                <Picker.Item
                  label={
                    '2 x ' +
                    (this.lang.CUR_LANG == 'en' ? item.name : item.name_ar)
                  }
                  value="2"
                />
                <Picker.Item
                  label={
                    '3 x ' +
                    (this.lang.CUR_LANG == 'en' ? item.name : item.name_ar)
                  }
                  value="3"
                />
                <Picker.Item
                  label={
                    '4 x ' +
                    (this.lang.CUR_LANG == 'en' ? item.name : item.name_ar)
                  }
                  value="4"
                />
                <Picker.Item
                  label={
                    '5 x ' +
                    (this.lang.CUR_LANG == 'en' ? item.name : item.name_ar)
                  }
                  value="5"
                />
                <Picker.Item
                  label={
                    '6 x ' +
                    (this.lang.CUR_LANG == 'en' ? item.name : item.name_ar)
                  }
                  value="6"
                />
                <Picker.Item
                  label={
                    '7 x ' +
                    (this.lang.CUR_LANG == 'en' ? item.name : item.name_ar)
                  }
                  value="7"
                />
                <Picker.Item
                  label={
                    '8 x ' +
                    (this.lang.CUR_LANG == 'en' ? item.name : item.name_ar)
                  }
                  value="8"
                />
              </Picker>*/}
            </View>
          );
        })}

        <Text
          style={[
            globalStyles.salooon_card_title,
            {
              textAlign: this.props.language.current == 'en' ? 'left' : 'right',
            },
          ]}>
          {this.lang.START_SERVICE_TIME}
        </Text>
        <View style={globalStyles.saloon_card}>
          {this.state.selected_date ? (
            this.state.timings.length ? (
              <TimingList
                timings={this.state.timings}
                selectedTime={this.state.selected_time}
                onTimeSelect={a => {
                  this.onTimeChange(a.item);
                }}
              />
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  paddingTop: 10,
                  paddingBottom: 10,
                }}>
                {this.lang.NO_TIME_AVAIL}
              </Text>
            )
          ) : (
            <Text
              style={{textAlign: 'center', paddingTop: 10, paddingBottom: 10}}>
              {this.lang.SELECT_DATE_FIRST}
            </Text>
          )}
        </View>
        <Text
          style={[
            globalStyles.salooon_card_title,
            {
              textAlign: this.props.language.current == 'en' ? 'left' : 'right',
            },
          ]}>
          {this.lang.SERVICE_LOCATION}
        </Text>
        {parseInt(obj.at_provider_location) ? (
          <View style={globalStyles.saloon_card}>
            <CheckBox
              title={this.lang.VISIT_PROVIDER_LOCATION}
              checked={this.state.visit_provider_location}
              onPress={() =>
                this.setState({
                  visit_provider_location: !this.state.visit_provider_location,
                })
              }
            />
          </View>
        ) : (
          false
        )}

        {parseInt(obj.go_to_customer_home) &&
        !this.state.visit_provider_location ? (
          <View style={[globalStyles.saloon_card, {padding: 10}]}>
            <Text>{this.lang.YOUR_LOC}:</Text>
            <TextInput
              enablesReturnKeyAutomatically
              returnKeyType={'next'}
              placeholder={this.lang.TYPE_HERE}
              placeholderTextColor={Colors.primary}
              style={{
                backgroundColor: '#fff',
                marginTop: 5,
                marginBottom: 5,
                borderRadius: 10,
              }}
              onChangeText={user_location => this.setState({user_location})}
              value={this.state.user_location}
            />

            <Button
              containerViewStyle={{
                width: '60%',
                marginLeft: '20%',
                marginBottom: 10,
                flex: 1,
              }}
              backgroundColor={Colors.primary}
              onPress={() => {
                this.showLocationPicker();
              }}
              rounded
              title={this.lang.OR_PICK_LOCATION}
              buttonStyle={globalStyles.Button}
            />
          </View>
        ) : (
          <View style={[globalStyles.saloon_card, {padding: 10}]}>
            <Text>
              {this.lang.AREA_WILL} {obj.visit_location}
            </Text>
          </View>
        )}

        <Text
          style={[
            globalStyles.salooon_card_title,
            {
              textAlign: this.props.language.current == 'en' ? 'left' : 'right',
            },
          ]}>
          {this.lang.PAYMENT_INFO}
        </Text>
        <View style={globalStyles.saloon_card}>
          <View style={globalStyles.saloon_card_det_wrap}>
            {this.state.selected_time ? (
              <View
                style={[
                  globalStyles.row,
                  {
                    padding: 5,
                    flexDirection:
                      this.props.language.current == 'en'
                        ? 'row'
                        : 'row-reverse',
                  },
                ]}>
                <View style={globalStyles.col}>
                  <Text>{this.lang.ITEM_DETAILS}</Text>
                </View>
                <View style={globalStyles.col2}>
                  <Text> : </Text>
                </View>
                <View style={globalStyles.col}>
                  <Text
                    style={{
                      textAlign:
                        this.props.language.current == 'en' ? 'left' : 'right',
                    }}>
                    {this.state.selected_time} to{' '}
                    {this.total_end_time(this.state.selected_time)}
                  </Text>
                </View>
              </View>
            ) : (
              false
            )}

            {this.state.selected_time ? (
              <Divider style={{backgroundColor: Colors.primary}} />
            ) : (
              false
            )}

            <View style={[globalStyles.row, this.secondaryRow]}>
              <View style={globalStyles.col}>
                <Text>{this.lang.BILL_TOTALS}</Text>
              </View>
              <View style={globalStyles.col2}>
                <Text> : </Text>
              </View>
              <View style={globalStyles.col}>
                <Text
                  style={{
                    textAlign:
                      this.props.language.current == 'en' ? 'left' : 'right',
                  }}>
                  SAR {this.before_discount}
                </Text>
              </View>
            </View>
            <Divider style={{backgroundColor: Colors.primary}} />

            <View style={[globalStyles.row, this.secondaryRow]}>
              <View style={globalStyles.col}>
                <Text>{this.lang.DISCOUNT}</Text>
              </View>
              <View style={globalStyles.col2}>
                <Text> : </Text>
              </View>
              <View style={globalStyles.col}>
                <Text
                  style={{
                    textAlign:
                      this.props.language.current == 'en' ? 'left' : 'right',
                  }}>
                  SAR {this.discount}
                </Text>
              </View>
            </View>
            <Divider style={{backgroundColor: Colors.primary}} />
            <View style={[globalStyles.row, this.secondaryRow]}>
              <View style={globalStyles.col}>
                <Text>{this.lang.SUB_TOTAL}</Text>
              </View>
              <View style={globalStyles.col2}>
                <Text> : </Text>
              </View>
              <View style={globalStyles.col}>
                <Text
                  style={{
                    textAlign:
                      this.props.language.current == 'en' ? 'left' : 'right',
                  }}>
                  SAR {this.subtotals}
                </Text>
              </View>
            </View>
            <Divider style={{backgroundColor: Colors.primary}} />

            <View style={[globalStyles.row, this.secondaryRow]}>
              <View style={globalStyles.col}>
                <Text>{this.lang.SERVICE_FEE}</Text>
              </View>
              <View style={globalStyles.col2}>
                <Text> : </Text>
              </View>
              <View style={globalStyles.col}>
                <Text
                  style={{
                    textAlign:
                      this.props.language.current == 'en' ? 'left' : 'right',
                  }}>
                  {this.state.service_fee}% (SAR {this.service_fee})
                </Text>
              </View>
            </View>
            <Divider style={{backgroundColor: Colors.primary}} />

            <View style={[globalStyles.row, this.secondaryRow]}>
              <View style={globalStyles.col}>
                <Text>{this.lang.TOTAL}</Text>
              </View>
              <View style={globalStyles.col2}>
                <Text> : </Text>
              </View>
              <View style={globalStyles.col}>
                <Text
                  style={{
                    textAlign:
                      this.props.language.current == 'en' ? 'left' : 'right',
                  }}>
                  SAR {this.totals}
                </Text>
              </View>
            </View>
            <Divider style={{backgroundColor: Colors.primary}} />

            <View style={[globalStyles.row, this.secondaryRow]}>
              <View style={globalStyles.col}>
                <Text>{this.lang.PAY_ONLINE}</Text>
              </View>
              <View style={globalStyles.col2}>
                <Text> : </Text>
              </View>
              <View style={globalStyles.col}>
                <Text
                  style={{
                    textAlign:
                      this.props.language.current == 'en' ? 'left' : 'right',
                  }}>
                  SAR {this.payable_online}
                </Text>
              </View>
            </View>
            <Divider style={{backgroundColor: Colors.primary}} />

            <View style={[globalStyles.row, this.secondaryRow]}>
              <View style={globalStyles.col}>
                <Text>{this.lang.PAY_CASH}</Text>
              </View>
              <View style={globalStyles.col2}>
                <Text> : </Text>
              </View>
              <View style={globalStyles.col}>
                <Text
                  style={{
                    textAlign:
                      this.props.language.current == 'en' ? 'left' : 'right',
                  }}>
                  SAR {this.payable_cash}
                </Text>
              </View>
            </View>
            <Divider style={{backgroundColor: Colors.primary}} />
          </View>
        </View>

        <Button
          containerViewStyle={{
            width: '100%',
            flex: 1,
            marginLeft: 0,
            marginRight: 0,
          }}
          backgroundColor={Colors.primary}
          onPress={() => {
            this.doPayment();
            // this.setState({
            //   isCardInput: true
            // });
          }}
          loading={this.state.loading}
          disabled={
            this.state.loading || !this.state.slots || !this.state.saloon_loaded
          }
          rounded
          title={this.lang.BOOK_SLOTS}
          buttonStyle={globalStyles.Button}
        />
      </View>
    );
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
            },
          }}
          rightComponent={<TopRightArea goToList={this.goToList.bind(this)} />}
          centerComponent={{
            text: constants.APP_TITLE,
            style: globalStyles.headerTitle,
          }}
        />
        <View>
          <ScrollView>
            <View style={globalStyles.innerContainer}>
              {/*this.renderSaloon()*/}
              {this.renderSaloon()}
              {/*!this.state.isCardInput
                ? this.renderSaloon()
                : this.renderCardInput()*/}
              <View style={globalStyles.emptySpace} />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    messages: state.messages,
    auth: state.auth,
    language: state.language,
  };
};

export default connect(mapStateToProps)(BookDate);
