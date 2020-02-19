import React from 'react';
import {connect} from 'react-redux';
// import { registerStep1 }                   from '../actions/registerDevice';
import {
  Header,
  Icon,
  PricingCard,
  Divider,
  CheckBox,
  List,
  ListItem,
} from 'react-native-elements';
import {globalStyles, Colors, getLanguageStrings} from '../utils/Theme';
import constants from '../utils/Constants.js';
import {NavigationActions} from 'react-navigation';
import PhotoGrid from 'react-native-thumbnail-grid';
// import Gallery from 'react-native-photo-gallery';

const endpoint = constants.BASE_URL;

import {Text, View, Image, ScrollView, ActivityIndicator} from 'react-native';
import TopRightArea from '../modules/TopRightArea';

//const styles = StyleSheet.create({});

class Saloon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_bookmarked: false,
      saloon_data: [],
      loaded: false,
      items: [],

      // item_prices:{},
      admin_commission: 0,
    };
    this.lang = getLanguageStrings(this.props.language.current);
  }

  changeSubscribe() {
    if (!this.props.auth || !this.props.auth.user) {
      const navigate = NavigationActions.navigate({
        routeName: 'OuterHome',
        params: {
          // saloon_id : id,
          isInner: true,
        },
      });
      this.props.navigation.dispatch(navigate);
      return;
    }
    fetch(
      endpoint +
        '?action=princess_modify_bookmark&cur=' +
        this.props.auth.user.id +
        '&provider_id=' +
        this.state.saloon_data.provider_id,
    )
      .then(response => response.json())
      .then(responseJson => {
        // alert('ok');

        // const prev = this.state.is_bookmarked;

        const saloon_data = JSON.parse(JSON.stringify(this.state.saloon_data));
        // alert(JSON.stringify(saloon_data.bookmarked_by));
        let idx;

        idx = saloon_data.bookmarked_by.indexOf('' + this.props.auth.user.id);

        let is_bookmarked;
        if (idx > -1) {
          saloon_data.bookmarked_by.splice(idx, 1);
          is_bookmarked = false;
        } else {
          saloon_data.bookmarked_by.push('' + this.props.auth.user.id);
          is_bookmarked = true;
        }
        // alert(JSON.stringify(saloon_data.bookmarked_by));
        setTimeout(() => {
          this.setState({
            is_bookmarked: is_bookmarked,
            saloon_data: saloon_data,
          });
        }, 200);
      })
      .catch(error => {
        alert('Something went wrong');
      });
  }

  getListing(id) {
    if (!id) {
      return;
    }

    fetch(endpoint + '?action=princess_get_listing&id=' + id)
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        if (responseJson.ok && responseJson.listing) {
          const l = responseJson.listing;
          // alert(l.bookmarked_by);
          this.setState({
            saloon_data: l,
            loaded: true,
          });
        } else {
          alert(responseJson.error);
        }
      })
      .catch(error => {
        // console.error(error);
        alert(this.lang.UNABLE_TO_FETCH_LISTING);
      });
  }

  componentDidMount() {
    const {state} = this.props.navigation;

    fetch(endpoint + '?action=list_services')
      .then(response2 => response2.json())
      .then(responseJson2 => {
        this.setState(
          {
            items: responseJson2.items,
            service_fee: responseJson2.service_fee,
            admin_commission: responseJson2.admin_commission,
          },
          () => {
            this.getListing(state.params.saloon_id);
          },
        );
      })
      .catch(error => {
        this.getListing(state.params.saloon_id);
      });
  }

  goBack() {
    const toHome = NavigationActions.back();
    this.props.navigation.dispatch(toHome);
  }

  ratingStyle(rating) {
    if (rating >= 4) {
      return globalStyles.saloon_green;
    } else if (rating >= 2) {
      return globalStyles.saloon_yellow;
    }
    return globalStyles.saloon_red;
  }

  renderCostLevel(c) {
    const cols = [];
    c = parseInt(c).toString().length;
    for (let i = 0; i < c; i++) {
      cols.push(i);
    }
    return cols.map((i, k) => {
      return (
        <Icon
          name="attach-money"
          key={i}
          size={20}
          color={Colors.primary}
          containerViewStyle={globalStyles.cardIcon}
        />
      );
    });
  }

  showImage(e, url) {
    const toHome = NavigationActions.navigate({
      routeName: 'SingleImg',
      params: {
        img: url,
      },
    });

    this.props.navigation.dispatch(toHome);
  }

  buy(package_name) {
    if (this.state.saloon_data.booking_status != 'available') {
      alert(this.lang.NOT_AVAILABLE);
      return;
    }

    if (!this.props.auth || !this.props.auth.user) {
      const navigate = NavigationActions.navigate({
        routeName: 'Login',
        params: {
          // saloon_id : id,
          isInner: true,
        },
      });
      this.props.navigation.dispatch(navigate);
    }

    if (!this.props.auth.user || !this.props.auth.user.id) {
      // const {state} = this.props.navigation;
      // var saloon_id = state.params.saloon_id
      const navigateAction = NavigationActions.navigate({
        routeName: 'OuterHome',

        action: NavigationActions.navigate({routeName: 'OuterHome'}),
      });
      this.props.navigation.dispatch(navigateAction);
      return;
    }
    const {state} = this.props.navigation;
    const saloon_id = state.params.saloon_id;
    const navigateAction = NavigationActions.navigate({
      routeName: 'BookDate',
      params: {
        saloon_id: saloon_id,
        saloon_data: this.state.saloon_data,
        package_name: package_name,
        admin_commission: this.state.admin_commission,
        items: this.state.items,
        service_fee: this.state.service_fee,
      },
      action: NavigationActions.navigate({routeName: 'BookDate'}),
    });
    this.props.navigation.dispatch(navigateAction);
  }

  prez(a) {
    if (a < 9) {
      a = '0' + a;
    }
    return a;
  }
  showDT(a) {
    if (!a) {
      return '--:--';
    }
    if (a == '2400' || a == 2400) {
      a = '2359';
    }
    // a = parseInt(a);
    // a = a.toFixed(0);
    a = a.split('');
    a = '' + a[0] + '' + a[1] + ':' + a[2] + a[3];
    const time_part_array = a.split(':');

    let ampm = this.lang.AM;
    time_part_array[0] = parseInt(time_part_array[0]);
    time_part_array[1] = parseInt(time_part_array[1]);

    if (time_part_array[0] >= 12) {
      ampm = this.lang.PM;
    }

    if (time_part_array[0] > 12) {
      time_part_array[0] = time_part_array[0] - 12;
    }

    const formatted_time =
      this.prez(time_part_array[0]) +
      ':' +
      this.prez(time_part_array[1]) +
      ' ' +
      ampm;

    return formatted_time;
  }

  showBookableHours(a) {
    if (a == '[]') {
      a = '0000 to 2400';
    }
    if (a) {
      a = a.split(' to ');
    } else {
      a = ['0000', '2400'];
    }
    if (a.length < 2) {
      a = [a[0], 2400];
    }

    return this.showDT(a[0]) + '  ' + this.lang.TO + '   ' + this.showDT(a[1]);
  }

  showDatesBookable(a, b) {
    a = JSON.parse(a);
    let dts = a[1];
    let wks = a[0];
    if (!wks) {
      wks = [];
    }

    if (!dts) {
      dts = [];
    }
    const wn = [
      this.lang.SUN,
      this.lang.MON,
      this.lang.TUES,
      this.lang.WED,
      this.lang.THURS,
      this.lang.FRI,
      this.lang.SAT,
    ];
    let txt = [];
    for (let i = 0; i < 7; i++) {
      if (
        wks[i] !== 'false' &&
        wks[i] !== false &&
        typeof wks[i] !== 'undefined'
      ) {
        txt.push(wn[i]);
      }
    }
    txt = txt.join(', ') + '\n\n';
    if (b == 1) {
      return txt;
    }

    let txt2 = [];
    for (let i = 0; i < dts.length; i++) {
      txt2.push(dts[i].start + '  ' + this.lang.TO + '  ' + dts[i].end);
    }
    txt2 = txt2.join(',' + '\n');

    if (b == 2) {
      return txt2 + '\n\n';
    }
    //txt = txt+txt2;
    //    r/eturn txt;
  }

  renderSaloon(obj, i) {
    if (this.state.loaded == false) {
      return <ActivityIndicator />;
    }

    this.discount =
      obj.discount_type == 'percentage'
        ? '' + obj.discount_my_location + '%'
        : '$' + obj.discount_my_location;
    // console.log(this.discount)
    const list = [
      {
        title: this.lang.PROVIDES_IN_OTHER_CITIES,
        subtitle: parseInt(obj.other_cities) ? true : false,
        iconColor: parseInt(obj.other_cities) ? 'green' : '#ea3f33',
        iconName: parseInt(obj.other_cities) ? 'check-circle' : 'close-circle',
        rightIcon: false,
        key: 1,
      },
      {
        title: this.lang.PROVIDES_AT_CLIENT_LOCATION,
        subtitle: parseInt(obj.go_to_customer_home) ? true : false,
        iconColor: parseInt(obj.go_to_customer_home) ? 'green' : '#ea3f33',
        iconName: parseInt(obj.go_to_customer_home)
          ? 'check-circle'
          : 'close-circle',
        rightIcon: false,
        key: 2,
      },
      {
        title: this.lang.PROVIDES_AT_HIS_LOCATION,
        subtitle: parseInt(obj.at_provider_location) ? true : false,
        iconColor: parseInt(obj.at_provider_location) ? 'green' : '#ea3f33',
        iconName: parseInt(obj.at_provider_location)
          ? 'check-circle'
          : 'close-circle',
        rightIcon: false,
        key: 3,
      },
      {
        title: this.lang.DISCOUNT_AT_HIS_LOCATION,
        subtitle:
          parseInt(obj.at_provider_location) &&
          parseFloat(obj.discount_my_location)
            ? true + ' (' + this.discount + ')'
            : false,
        iconColor: parseInt(obj.at_provider_location) ? 'green' : '#ea3f33',
        iconName: parseInt(obj.at_provider_location)
          ? 'check-circle'
          : 'close-circle',
        rightIcon: false,
        key: 2,
      },
    ];

    const imgs = [];

    if (obj.images) {
      const k = JSON.parse(obj.images);
      for (let i = 0; i < k.length; i++) {
        if (k[i] != '') {
          imgs.push(k[i]);
        }
      }
    }

    return (
      <View key={obj.id}>
        <View
          style={{
            width: '100%',
            marginBottom: 10,
            borderRadius: 20,
            backgroundColor: 'transparent',
            borderBottomWidth: 0,
          }}>
          <View style={[globalStyles.saloon_card_det_wrap, {margin: 0}]}>
            <View
              style={[
                globalStyles.row,
                {
                  flexDirection:
                    this.props.language.current == 'en' ? 'row' : 'row-reverse',
                },
              ]}>
              <View
                style={[
                  globalStyles.col,
                  {
                    backgroundColor: '#000',
                    borderRadius: 10,
                    padding: 10,
                    width: '100%',
                  },
                ]}>
                <Text
                  style={[
                    globalStyles.salooon_card_title,
                    {
                      color: '#fff',

                      textAlign:
                        this.props.language.current == 'en' ? 'left' : 'right',
                    },
                  ]}>
                  {obj.listing_name}
                </Text>
                <Text
                  style={[
                    globalStyles.salooon_card_title,
                    {
                      textAlign:
                        this.props.language.current == 'en' ? 'left' : 'right',
                      color: '#222',
                    },
                  ]}>
                  {'@' + obj.username}
                </Text>
              </View>
            </View>
          </View>
          <View style={globalStyles.saloon_card_img_wrap}>
            <Image
              source={{
                uri: obj.cover
                  ? obj.cover
                  : 'http://via.placeholder.com/350x150',
              }}
              style={[globalStyles.saloon_card_img, {backgroundColor: '#000'}]}
            />
            <Text style={this.ratingStyle(obj.rating)}>{obj.rating}</Text>
          </View>
          <View style={globalStyles.saloon_card_det_wrap}>
            <View
              style={[
                globalStyles.row,
                {
                  flexDirection:
                    this.props.language.current == 'en' ? 'row' : 'row-reverse',
                },
              ]}>
              <View style={globalStyles.col}>
                <View
                  style={[
                    globalStyles.row,
                    {
                      flexDirection:
                        this.props.language.current == 'en'
                          ? 'row'
                          : 'row-reverse',
                    },
                  ]}>
                  <Text style={{color: '#000'}}>{this.lang.AVG_COST}: </Text>

                  {this.renderCostLevel(obj.normal_service_price)}
                </View>
              </View>
              {/* <View style={globalStyles.col30}>
                <Button title="Book Now" onPress={()=>{this.bookNow(obj.id)}}  containerViewStyle={{marginLeft : 0,marginRight: 0 , width:'100%', flex: 1}} buttonStyle={globalStyles.ButtonViewDets } backgroundColor={Colors.primary} />
              </View> */}
            </View>
          </View>
          <View style={globalStyles.saloon_card_det_wrap}>
            <Text
              style={{
                color: '#000',
                textAlign:
                  this.props.language.current == 'en' ? 'left' : 'right',
              }}>
              {obj.description}
            </Text>
          </View>
        </View>

        {this.props.language.current == 'ar' ? (
          <View
            style={[
              globalStyles.row,
              {
                borderRadius: 5,
                borderColor: Colors.primary,
                borderWidth: 1,
              },
            ]}>
            <View style={globalStyles.col40}>
              <Text
                style={[
                  globalStyles.salooon_card_title,
                  {
                    color: obj.booking_status == 'available' ? 'green' : 'red',
                  },
                ]}>
                {obj.booking_status == 'available'
                  ? this.lang.STATUS_AVAILABE
                  : this.lang.STATUS_UNAVAILABE}{' '}
              </Text>
            </View>
            <View style={globalStyles.col50}>
              <Text style={[globalStyles.salooon_card_title, {color: 'red'}]}>
                {this.lang.STATUS_BOOKING_LABEL + ' : '}
              </Text>
            </View>
            <View style={globalStyles.col10} />
          </View>
        ) : (
          <View style={globalStyles.row}>
            <View style={globalStyles.col10} />
            <View style={globalStyles.col50}>
              <Text style={[globalStyles.salooon_card_title, {color: 'red'}]}>
                {this.lang.STATUS_BOOKING_LABEL + ' : '}
              </Text>
            </View>
            <View style={globalStyles.col40}>
              <Text
                style={[
                  globalStyles.salooon_card_title,
                  {
                    color: obj.booking_status == 'available' ? 'green' : 'red',
                  },
                ]}>
                {obj.booking_status == 'available'
                  ? this.lang.STATUS_AVAILABE
                  : this.lang.STATUS_UNAVAILABE}
              </Text>
            </View>
          </View>
        )}

        <CheckBox
          checked={
            (this.props.auth &&
              this.props.auth.user &&
              this.state.saloon_data.bookmarked_by.indexOf(
                this.props.auth.user.id,
              ) > -1) ||
            this.state.is_bookmarked
              ? true
              : false
          }
          title={this.lang.SUBSCRIBE}
          style={{marginLeft: 0, marginRight: 0}}
          containerStyle={{
            marginLeft: 0,
            marginRight: 0,
            borderRadius: 10,
            borderWidth: 0,
            backgroundColor: Colors.pinkbg,
          }}
          onPress={() => this.changeSubscribe()}
        />

        {obj.booking_status == 'available' ? (
          <View style={globalStyles.saloon_card}>
            <View style={globalStyles.saloon_card_det_wrap}>
              <View
                style={[
                  globalStyles.row,
                  {
                    flexDirection:
                      this.props.language.current == 'en'
                        ? 'row'
                        : 'row-reverse',
                  },
                ]}>
                <View style={globalStyles.col}>
                  <Text
                    style={[
                      globalStyles.salooon_card_title,
                      {
                        textAlign:
                          this.props.language.current == 'en'
                            ? 'left'
                            : 'right',
                      },
                    ]}>
                    {this.lang.AVAILABILITY_DETAILS}
                  </Text>

                  <Text />

                  <Divider style={{backgroundColor: Colors.primary}} />

                  <Text />
                </View>
              </View>
              <View
                style={[
                  globalStyles.row,
                  {
                    flexDirection:
                      this.props.language.current == 'en'
                        ? 'row'
                        : 'row-reverse',
                  },
                ]}>
                <Text
                  style={[
                    globalStyles.col30,
                    {fontWeight: '600', fontSize: 16, color: '#000'},
                  ]}>
                  {this.lang.AVAILABILITY_DAYS + ':'}
                </Text>
                <Text
                  style={[
                    globalStyles.col70,
                    {
                      fontSize: 16,
                      color: '#000',
                      textAlign:
                        this.props.language.current == 'en' ? 'left' : 'right',
                    },
                  ]}>
                  {this.showDatesBookable(obj.bookable_days, 1)}
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
                  },
                ]}>
                <Text
                  style={[
                    globalStyles.col30,
                    {fontWeight: '600', fontSize: 16, color: '#000'},
                  ]}>
                  {this.lang.AVAILABILITY_DATES + ':'}
                </Text>
                <Text
                  style={[
                    globalStyles.col70,
                    {
                      fontSize: 16,
                      color: '#000',
                      textAlign:
                        this.props.language.current == 'en' ? 'left' : 'right',
                    },
                  ]}>
                  {obj.always_available == '1' || obj.always_available === 1
                    ? this.lang.ALWAYS_AVAILABLE
                    : this.showDatesBookable(obj.bookable_days, 2)}
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
                  },
                ]}>
                <Text
                  style={[
                    globalStyles.col30,
                    {fontWeight: '600', fontSize: 16, color: '#000'},
                  ]}>
                  {this.lang.AVAILABILITY_TIME + ':'}
                </Text>
                <Text
                  style={[
                    globalStyles.col70,
                    {
                      fontSize: 16,
                      color: '#000',
                      textAlign:
                        this.props.language.current == 'en' ? 'left' : 'right',
                    },
                  ]}>
                  {this.showBookableHours(obj.bookable_hours)}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          false
        )}

        <View
          style={[
            globalStyles.saloon_card,
            {
              shadowOffset: {width: 0, height: 0},
              shadowColor: 'black',
              shadowOpacity: 0,
              elevation: 0,
              padding: 0,
            },
          ]}>
          {this.props.language.current == 'ar' ? (
            <List
              // style={styles.avatarContainer}
              containerStyle={{
                backgroundColor: 'transparent',
                borderTopWidth: 0,
              }}>
              {list.map((item, i) => (
                <ListItem
                  key={item.id ? item.id : i}
                  containerStyle={{
                    backgroundColor: 'transparent',
                    borderBottomWidth: 0,
                  }}
                  contentContainerStyle={{
                    backgroundColor: 'transparent',
                    borderBottomWidth: 0,
                  }}
                  title={item.title}
                  // hideChevron={true}
                  titleStyle={{textAlign: 'right'}}
                  rightIcon={{
                    name: item.iconName,
                    type: 'material-community',
                    color: item.iconColor,
                  }}
                  // subtitle={item.subtitle}
                />
              ))}
            </List>
          ) : (
            <List
              // style={styles.avatarContainer}
              containerStyle={{
                backgroundColor: 'transparent',
                borderTopWidth: 0,
              }}>
              {list.map((item, i) => (
                <ListItem
                  key={item.id ? item.id : i}
                  containerStyle={{
                    backgroundColor: 'transparent',
                    borderBottomWidth: 0,
                    paddingBottom: 0,
                  }}
                  contentContainerStyle={{
                    backgroundColor: 'transparent',
                    borderBottomWidth: 0,
                    paddingBottom: 0,
                  }}
                  title={item.title}
                  hideChevron
                  leftIcon={{
                    name: item.iconName,
                    type: 'material-community',
                    color: item.iconColor,
                  }}
                  // subtitle={item.subtitle}
                />
              ))}
            </List>
          )}
        </View>
        {this.state.items.map((item, i) => {
          if (
            !this.state.saloon_data.item_prices[item.name] ||
            this.state.saloon_data.item_prices[item.name] == 'no'
          ) {
            return false;
          }
          // console.log
          return (
            <View style={globalStyles.saloon_card} key={item.name}>
              <PricingCard
                textcolor={Colors.primary}
                color={Colors.primary}
                title={this.lang.LANG == 'en' ? item.name : item.name_ar}
                price={'SAR ' + this.state.saloon_data.item_prices[item.name]}
                onButtonPress={() => {
                  this.buy(item);
                }}
                info={[]}
                button={{title: this.lang.BOOK_NOW, icon: 'add-shopping-cart'}}
              />
            </View>
          );
        })}

        {
          <View style={globalStyles.saloon_card}>
            <PhotoGrid
              source={imgs}
              onPressImage={(e, uri, i) => {
                // alert(JSON.stringify(e));
                this.showImage(e, uri, i);
              }}
            />

            {/* <Gallery style={{ flex: 1, backgroundColor: 'black' }} images={imgs} /> */}
          </View>
        }
        {/* {
          <View style={globalStyles.saloon_card} >
            <View style={globalStyles.saloon_card_det_wrap} >
              <Text style={globalStyles.heading}>Reviews</Text>
              {
                (obj) && obj.reviews.map((rev, i )=>{
                  return (
                    <Text key={i} style={globalStyles.singleRev} >{rev.content}</Text>
                  );
                })
              }
            </View>

          </View>
        } */}
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
              {this.renderSaloon(this.state.saloon_data, 1)}
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
    auth: state.auth,
    language: state.language,
    messages: state.messages, // use store's data
  };
};

export default connect(mapStateToProps)(Saloon);
