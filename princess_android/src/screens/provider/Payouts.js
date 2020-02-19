import React from 'react';
import {connect} from 'react-redux';
import SideMenu from 'react-native-side-menu';
// import {Picker} from 'react-native';
import {Header, Icon} from 'react-native-elements';
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
import TopRightArea from '../../modules/TopRightArea';
const moment = require('moment');

import {Text, View, Dimensions, StyleSheet, ScrollView} from 'react-native';
const {width, height} = Dimensions.get('window');

const popup_height = Math.min((70 * height) / 100, 600);
const endpoint = constants.BASE_URL;

class Payouts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      schedule_day_sun: false,
      schedule_day_mon: false,
      schedule_day_tue: false,
      schedule_day_thu: false,
      schedule_day_wed: false,
      schedule_day_fri: false,
      schedule_day_sat: false,
      start_time: '',
      stop_time: '',
      always_available: false,
      available_dates: []
    };
    this.lang = getLanguageStrings(this.props.language.current);
  }
  goBack() {
    const toHome = NavigationActions.back();
    this.props.navigation.dispatch(toHome);
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

  saveImages() {
    if (
      this.state.schedule_day_sun == false &&
      this.state.schedule_day_mon == false &&
      this.state.schedule_day_tue == false &&
      this.state.schedule_day_thu == false &&
      this.state.schedule_day_wed == false &&
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
      alert('Please add atleast one date range');
      return;
    }
    if (this.state.start_time == '' || this.state.stop_time == '') {
      alert('Please enter your day start and end timings!');
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
            this.state.schedule_day_thu,
            this.state.schedule_day_wed,
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

  componentDidMount() {
    fetch(
      endpoint +
        '?action=princess_my_listing&provider_id=' +
        this.props.auth.user.id
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.listing) {
          this.setState({
            listing_created: true,
            loaded: true,
            listing_id: responseJson.listing.id
          });
        }
      })
      .catch(error => {
        alert('unable to fetch your listing details');
      });
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
  goToList() {
    const {navigate} = this.props.navigation;

    const navigateAction = NavigationActions.navigate({
      routeName: 'UnreadOrders',
      params: {},
      action: NavigationActions.navigate({routeName: 'UnreadOrders'})
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    const colr = 'aaaaaa';

    if (!this.state.loaded) {
      return (
        <View>
          <Text>loading...</Text>
        </View>
      );
    }

    this.menuObj = this.state.isOpen ? (
      <SlideMenu2
        navigation={this.props.navigation}
        onItemSelected={this.onMenuItemSelected.bind(this)}
      />
    ) : (
      false
    );
    const datesBoard = this.state.always_available
      ? false
      : this.state.available_dates.map((obj, i) => {
          return (
            <View style={[globalStyles.row, {marginBottom: 5}]} key={i}>
              <View style={[globalStyles.col30, {padding: 2}]}>
                <DatePicker
                  style={{width: '100%'}}
                  date={obj.start}
                  mode="date"
                  placeholder="select date"
                  format="YYYY-MM-DD"
                  minDate={moment().format()}
                  maxDate="2100-06-01"
                  confirmBtnText="Confirm"
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
                  placeholder="select date"
                  format="YYYY-MM-DD"
                  minDate={moment().format()}
                  maxDate="2100-06-01"
                  confirmBtnText="Confirm"
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
                <View
                  style={{width: '100%', height: '100%', display: 'flex'}}
                />
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
                  {this.lang.NO_LISTING_YET}
                </Text>
              </View>
            </View>
          )}
        </SideMenu>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = state => {
  return {
    messages: state.messages,
    auth: state.auth,
    language: state.language
  };
};

export default connect(mapStateToProps)(Payouts);
