import React from 'react';
import {connect} from 'react-redux';
import SideMenu from 'react-native-side-menu';
// import { register }                        from '../actions/register';
import {Header, Button, Icon, SearchBar, CheckBox} from 'react-native-elements';

import {globalStyles, Colors, getLanguageStrings} from '../utils/Theme';
import constants from '../utils/Constants.js';
import {NavigationActions} from 'react-navigation';
import SlideMenu2 from './SlideMenu2';
import TopRightArea from '../modules/TopRightArea';
import ModalSelector from '../modules/modal_selector';

import {Text, View, Image, ScrollView, Dimensions} from 'react-native';
// const styles = StyleSheet.create({});

const endpoint = constants.BASE_URL;
const width = Dimensions.get('window').width;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      filter: [],
      sort: 'booking_status',
      sort_order: 'asc',
      filter_city: '',
      saloon_data: [],
      sort_open: false,
      filter_open: false,
      cities: [],

      pickerOpacity: 0,
      opacityOfOtherItems: 1, //THIS IS THE OPACITY OF ALL OTHER ITEMS, WHICH COLLIDES WITH YOUR PICKER.
      label: 'Firstvalue',
    };
    this.lang = getLanguageStrings(this.props.language.current);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.language.current != newProps.language.current) {
      this.lang = getLanguageStrings(newProps.language.current);
    }
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

  goAccount() {
    // console.log(this.props.auth.user)
    if (this.props.auth.user) {
      return;
    }
    const toHome = NavigationActions.navigate({
      routeName: 'OuterHome',
      params: {
        // saloon_id : id,
        isInner: true,
      },
    });
    this.props.navigation.dispatch(toHome);
  }

  componentDidMount() {
    this.getListings();
  }

  getCities() {
    fetch(endpoint + '?action=unique_listings')
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.ok && responseJson.cities) {
          // responseJson.cities;
          this.setState({
            cities: responseJson.cities,
          });
        } else {
          alert(responseJson.error);
        }
      })
      .catch(error => {
        // alert(error);
        alert(this.lang.UNABLE_TO_FETCH_LISTING);
      });
  }

  getListings() {
    // console.log('. . . .. ');
    this.setState({filter_loading: true});
    let f = '';
    if (this.state.filter) {
      f += '&filter=' + this.state.filter.join(',');
    }

    if (this.state.filter_text) {
      f += '&filter_text=' + this.state.filter_text;
    }
    if (this.state.filter_city) {
      f += '&filter_city=' + this.state.filter_city;
    }
    if (this.state.sort) {
      f += '&sort=' + this.state.sort;
      f += '&sort_order=' + this.state.sort_order;
    }
    if (this.props.auth) {
      f += '&uid=' + this.props.auth.user.id;
    }
    fetch(endpoint + '?action=princess_get_listings' + f)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.ok && responseJson.listings) {
          const l = responseJson.listings;
          // console.log(responseJson.listings);
          this.setState({
            saloon_data: l,
            filter_loading: false,
          });
          this.getCities();
        } else {
          // alert(responseJson.error);
          this.setState({filter_loading: false});
          this.getCities();
        }
      })
      .catch(error => {
        this.setState({filter_loading: false});
        // alert(error);
        this.getCities();
        // alert('unable to fetch listings');
      });
  }

  showDets(id) {
    const toHome = NavigationActions.navigate({
      routeName: 'Saloon',
      params: {
        saloon_id: id,
      },
    });
    this.props.navigation.dispatch(toHome);
  }

  toggleSort() {
    if (this.state.sort_open) {
      //already open, close it
      this.setState({sort_open: false});
    } else {
      // lets open it
      this.setState({sort_open: true, filter_open: false});
    }
  }

  changeSort(c) {
    if (this.state.sort == c) {
      if (this.state.sort_order == 'asc') {
        this.setState({sort_order: 'desc'});
      } else {
        this.setState({sort_order: 'asc'});
      }
    } else {
      this.setState({sort: c});
    }

    setTimeout(() => {
      this.getListings();
    }, 200);
  }

  changeFilter(f) {
    const k = this.state.filter;
    const idx = k.indexOf(f);
    if (idx < 0) {
      k.push(f);
    } else {
      k.splice(idx, 1);
    }
    this.setState({filter: k}, this.getListings());
  }

  toggleFilter() {
    if (this.state.filter_open) {
      //already open, close it
      this.setState({filter_open: false});
    } else {
      // lets open it
      this.setState({filter_open: true, sort_open: false});
    }
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

  renderSaloon(obj, i) {
    return (
      <View
        style={[
          {
            width: '100%',
            marginBottom: 10,
            borderRadius: 20,
            backgroundColor: 'transparent',
            borderBottomWidth: 0,
          },
        ]}
        key={i}>
        <View
          style={[
            globalStyles.saloon_card_img_wrap,
            {marginBottom: 10, borderRadius: 20},
          ]}>
          <Image
            source={{
              uri: obj.cover ? obj.cover : 'http://via.placeholder.com/350x250',
            }}
            style={globalStyles.saloon_card_img}
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
            <View style={globalStyles.col70}>
              <Text
                style={[
                  globalStyles.salooon_card_title,
                  {
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
                  style={{
                    fontSize: 16,
                    color: '#000',
                    fontFamily: 'Gotham-Medium',
                  }}>
                  {this.lang.AVG_COST}:{' '}
                </Text>
                {this.renderCostLevel(obj.normal_service_price)}
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
                <View style={globalStyles.col50}>
                  <Text
                    style={[
                      globalStyles.salooon_card_title,
                      {fontSize: 16, color: 'black'},
                    ]}>
                    {this.lang.STATUS_BOOKING_LABEL + ' : '}
                  </Text>
                </View>
                <View style={globalStyles.col50}>
                  <Text
                    style={[
                      globalStyles.salooon_card_title,
                      {
                        fontSize: 16,
                        color:
                          obj.booking_status == 'available' ? 'green' : 'red',
                      },
                    ]}>
                    {obj.booking_status == 'available'
                      ? this.lang.STATUS_AVAILABE
                      : this.lang.STATUS_UNAVAILABE}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={globalStyles.row}>
            <View style={globalStyles.col} />
            <View style={[globalStyles.col, {flex: 2}]}>
              <Button
                title={this.lang.VIEW_DETAILS}
                onPress={() => {
                  this.showDets(obj.id);
                }}
                containerViewStyle={{
                  marginLeft: 0,
                  marginRight: 0,
                  width: '100%',
                  flex: 1,
                  marginTop: 20,
                  borderRadius: 10,
                }}
                buttonStyle={[
                  globalStyles.ButtonViewDets,
                  {
                    borderRadius: 10,
                  },
                ]}
                backgroundColor={Colors.primary}
              />
            </View>
            <View style={globalStyles.col} />
          </View>
        </View>
      </View>
    );
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
    this.menuObj = this.state.isOpen ? (
      <SlideMenu2
        navigation={this.props.navigation}
        onItemSelected={this.onMenuItemSelected.bind(this)}
      />
    ) : (
      false
    );

    let data = [];
    for (let i = 0; i < this.state.cities.length; i++) {
      data.push({
        key: i,
        label: this.state.cities[i].city,
        key: this.state.cities[i].city,
      });
    }

    return (
      <View
        style={[
          globalStyles.containerSplash,
          {
            backgroundColor: '#fff',
          },
        ]}>
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

          <View>
            <ScrollView>
              <View style={globalStyles.innerContainer}>
                <View style={globalStyles.row}>
                  <View style={globalStyles.col}>
                    <SearchBar
                      lightTheme
                      showLoading
                      icon={{style: {color: Colors.primary}}}
                      containerStyle={{
                        marginBottom: 10,
                        backgroundColor: Colors.pinkBg,
                        borderRadius: 10,
                      }}
                      inputStyle={{
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        color: '#000',
                      }}
                      // platform="android"
                      onChangeText={filter_text => {
                        this.setState({filter_text: filter_text});
                      }}
                      onClear={() => {
                        this.setState({filter_text: ''});
                      }}
                      placeholder={this.lang.SEARCH_HERE}
                    />
                  </View>
                </View>

                <View>
                  <View
                    style={[
                      globalStyles.inputWithBoxOther,
                      {
                        marginBottom: 10,
                        borderRadius: 10,
                        backgroundColor: Colors.primary,
                      },
                    ]}>
                    <View style={{flex: 0}}>
                      <ModalSelector
                        data={data}
                        initValue={this.lang.FILTER_CITY}
                        onChange={option => {
                          this.setState({filter_city: option.city});
                        }}
                      />
                    </View>
                  </View>
                </View>

                <Button
                  loading={this.state.filter_loading}
                  onPress={() => {
                    this.getListings();
                  }}
                  title={this.lang.SEARCH}
                  containerViewStyle={{
                    marginLeft: 0,
                    marginBottom: 10,
                    marginRight: 0,
                    width: '100%',
                    flex: 1,
                    borderRadius: 10,
                    borderRightWidth: 0,
                    borderRightColor: Colors.primaryDark,
                  }}
                  buttonStyle={[
                    globalStyles.Button,
                    {
                      borderRadius: 10,
                    },
                  ]}
                  backgroundColor={Colors.button}
                />

                {this.state.saloon_data.map((obj, i) => {
                  return this.renderSaloon(obj, i);
                })}
                <View style={globalStyles.emptySpace} />
              </View>
            </ScrollView>
          </View>
          <View style={globalStyles.filter_box_colapsable}>
            <View style={globalStyles.col}>
              {this.state.sort_open ? (
                <View>
                  <Button
                    onPress={() => {
                      this.changeSort('booking_status');
                    }}
                    title={this.lang.SORT_AVAILABILITY}
                    containerViewStyle={{
                      marginLeft: 0,
                      marginRight: 0,
                      width: '100%',
                      flex: 1,
                      borderRightWidth: 1,
                      borderRightColor: Colors.primaryDark,
                    }}
                    buttonStyle={globalStyles.Button}
                    backgroundColor={
                      this.state.sort == 'booking_status'
                        ? Colors.buttonSec
                        : Colors.button
                    }
                    icon={{
                      name:
                        this.state.sort_order == 'asc'
                          ? 'sort-ascending'
                          : 'sort-descending',
                      type: 'material-community',
                    }}
                  />
                  <Button
                    onPress={() => {
                      this.changeSort('price');
                    }}
                    title={this.lang.SORT_PRICE}
                    containerViewStyle={{
                      marginLeft: 0,
                      marginRight: 0,
                      width: '100%',
                      flex: 1,
                      borderRightWidth: 1,
                      borderRightColor: Colors.primaryDark,
                    }}
                    buttonStyle={globalStyles.Button}
                    backgroundColor={
                      this.state.sort == 'price'
                        ? Colors.buttonSec
                        : Colors.button
                    }
                    icon={{
                      name:
                        this.state.sort_order == 'asc'
                          ? 'sort-ascending'
                          : 'sort-descending',
                      type: 'material-community',
                    }}
                  />
                  <Button
                    onPress={() => {
                      this.changeSort('rating');
                    }}
                    // icon={{name: 'sort'}}
                    title={this.lang.SORT_RATING}
                    containerViewStyle={{
                      marginLeft: 0,
                      marginRight: 0,
                      width: '100%',
                      flex: 1,
                      borderRightWidth: 1,
                      borderRightColor: Colors.primaryDark,
                    }}
                    buttonStyle={globalStyles.Button}
                    backgroundColor={
                      this.state.sort == 'rating'
                        ? Colors.buttonSec
                        : Colors.button
                    }
                    icon={{
                      name:
                        this.state.sort_order == 'asc'
                          ? 'sort-ascending'
                          : 'sort-descending',
                      type: 'material-community',
                    }}
                  />
                </View>
              ) : (
                false
              )}
            </View>
            <View style={globalStyles.col}>
              {this.state.filter_open ? (
                <View>
                  <CheckBox
                    containerStyle={{
                      margin: 0,
                      borderWidth: 0,
                      backgroundColor: Colors.button,
                      borderRadius: 0,
                    }}
                    textStyle={{color: '#fff'}}
                    onPress={() => {
                      this.changeFilter('available');
                    }}
                    title={this.lang.STATUS_AVAILABE}
                    checked={this.state.filter.indexOf('available') > -1}
                  />
                  <CheckBox
                    containerStyle={{
                      margin: 0,
                      borderWidth: 0,
                      backgroundColor: Colors.button,
                      borderRadius: 0,
                    }}
                    textStyle={{color: '#fff'}}
                    onPress={() => {
                      this.changeFilter('near_me');
                    }}
                    title={this.lang.FILTER_NEAR_ME}
                    checked={this.state.filter.indexOf('near_me') > -1}
                  />
                  <CheckBox
                    containerStyle={{
                      margin: 0,
                      borderWidth: 0,
                      backgroundColor: Colors.button,
                      borderRadius: 0,
                    }}
                    textStyle={{color: '#fff'}}
                    onPress={() => {
                      this.changeFilter('artist_location');
                    }}
                    title={this.lang.FILTER_ARTIST_LOCATION}
                    checked={this.state.filter.indexOf('artist_location') > -1}
                  />
                  <CheckBox
                    containerStyle={{
                      margin: 0,
                      borderWidth: 0,
                      backgroundColor: Colors.button,
                      borderRadius: 0,
                    }}
                    textStyle={{color: '#fff'}}
                    onPress={() => {
                      this.changeFilter('client_location');
                    }}
                    title={this.lang.FILTER_CLIENT_LOCATION}
                    checked={this.state.filter.indexOf('client_location') > -1}
                  />
                  <CheckBox
                    containerStyle={{
                      margin: 0,
                      borderWidth: 0,
                      backgroundColor: Colors.button,
                      borderRadius: 0,
                    }}
                    textStyle={{color: '#fff'}}
                    onPress={() => {
                      this.changeFilter('other_cities');
                    }}
                    title={this.lang.FILTER_OTHER_CITIES}
                    checked={this.state.filter.indexOf('other_cities') > -1}
                  />

                  <CheckBox
                    containerStyle={{
                      margin: 0,
                      borderWidth: 0,
                      backgroundColor: Colors.button,
                      borderRadius: 0,
                    }}
                    textStyle={{color: '#fff'}}
                    onPress={() => {
                      this.changeFilter('favs');
                    }}
                    title={this.lang.FILTER_FAV}
                    checked={this.state.filter.indexOf('favs') > -1}
                  />

                  <CheckBox
                    containerStyle={{
                      margin: 0,
                      borderWidth: 0,
                      backgroundColor: Colors.button,
                      borderRadius: 0,
                    }}
                    textStyle={{color: '#fff'}}
                    onPress={() => {
                      this.changeFilter('service_1');
                    }}
                    title={this.lang.FILTER_BRIDAL}
                    checked={this.state.filter.indexOf('service_1') > -1}
                  />

                  <CheckBox
                    containerStyle={{
                      margin: 0,
                      borderWidth: 0,
                      backgroundColor: Colors.button,
                      borderRadius: 0,
                    }}
                    textStyle={{color: '#fff'}}
                    onPress={() => {
                      this.changeFilter('service_2');
                    }}
                    title={this.lang.FILTER_BRIDAL_2}
                    checked={this.state.filter.indexOf('service_2') > -1}
                  />

                  <CheckBox
                    containerStyle={{
                      margin: 0,
                      borderWidth: 0,
                      backgroundColor: Colors.button,
                      borderRadius: 0,
                    }}
                    textStyle={{color: '#fff'}}
                    onPress={() => {
                      this.changeFilter('service_3');
                    }}
                    title={this.lang.FILTER_BRIDAL_3}
                    checked={this.state.filter.indexOf('service_3') > -1}
                  />

                  <CheckBox
                    containerStyle={{
                      margin: 0,
                      borderWidth: 0,
                      backgroundColor: Colors.button,
                      borderRadius: 0,
                    }}
                    textStyle={{color: '#fff'}}
                    onPress={() => {
                      this.changeFilter('service_4');
                    }}
                    title={this.lang.FILTER_BRIDAL_4}
                    checked={this.state.filter.indexOf('service_4') > -1}
                  />
                </View>
              ) : (
                false
              )}
            </View>
          </View>

          <View style={globalStyles.filter_box}>
            <View style={globalStyles.col}>
              <Button
                icon={{name: 'sort'}}
                title={this.lang.SORT}
                containerViewStyle={{
                  marginLeft: 0,
                  marginRight: 0,
                  width: '100%',
                  flex: 1,
                  borderRightWidth: 1,
                  borderRightColor: Colors.primaryDark,
                }}
                buttonStyle={globalStyles.Button}
                backgroundColor={Colors.primary}
                onPress={() => {
                  this.toggleSort();
                }}
              />
            </View>

            <View style={globalStyles.col}>
              <Button
                icon={{name: 'filter-list'}}
                title={this.lang.FILTER}
                containerViewStyle={{
                  marginLeft: 0,
                  marginRight: 0,
                  width: '100%',
                  flex: 1,
                }}
                buttonStyle={globalStyles.Button}
                backgroundColor={Colors.primary}
                onPress={() => {
                  this.toggleFilter();
                }}
              />
            </View>
          </View>
        </SideMenu>
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

export default connect(mapStateToProps)(Home);
