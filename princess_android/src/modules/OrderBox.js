/*eslint max-len: ["error", { "code": 150 }]*/

import React from 'react';
import {Button, Icon} from 'react-native-elements';
import {globalStyles, Colors, getLanguageStrings} from '../utils/Theme';
const moment = require('moment');
const fontFamily = 'Gotham-Light';
import {
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Linking
} from 'react-native';
const item_data = {
  'Standard Makeup': {
    name: 'Standard Makeup',
    name_ar: '\u0645\u0643\u064a\u0627\u062c \u0633\u0647\u0631\u0629',
    is_main: true,
    time: 60
  },
  'Bridal Makeup': {
    name: 'Bridal Makeup',
    name_ar: '\u0645\u0643\u064a\u0627\u062c \u0639\u0631\u0648\u0633',
    is_main: true,
    time: 30
  },
  'Standard Hair Style': {
    name: 'Standard Hair Style',
    name_ar: '\u062a\u0633\u0631\u064a\u062d\u0629 \u0633\u0647\u0631\u0629',
    is_main: false,
    time: 30
  },
  'Bridal Hair Style': {
    name: 'Bridal Hair Style',
    name_ar: '\u062a\u0633\u0631\u064a\u062d\u0629 \u0639\u0631\u0648\u0633',
    is_main: false,
    time: 30
  }
};
export default class OrderBox extends React.Component {
  onPressAddress = number => {
    Linking.openURL(`https://maps.google.com/?q=${number}`).catch(
      err => {
        //console.log('Error:', err)
      }
      //
    );
  };

  renderOrderStatus(st) {
    if (st == 'Pending Confirmation') {
      return this.lang.ST_PENDING_CONFIRM;
    }
    if (st == 'Pending Payment') {
      return this.lang.ST_PENDING_PAYMENT;
    }
    if (st == 'Rejected') {
      return this.lang.ST_REJECTED;
    }
    if (st == 'Cancelled') {
      return this.lang.ST_CANCELLED;
    }
    if (st == 'Confirmed') {
      return this.lang.ST_CONFIRMED;
    }

    return st;
  }

  isCancellable(date, time) {
    const new_m = moment().add(2, 'days');
    const o_m = moment('' + date + ' ' + time, 'YYYY-MM-DD HH:mm a');
    // alert(o_m.format('lll'));
    if (new_m.isAfter(o_m)) {
      return false;
    }
    return true;
  }

  constructor(props) {
    super(props);
    this.state = {obj: props.obj, is_more: false};
    this.lang = getLanguageStrings(this.props.language.current);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.obj.p_id != newProps.obj.p_id) {
      this.setState({
        obj: newProps.obj,
        is_more: false
      });
    }

    if (this.props.language.current != newProps.language.current) {
      this.lang = getLanguageStrings(newProps.language.current);
    }
  }

  render() {
    const obj = this.props.obj;
    // var obj_i = this.props.obj_i;
    // alert(JSON.stringify(obj))
    const isMode = this.props.isMode;
    // alert(isMode)
    return isMode == 'client'
      ? this.renderClient(obj, 'client')
      : this.renderClient(obj, 'provider');
  }
  pad(n, width) {
    return n.length >= 6 ? n : new Array(6 - n.length + 1).join('0') + n;
  }
  total_end_time(start, hours1, hours2) {
    if (!hours1) {
      hours1 = 0;
    }
    if (!hours2) {
      hours2 = 0;
    }
    const hours = parseInt(hours1) + parseInt(hours2);

    const m = moment(start, 'hh:mm a');
    m.add(hours, 'hours');
    return m.format('hh:mm a');
  }

  shortAddr(addr) {
    return addr;
  }

  makeLanguage(slot) {
    if (item_data[slot]) {
      if (this.lang.CUR_LANG == 'ar') {
        return item_data[slot]['name_ar'];
      }
    }
    return slot;
  }

  renderClient(obj, mode) {
    const slots = JSON.parse(obj.slots);

    const avatarBackground =
      'http://princessapp.co/wp-content/uploads/2018/08/a.png';

    // console.log( obj.selected_time)
    // console.log( moment(obj.selected_time, 'hh:mm a'))
    const status = obj.p_status;
    // alert(status)
    let Bstyle;
    if (status == 'Pending Payment' || status == 'Cancelled') {
      Bstyle = globalStyles.saloon_card_red;
    } else if (status == 'Confirmed') {
      Bstyle = globalStyles.saloon_card_green;
    } else {
      Bstyle = globalStyles.saloon_card_yellow;
    }
    const end_time = this.total_end_time(
      obj.selected_time,
      obj.slots,
      obj.slots_bridal
    );
    const rowSt = {
      paddingBottom: 10,
      paddingTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      flexDirection: this.props.language.current == 'en' ? 'row' : 'row-reverse'
    };
    return (
      <View
        style={[
          {
            width: '100%',
            marginBottom: 10,
            shadowRadius: 2,
            borderRadius: 10,
            borderTopWidth: 5
          },
          Bstyle
        ]}
      >
        {/* <ImageBackground
          style={{
            paddingBottom: 0,
            paddingTop: 0
          }}
          blurRadius={20}
          source={{
            uri: avatarBackground
          }}
        > */}
        <View
          style={[
            globalStyles.row,
            {
              backgroundColor: Colors.button,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
              marginBottom: 5,

              flexDirection:
                this.props.language.current == 'en' ? 'row' : 'row-reverse'
            }
          ]}
        >
          <View style={globalStyles.col60}>
            {mode == 'provider' ? (
              <Text
                style={[
                  globalStyles.salooon_card_title,
                  {
                    fontSize: 15,
                    lineHeight: 15,
                    height: 55,
                    paddingTop: 20,
                    paddingLeft: 10,
                    fontWeight: '400',
                    paddingRight: 10,
                    textAlign:
                      this.props.language.current == 'en' ? 'left' : 'right',
                    color: '#fff'
                  }
                ]}
              >
                {obj.c_name + '\n'}
              </Text>
            ) : (
              <Text
                style={[
                  globalStyles.salooon_card_title,
                  {
                    fontSize: 15,
                    lineHeight: 15,
                    height: 55,
                    paddingTop: 20,
                    paddingLeft: 10,
                    fontWeight: '400',
                    paddingRight: 10,
                    textAlign:
                      this.props.language.current == 'en' ? 'left' : 'right',
                    color: '#fff'
                  }
                ]}
              >
                {obj.listing_name + '\n'}
              </Text>
            )}
          </View>
          <View style={globalStyles.col40}>
            <Text
              style={[
                globalStyles.salooon_card_title,
                {
                  fontSize: 15,
                  lineHeight: 15,
                  height: 55,
                  paddingTop: 20,
                  paddingLeft: 10,
                  paddingRight: 10,
                  fontWeight: '400',
                  textAlign:
                    this.props.language.current == 'en' ? 'right' : 'left',
                  color: '#fff'
                }
              ]}
            >
              #{this.pad(obj.p_id) + '\n'}
            </Text>
          </View>
        </View>
        <View
          style={[
            globalStyles.saloon_card_det_wrap,
            {
              backgroundColor: Colors.pinkBg,
              borderRadius: 5,
              marginBottom: 10
            }
          ]}
        >
          <View
            style={[
              globalStyles.row,
              {
                flexDirection:
                  this.props.language.current == 'en' ? 'row' : 'row-reverse'
              }
            ]}
          >
            <View style={globalStyles.col80}>
              <View
                style={[
                  globalStyles.row,
                  {
                    flexDirection:
                      this.props.language.current == 'en'
                        ? 'row'
                        : 'row-reverse',
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderBottomColor: '#aaa',
                    borderBottomWidth: 1
                  }
                ]}
              >
                <Text
                  style={[
                    globalStyles.col30,
                    {
                      fontSize: 14,
                      fontFamily: 'Gotham-Light'
                    }
                  ]}
                >
                  {this.lang.DATE + ':'}
                </Text>
                <Text
                  style={[
                    globalStyles.col70,
                    {
                      fontSize: 14,
                      color: '#000',
                      fontFamily: fontFamily,
                      textAlign:
                        this.props.language.current == 'en' ? 'left' : 'right'
                    }
                  ]}
                >
                  {moment(obj.selected_date, 'YYYY-MM-DD').format(
                    'ddd, DD MMM, YYYY'
                  )}{' '}
                </Text>
              </View>

              <View
                style={[
                  globalStyles.row,
                  {
                    flexDirection:
                      this.props.language.current == 'en'
                        ? 'row'
                        : 'row-reverse',
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderBottomColor: '#aaa',
                    borderBottomWidth: 1
                  }
                ]}
              >
                <Text
                  style={[
                    globalStyles.col30,
                    {
                      fontSize: 14,
                      fontFamily: 'Gotham-Light'
                    }
                  ]}
                >
                  {this.lang.TIME + ':'}
                </Text>
                <View style={[globalStyles.col70]}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#000',
                      fontFamily: fontFamily,
                      textAlign:
                        this.props.language.current == 'en' ? 'left' : 'right'
                    }}
                  >
                    {obj.selected_time + ' ' + this.lang.AND + ' '}
                    {obj.end_time ? obj.end_time : ' - -'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#222',
                      fontFamily: fontFamily,
                      textAlign:
                        this.props.language.current == 'en' ? 'left' : 'right'
                    }}
                  >
                    {'' +
                      (
                        moment(obj.end_time, 'HH:mm A').diff(
                          moment(obj.selected_time, 'HH:mm A'),
                          'minutes'
                        ) / 60
                      ).toFixed(1) +
                      ' hours'}
                    {'\n'}
                    {this.lang.PLEASE_CORDINATE}
                  </Text>
                </View>
              </View>

              {Object.keys(slots).map((slot, i) => {
                return (
                  <View
                    key={slot}
                    style={[
                      globalStyles.row,
                      {
                        flexDirection:
                          this.props.language.current == 'en'
                            ? 'row'
                            : 'row-reverse',
                        paddingTop: 10,
                        paddingBottom: 10
                      }
                    ]}
                  >
                    <Text
                      style={[
                        globalStyles.col30,
                        {
                          fontSize: 14,
                          fontFamily: 'Gotham-Light'
                        }
                      ]}
                    >
                      {this.lang.ITEM}
                    </Text>
                    <Text
                      style={[
                        globalStyles.col70,
                        {
                          fontSize: 14,
                          color: '#000',
                          fontFamily: fontFamily,
                          textAlign:
                            this.props.language.current == 'en'
                              ? 'left'
                              : 'right'
                        }
                      ]}
                    >
                      {'' + slots[slot] + ' x ' + this.makeLanguage(slot)}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={globalStyles.col20}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignContent: 'center'
                }}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems:
                      this.props.language.current == 'en'
                        ? 'flex-end'
                        : 'flex-start'
                  }}
                >
                  <TouchableHighlight
                    onPress={() =>
                      this.props.goToChat(
                        obj.p_id,
                        obj.listing_id,
                        obj.user_id,
                        obj.provider_id
                      )
                    }
                  >
                    <Icon
                      name="chat"
                      size={30}
                      type="material-community"
                      color={Colors.primary}
                    />
                  </TouchableHighlight>
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={[
                      globalStyles.salooon_card_title,
                      {
                        textAlign:
                          this.props.language.current != 'en' ? 'left' : 'right'
                      }
                    ]}
                  >
                    {'SAR ' + obj.totals}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {obj.p_status == 'Confirmed' ||
        (mode == 'client' && obj.client_location == 1) ||
        (mode == 'provider' && obj.client_location == 0) ? (
          <View
            style={[
              globalStyles.saloon_card_det_wrap,
              {
                backgroundColor: Colors.pinkBg,
                borderRadius: 5,
                marginBottom: 10
              }
            ]}
          >
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                flex: 0.9
              }}
            >
              <Icon name="location-on" color={Colors.primary} />
              <Text
                style={[
                  globalStyles.salooon_card_title,
                  {
                    fontSize: 14,
                    color: '#000',
                    paddingTop: 0,
                    textAlign: 'center',
                    fontFamily: fontFamily
                  }
                ]}
              >
                {obj.booking_location}
              </Text>
            </View>
            <View style={{alignSelf: 'flex-end', flex: 0.1}}>
              <Icon
                name="google-maps"
                type="material-community"
                color={Colors.primary}
                onPress={() => this.onPressAddress(obj.booking_location)}
              />
            </View>
          </View>
        ) : (
          <View
            style={[
              globalStyles.saloon_card_det_wrap,
              {
                backgroundColor: Colors.pinkBg,
                borderRadius: 5,
                marginBottom: 10
              }
            ]}
          >
            <View
              style={[
                globalStyles.row,
                {
                  flexWrap: 'wrap',
                  flexDirection:
                    this.props.language.current == 'en' ? 'row' : 'row-reverse'
                }
              ]}
            >
              <Icon name="location-on" color={Colors.primary} />

              <Text
                style={[
                  globalStyles.salooon_card_title,
                  {
                    fontSize: 16,
                    color: '#000',
                    textAlign: 'center',
                    fontFamily: fontFamily,
                    flexWrap: 'wrap'
                  }
                ]}
              >
                {this.shortAddr(obj.booking_location)}
              </Text>
            </View>
          </View>
        )}
        <View
          style={[
            globalStyles.saloon_card_det_wrap,
            {
              backgroundColor: Colors.pinkBg,
              borderRadius: 5,
              marginBottom: 10
            }
          ]}
        >
          <View style={[globalStyles.row]}>
            <Text
              style={[
                {width: '100%', textAlign: 'center', fontSize: 20},
                globalStyles.fontHas
              ]}
            >
              {this.renderOrderStatus(obj.p_status).toUpperCase()}
            </Text>
          </View>
        </View>
        <View
          style={[
            globalStyles.saloon_card_det_wrap,
            {
              backgroundColor: Colors.pinkBg,
              borderRadius: 5,
              marginBottom: 10
            }
          ]}
        >
          {this.state.is_more ? (
            <View>
              <View style={[globalStyles.row, rowSt]}>
                <Text
                  style={[
                    globalStyles.col40,
                    {
                      fontSize: 14,
                      fontFamily: 'Gotham-Light'
                    }
                  ]}
                >
                  {this.lang.BILL_TOTALS}
                </Text>
                <Text style={[globalStyles.col60, {fontSize: 14}]}>
                  SAR {obj.before_discount}
                </Text>
              </View>

              <View style={[globalStyles.row, rowSt]}>
                <Text
                  style={[
                    globalStyles.col40,
                    {
                      fontSize: 14,
                      fontFamily: 'Gotham-Light'
                    }
                  ]}
                >
                  {this.lang.DISCOUNT}
                </Text>
                <Text style={[globalStyles.col60, {fontSize: 14}]}>
                  SAR {obj.discount}
                </Text>
              </View>

              <View style={[globalStyles.row, rowSt]}>
                <Text
                  style={[
                    globalStyles.col40,
                    {
                      fontSize: 14,
                      fontFamily: 'Gotham-Light'
                    }
                  ]}
                >
                  {this.lang.SUB_TOTAL}
                </Text>
                <Text style={[globalStyles.col60, {fontSize: 14}]}>
                  SAR {obj.subtotals}
                </Text>
              </View>

              <View style={[globalStyles.row, rowSt]}>
                <Text
                  style={[
                    globalStyles.col40,
                    {
                      fontSize: 14,
                      fontFamily: 'Gotham-Light'
                    }
                  ]}
                >
                  {this.lang.SERVICE_FEE} (charged from customer)
                </Text>
                <Text style={[globalStyles.col60, {fontSize: 14}]}>
                  SAR {obj.service_fee}
                </Text>
              </View>

              <View style={[globalStyles.row, rowSt]}>
                <Text
                  style={[
                    globalStyles.col40,
                    {
                      fontSize: 14,
                      fontFamily: 'Gotham-Light'
                    }
                  ]}
                >
                  {this.lang.TOTALS}
                </Text>
                <Text style={[globalStyles.col60, {fontSize: 14}]}>
                  SAR {obj.totals}
                </Text>
              </View>

              {mode == 'provider' ? (
                <View style={[globalStyles.row, rowSt]}>
                  <Text
                    style={[
                      globalStyles.col40,
                      {fontSize: 14, fontFamily: 'Gotham-Light'}
                    ]}
                  >
                    {this.lang.ADMIN_COMMISSION}
                  </Text>
                  <Text style={[globalStyles.col60, {fontSize: 14}]}>
                    {obj.admin_commission}
                  </Text>
                </View>
              ) : (
                false
              )}
              {mode == 'provider' ? (
                <View style={[globalStyles.row, rowSt]}>
                  <Text
                    style={[
                      globalStyles.col40,
                      {fontSize: 14, fontFamily: 'Gotham-Light'}
                    ]}
                  >
                    {this.lang.YOUR_SHARE}
                  </Text>
                  <Text
                    style={[
                      globalStyles.col60,
                      {fontSize: 14, fontFamily: 'Gotham-Light'}
                    ]}
                  >
                    {obj.provider_share}
                  </Text>
                </View>
              ) : (
                false
              )}

              <View key={1} style={[globalStyles.row, rowSt]}>
                <Text
                  style={[
                    globalStyles.col40,
                    {fontSize: 14, fontFamily: 'Gotham-Light'}
                  ]}
                >
                  {obj.p_status == 'Confirmed'
                    ? this.lang.PAID_ONLINE
                    : this.lang.PAY_ONLINE}
                </Text>
                <Text style={[globalStyles.col60, {fontSize: 14}]}>
                  {obj.p_status == 'Confirmed'
                    ? obj.via_gateway
                    : (obj.totals - obj.via_cash).toFixed(2)}
                </Text>
              </View>

              <View key={2} style={[globalStyles.row, rowSt]}>
                <Text
                  style={[
                    globalStyles.col40,
                    {fontSize: 14, fontFamily: 'Gotham-Light'}
                  ]}
                >
                  {mode == 'provider'
                    ? this.lang.COLLECT_CASH
                    : this.lang.PAY_CASH}
                </Text>
                <Text style={[globalStyles.col60, {fontSize: 14}]}>
                  SAR {obj.via_cash}
                </Text>
              </View>
            </View>
          ) : (
            false
          )}

          <View
            style={[
              globalStyles.row,
              {
                paddingTop: this.state.is_more ? 10 : 0,
                marginTop: 10
              }
            ]}
          >
            {this.state.is_more ? (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'flex-start'
                }}
                onPress={() => {
                  this.setState({is_more: false});
                }}
              >
                <Text
                  style={[
                    {
                      width: '100%',
                      textAlign: 'center',
                      fontSize: 20,
                      flex: 15,
                      alignSelf: 'flex-start'
                    },
                    globalStyles.fontHas
                  ]}
                >
                  {this.lang.LESS_INFO}
                </Text>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start'
                  }}
                >
                  <Icon
                    name="chevron-up"
                    type="material-community"
                    color={Colors.primary}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'flex-start'
                }}
                onPress={() => {
                  this.setState({is_more: true});
                }}
              >
                <Text
                  style={[
                    {
                      width: '100%',
                      textAlign: 'center',
                      fontSize: 20,
                      flex: 15,
                      alignSelf: 'flex-start'
                    },
                    globalStyles.fontHas
                  ]}
                >
                  {this.lang.MORE_INFO}
                </Text>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start'
                  }}
                >
                  <Icon
                    name="chevron-down"
                    type="material-community"
                    color={Colors.primary}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {mode == 'client' ? (
          <View style={[globalStyles.row]}>
            {obj.p_status == 'Pending Payment' && (
              <View style={globalStyles.col}>
                <Button
                  onPress={() => {
                    this.props.processPayment(
                      obj.p_id,
                      parseFloat((obj.totals - obj.via_cash).toFixed(2)),
                      obj
                    );
                  }}
                  containerViewStyle={{
                    marginLeft: 0,
                    marginRight: 0,
                    width: '100%',
                    flex: 1
                  }}
                  buttonStyle={globalStyles.button}
                  backgroundColor={Colors.primary}
                  title={this.lang.PAY_NOW}
                />
              </View>
            )}
            {obj.p_status != 'Cancelled' &&
            obj.p_status != 'Rejected' &&
            this.isCancellable(obj.selected_date, obj.selected_time)
              ? [
                  <View style={globalStyles.col} key={1}>
                    <Button
                      onPress={() => {
                        // this.props.rejectOrder(obj.p_id, 'client');
                      }}
                      containerViewStyle={{
                        marginLeft: 0,
                        marginRight: 0,
                        width: '100%',
                        flex: 1
                      }}
                      buttonStyle={globalStyles.button}
                      backgroundColor={Colors.primary}
                      title={this.lang.MODIFY}
                    />
                  </View>,
                  <View style={globalStyles.col} key={2}>
                    <Button
                      onPress={() => {
                        this.props.rejectOrder(obj.p_id, 'client');
                      }}
                      containerViewStyle={{
                        marginLeft: 0,
                        marginRight: 0,
                        width: '100%',
                        flex: 1
                      }}
                      buttonStyle={globalStyles.button}
                      backgroundColor={Colors.primary}
                      title={this.lang.CANCEL}
                    />
                  </View>
                ]
              : false}
          </View>
        ) : (
          false
        )}

        {mode == 'provider' &&
        obj.p_status != 'Rejected' &&
        obj.p_status != 'Confirmed' &&
        obj.p_status != 'Pending Confirmation' &&
        obj.p_status != 'Cancelled' ? (
          <View style={[globalStyles.row]}>
            <View style={globalStyles.col}>
              <Button
                onPress={() => {
                  this.props.rejectOrder(obj.p_id, 'provider');
                }}
                containerViewStyle={{
                  marginLeft: 0,
                  marginRight: 0,
                  width: '100%',
                  flex: 1
                }}
                buttonStyle={globalStyles.Button}
                backgroundColor={Colors.primary}
                title={this.lang.CANCEL}
              />
            </View>
          </View>
        ) : (
          false
        )}

        {mode == 'provider' &&
        obj.p_status == 'Pending Confirmation' &&
        this.props.approveOrder ? (
          <View style={[globalStyles.row]}>
            <View style={globalStyles.col}>
              <Button
                onPress={() => {
                  this.props.approveOrder(obj.p_id);
                }}
                containerViewStyle={{
                  width: '80%',
                  flex: 1,

                  marginLeft: '10%',
                  marginRight: '10%'
                }}
                buttonStyle={[globalStyles.Button, {borderRadius: 10}]}
                backgroundColor={Colors.primary}
                title={this.lang.CONFIRM_NOW}
              />
            </View>
            <View style={globalStyles.col}>
              <Button
                onPress={() => {
                  this.props.rejectOrder(obj.p_id);
                }}
                containerViewStyle={{
                  width: '80%',
                  flex: 1,

                  marginLeft: '10%',
                  marginRight: '10%'
                }}
                buttonStyle={[globalStyles.Button, {borderRadius: 10}]}
                backgroundColor={Colors.primary}
                title={this.lang.REJECT}
              />
            </View>
          </View>
        ) : (
          false
        )}

        {/* </ImageBackground> */}
      </View>
    );
  }
}
