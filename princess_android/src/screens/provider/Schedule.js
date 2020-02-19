import React from 'react';
import {connect} from 'react-redux';
import SideMenu from 'react-native-side-menu';
import {providerListingSchedule} from '../../actions/register';
import {Picker} from 'react-native';
import {Header, Button, Icon, CheckBox} from 'react-native-elements';
import {
  globalStyles,
  Colors,
  // Paddings,
  getLanguageStrings
} from '../../utils/Theme';
import constants from '../../utils/Constants.js';
import {NavigationActions} from 'react-navigation';
// import ScalingButton from '../../modules/ScalingButton';
import SlideMenu2 from './../SlideMenu';
import DatePicker from 'react-native-datepicker';
import TopRightArea from '../../modules/TopRightArea';
const moment = require('moment');

import {
  Text,
  View,
  Dimensions,
  // Image,
  // TextInput,
  // StyleSheet,
  // Animated,
  ScrollView
} from 'react-native';
const {width, height} = Dimensions.get('window');

const popup_height = Math.min((70 * height) / 100, 600);
const endpoint = constants.BASE_URL;

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      schedule_day_sun: false,
      schedule_day_mon: false,
      schedule_day_tue: false,
      schedule_day_wed: false,
      schedule_day_thu: false,
      schedule_day_fri: false,
      schedule_day_sat: false,
      start_time: '',
      stop_time: '',
      loaded: false,
      always_available: false,
      available_dates: []
    };
    this.lang = getLanguageStrings(this.props.language.current);
  }

  handleAddBoardAnother = () => {
    this.setState({
      available_dates: this.state.available_dates.concat([
        {start: '', end: '', valid: false}
      ])
    });
  };
  handleChangeStart = (start, idx) => {
    const bs = this.state.available_dates;
    if (bs[idx]) {
      bs[idx].start = start;
      if (bs[idx].end != '') {
        bs[idx].valid = true;
      }
      this.setState({available_dates: bs});
    }
  };
  handleChangeEnd = (start, idx) => {
    const bs = this.state.available_dates;
    if (bs[idx]) {
      bs[idx].end = start;
      if (bs[idx].start != '') {
        bs[idx].valid = true;
      }
      this.setState({available_dates: bs});
    }
  };
  handleRemoveBoard = idx => {
    // alert();
    this.setState({
      available_dates: this.state.available_dates.filter(
        (s, sidx) => idx !== sidx
      )
    });
  };
  saveSchedule() {
    if (
      this.state.schedule_day_sun == false &&
      this.state.schedule_day_mon == false &&
      this.state.schedule_day_tue == false &&
      this.state.schedule_day_wed == false &&
      this.state.schedule_day_thu == false &&
      this.state.schedule_day_fri == false &&
      this.state.schedule_day_sat == false
    ) {
      alert(this.lang.PROCESS_DAYS_ERROR);
      return;
    }

    if (
      this.state.always_available == false &&
      this.state.available_dates.length < 1
    ) {
      this.handleAddBoardAnother();
      alert(this.lang.PLZ_ENTER_DT_RNGE);
      return;
    }
    if (this.state.start_time == '' || this.state.stop_time == '') {
      alert(this.lang.PLZ_START_END);
      return;
    }

    this.setState({loadingB1: true});
    this.props.dispatch(
      providerListingSchedule(
        {
          days: [
            this.state.schedule_day_sun,
            this.state.schedule_day_mon,
            this.state.schedule_day_tue,
            this.state.schedule_day_wed,
            this.state.schedule_day_thu,
            this.state.schedule_day_fri,
            this.state.schedule_day_sat
          ],
          start_time: this.state.start_time,
          stop_time: this.state.stop_time,
          always_available: this.state.always_available,
          available_dates: this.state.available_dates
        },
        this.state.listing_id,
        this.props.navigation,
        () => {
          this.setState({loadingB1: false});
        }
      )
    );
  }
  goBack() {
    const toHome = NavigationActions.back();
    this.props.navigation.dispatch(toHome);
  }

  componentDidMount() {
    fetch(
      endpoint +
        '?action=princess_my_listing&provider_id=' +
        this.props.auth.user.id
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.listing) {
          const l = responseJson.listing;
          if (l.bookable_days) {
            l.bookable_days = JSON.parse(l.bookable_days);
          } else {
            l.bookable_days = [
              [false, false, false, false, false, false, false],
              []
            ];
          }
          if (!l.bookable_days.length) {
            l.bookable_days = [
              [false, false, false, false, false, false, false],
              []
            ];
          }
          if (l.bookable_hours) {
            l.bookable_hours = l.bookable_hours.split(' to ');
          } else {
            l.bookable_hours = ['', ''];
          }
          this.setState({
            listing_created: true,
            loaded: true,
            listing_id: responseJson.listing.id,
            schedule_day_sun: l.bookable_days[0][0],
            schedule_day_mon: l.bookable_days[0][1],
            schedule_day_tue: l.bookable_days[0][2],
            schedule_day_thu: l.bookable_days[0][3],
            schedule_day_wed: l.bookable_days[0][4],
            schedule_day_fri: l.bookable_days[0][5],
            schedule_day_sat: l.bookable_days[0][6],
            start_time: l.bookable_hours[0],
            stop_time: l.bookable_hours[1],
            always_available:
              l.always_available == 1 || l.always_available == '1'
                ? true
                : false,
            available_dates: l.bookable_days[1]
          });
        } else {
          this.setState({
            loaded: true
          });
        }
      })
      .catch(error => {
        alert(error);
        alert('unable to fetch your listing details');
      });
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

  render() {
    // const colr = 'aaaaaa';

    this.menuObj = this.state.isOpen ? (
      <SlideMenu2
        navigation={this.props.navigation}
        onItemSelected={this.onMenuItemSelected.bind(this)}
      />
    ) : (
      false
    );
    if (!this.state.loaded) {
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
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                width: width,
                height: popup_height,
                padding: 50
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  marginLeft: 50,
                  marginRight: 50,
                  height: 200,
                  width: width - 100
                }}
              >
                <Text
                  style={[
                    globalStyles.salooon_card_title,
                    {textAlign: 'center'}
                  ]}
                >
                  {this.lang.PLEASE_WAIT_WHILE_SCHEDULE}
                </Text>
              </View>
            </View>
          </SideMenu>
        </View>
      );
    }



    const datesBoard = this.state.always_available
      ? false
      : this.state.available_dates.map((obj, i) => {
          const min_end = obj.start
            ? moment(obj.start).format()
            : moment().format();
          const max_date = obj.end ? moment(obj.end).format() : '2100-06-01';
          return (
            <View style={[globalStyles.row, {marginBottom: 5}]} key={i}>
              <View style={[globalStyles.col30, {padding: 2}]}>
                <DatePicker
                  style={{width: '100%'}}
                  date={obj.start}
                  mode="date"
                  placeholder={this.lang.SELECT_START_DATE}
                  format="YYYY-MM-DD"
                  minDate={moment().format()}
                  maxDate={max_date}
                  confirmBtnText={this.lang.CONFIRM}
                  showIcon={false}
                  cancelBtnText="Cancel"
                  onDateChange={date => {
                    this.handleChangeStart(date, i);
                  }}
                />
              </View>
              <View style={[globalStyles.col30, {padding: 2}]}>
                <DatePicker
                  style={{width: '100%'}}
                  date={obj.end}
                  mode="date"
                  placeholder={this.lang.SELECT_END_DATE}
                  format="YYYY-MM-DD"
                  minDate={min_end}
                  maxDate="2100-06-01"
                  confirmBtnText={this.lang.CONFIRM}
                  showIcon={false}
                  cancelBtnText="Cancel"
                  onDateChange={date => {
                    this.handleChangeEnd(date, i);
                  }}
                />
              </View>

              <View style={[globalStyles.col10, {padding: 2}]}>
                <Icon
                  name="delete"
                  reverse
                  size={15}
                  color="red"
                  onPress={() => this.handleRemoveBoard(i)}
                />
              </View>
            </View>
          );
        });

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

          {this.state.listing_created ? (
            <View style={globalStyles.innerContainer}>
              <ScrollView>
                <View style={{width: '100%', height: '100%', display: 'flex'}}>
                  <View style={globalStyles.saloon_card}>
                    <View style={globalStyles.saloon_card_det_wrap}>
                      <Text style={globalStyles.salooon_card_title}>
                        {this.lang.SELECT_SCHEDULE_DAYS}
                      </Text>
                    </View>
                    <CheckBox
                      title={this.lang.DAY_SUN}
                      checked={this.state.schedule_day_sun}
                      onPress={() =>
                        this.setState({
                          schedule_day_sun: !this.state.schedule_day_sun
                        })
                      }
                    />
                    <CheckBox
                      title={this.lang.DAY_MON}
                      checked={this.state.schedule_day_mon}
                      onPress={() =>
                        this.setState({
                          schedule_day_mon: !this.state.schedule_day_mon
                        })
                      }
                    />
                    <CheckBox
                      title={this.lang.DAY_TUE}
                      checked={this.state.schedule_day_tue}
                      onPress={() =>
                        this.setState({
                          schedule_day_tue: !this.state.schedule_day_tue
                        })
                      }
                    />
                    <CheckBox
                      title={this.lang.DAY_WED}
                      checked={this.state.schedule_day_wed}
                      onPress={() =>
                        this.setState({
                          schedule_day_wed: !this.state.schedule_day_wed
                        })
                      }
                    />
                    <CheckBox
                      title={this.lang.DAY_THU}
                      checked={this.state.schedule_day_thu}
                      onPress={() =>
                        this.setState({
                          schedule_day_thu: !this.state.schedule_day_thu
                        })
                      }
                    />
                    <CheckBox
                      title={this.lang.DAY_FRI}
                      checked={this.state.schedule_day_fri}
                      onPress={() =>
                        this.setState({
                          schedule_day_fri: !this.state.schedule_day_fri
                        })
                      }
                    />
                    <CheckBox
                      title={this.lang.DAY_SAT}
                      checked={this.state.schedule_day_sat}
                      onPress={() =>
                        this.setState({
                          schedule_day_sat: !this.state.schedule_day_sat
                        })
                      }
                    />
                  </View>

                  <View style={globalStyles.saloon_card}>
                    <View style={globalStyles.saloon_card_det_wrap}>
                      <Text style={globalStyles.salooon_card_title}>
                        {this.lang.SELECT_SCHEDULE}
                      </Text>
                    </View>
                    <View style={globalStyles.row}>
                      <View style={globalStyles.col}>
                        <Picker
                          selectedValue={this.state.start_time}
                          style={{height: 50, width: '100%'}}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({start_time: itemValue})
                          }
                        >
                          <Picker.Item label={this.lang.DAY_START} value="0" />
                          <Picker.Item label="12:00 AM" value="0000" />
                          <Picker.Item label="01:00 AM" value="0100" />
                          <Picker.Item label="02:00 AM" value="0200" />
                          <Picker.Item label="03:00 AM" value="0300" />
                          <Picker.Item label="04:00 AM" value="0400" />
                          <Picker.Item label="05:00 AM" value="0500" />
                          <Picker.Item label="06:00 AM" value="0600" />
                          <Picker.Item label="07:00 AM" value="0700" />
                          <Picker.Item label="08:00 AM" value="0800" />
                          <Picker.Item label="09:00 AM" value="0900" />
                          <Picker.Item label="10:00 AM" value="1000" />
                          <Picker.Item label="11:00 AM" value="1100" />
                          <Picker.Item label="12:00 PM" value="1200" />
                          <Picker.Item label="01:00 PM" value="1300" />
                          <Picker.Item label="02:00 PM" value="1400" />
                          <Picker.Item label="03:00 PM" value="1500" />
                          <Picker.Item label="04:00 PM" value="1600" />
                          <Picker.Item label="05:00 PM" value="1700" />
                          <Picker.Item label="06:00 PM" value="1800" />
                          <Picker.Item label="07:00 PM" value="1900" />
                          <Picker.Item label="08:00 PM" value="2000" />
                          <Picker.Item label="09:00 PM" value="2100" />
                          <Picker.Item label="10:00 PM" value="2200" />
                          <Picker.Item label="11:00 PM" value="2300" />
                        </Picker>
                      </View>

                      <View style={globalStyles.col}>
                        <Picker
                          selectedValue={this.state.stop_time}
                          style={{height: 50, width: '100%'}}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({stop_time: itemValue})
                          }
                        >
                          <Picker.Item label={this.lang.DAY_END} value="0" />
                          <Picker.Item label="01:00 AM" value="0100" />
                          <Picker.Item label="02:00 AM" value="0200" />
                          <Picker.Item label="03:00 AM" value="0300" />
                          <Picker.Item label="04:00 AM" value="0400" />
                          <Picker.Item label="05:00 AM" value="0500" />
                          <Picker.Item label="06:00 AM" value="0600" />
                          <Picker.Item label="07:00 AM" value="0700" />
                          <Picker.Item label="08:00 AM" value="0800" />
                          <Picker.Item label="09:00 AM" value="0900" />
                          <Picker.Item label="10:00 AM" value="1000" />
                          <Picker.Item label="11:00 AM" value="1100" />
                          <Picker.Item label="12:00 PM" value="1200" />
                          <Picker.Item label="01:00 PM" value="1300" />
                          <Picker.Item label="02:00 PM" value="1400" />
                          <Picker.Item label="03:00 PM" value="1500" />
                          <Picker.Item label="04:00 PM" value="1600" />
                          <Picker.Item label="05:00 PM" value="1700" />
                          <Picker.Item label="06:00 PM" value="1800" />
                          <Picker.Item label="07:00 PM" value="1900" />
                          <Picker.Item label="08:00 PM" value="2000" />
                          <Picker.Item label="09:00 PM" value="2100" />
                          <Picker.Item label="10:00 PM" value="2200" />
                          <Picker.Item label="11:00 PM" value="2300" />
                        </Picker>
                      </View>
                    </View>
                  </View>

                  <View style={globalStyles.saloon_card}>
                    <View style={globalStyles.saloon_card_det_wrap}>
                      <Text style={globalStyles.salooon_card_title}>
                        {this.lang.SELECT_SCHEDULE}
                      </Text>
                    </View>
                    <CheckBox
                      title={this.lang.ALWAYS_AVAILABLE}
                      checked={this.state.always_available}
                      onPress={() =>
                        this.setState({
                          always_available: !this.state.always_available
                        })
                      }
                    />

                    {datesBoard}
                    {this.state.always_available ? (
                      false
                    ) : (
                      <Button
                        containerViewStyle={{flex: 1}}
                        onPress={() => this.handleAddBoardAnother()}
                        buttonStyle={globalStyles.Button}
                        backgroundColor={Colors.white}
                        color={Colors.primary}
                        rounded
                        title={this.lang.ADD_DATE_RANGE}
                      />
                    )}
                  </View>

                  <View style={[globalStyles.row, {flex: 1}]}>
                    <View style={globalStyles.col}>
                      <Button
                        containerViewStyle={{flex: 1}}
                        onPress={() => this.saveSchedule()}
                        buttonStyle={globalStyles.Button}
                        loading={this.state.loadingB1}
                        backgroundColor={Colors.primary}
                        color={Colors.white}
                        rounded
                        title={this.lang.UPDATE_SCHEDULE}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                width: width,
                height: popup_height,
                padding: 50
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  marginLeft: 50,
                  marginRight: 50,
                  height: 200,
                  width: width - 100
                }}
              >
                <Text
                  style={[
                    globalStyles.salooon_card_title,
                    {textAlign: 'center'}
                  ]}
                >
                  {this.lang.NO_LISTING_YET_SCHEDULE}
                </Text>
              </View>
            </View>
          )}
        </SideMenu>
      </View>
    );
  }
}

// const styles = StyleSheet.create({});

const mapStateToProps = state => {
  return {
    messages: state.messages,
    auth: state.auth,
    language: state.language
  };
};

export default connect(mapStateToProps)(Schedule);
