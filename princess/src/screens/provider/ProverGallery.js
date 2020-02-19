import React from 'react';
import {connect} from 'react-redux';
import SideMenu from 'react-native-side-menu';
import {providerListingImages} from '../../actions/register';
import {Header, Button, Icon} from 'react-native-elements';
import {
  globalStyles,
  Colors,
  Paddings,
  getLanguageStrings
} from '../../utils/Theme';
import constants from '../../utils/Constants.js';
import {NavigationActions} from 'react-navigation';
// import ScalingButton from '../../modules/ScalingButton';
import SlideMenu2 from './../SlideMenu';
import PhotoUpload from 'react-native-photo-upload';
import Dialog from 'react-native-dialog';
// const moment = require('moment');
import TopRightArea from '../../modules/TopRightArea';

import {Text, View, Dimensions, Image, TouchableOpacity} from 'react-native';
import InstagramLogin from 'react-native-instagram-login';

const {width, height} = Dimensions.get('window');

const popup_height = Math.min((70 * height) / 100, 600);
const endpoint = constants.BASE_URL;

class ProverGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      insta_loaded_images: [],
      isOpen: false,
      listing_created: false,
      is_editing: false,
      is_editing_id: false,
      is_editing_val: '',
      loaded: false,
      loadingB1: false,
      is_showing_instagram_selector: false,
      listing_id: null,
      image_1: '',
      image_2: '',
      image_3: '',
      image_4: '',
      image_5: '',
      image_6: '',
      image_7: '',
      image_8: '',
      image_9: '',
      image_10: '',
      t_image_1: '',
      t_image_2: '',
      t_image_3: '',
      t_image_4: '',
      t_image_5: '',
      t_image_6: '',
      t_image_7: '',
      t_image_8: '',
      t_image_9: '',
      t_image_10: '',
      insta_token: ''
    };
    this.lang = getLanguageStrings(this.props.language.current);
  }

  showInsta(l) {
    this.l = l;
    if (this.state.insta_token == '') {
      this.l = l;
      this.instagramLogin.show();
      return;
    }
    this.setState({
      is_showing_instagram_selector: true,
      showing_insta_selector_for: l
    });
  }

  loadInstagram(token) {
    fetch(
      'https://api.instagram.com/v1/users/self/media/recent/?' + token,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json'
        }
      }

      // endpoint +
      //   '?action=insta_images&provider_id=' +
      //   this.props.auth.user.id +
      //   '&provider_insta=' +
      //   token
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.ok == false) {
          alert('failed to fetch..');
          return;
        }
        this.setState({
          insta_loaded_images: responseJson.data ? responseJson.data : []
        });
        // alert(responseJson.insta_images.length);
      })
      .catch(error => {
        // alert(error.message);
        alert('unable to fetch your instagram images');
      });
  }

  saveImages() {
    if (
      this.state.image_1 == '' &&
      this.state.image_2 == '' &&
      this.state.image_3 == '' &&
      this.state.image_4 == '' &&
      this.state.image_5 == '' &&
      this.state.image_6 == '' &&
      this.state.image_7 == '' &&
      this.state.image_8 == '' &&
      this.state.image_9 == '' &&
      this.state.image_10 == ''
    ) {
      alert(this.lang.PROCESS_IMAGE_ERROR);
      return;
    }
    this.setState({loadingB1: true});
    this.props.dispatch(
      providerListingImages(
        {
          images: [
            this.state.image_1,
            this.state.image_2,
            this.state.image_3,
            this.state.image_4,
            this.state.image_5,
            this.state.image_6,
            this.state.image_7,
            this.state.image_8,
            this.state.image_9,
            this.state.image_10
          ],
          text: [
            this.state.t_image_1,
            this.state.t_image_2,
            this.state.t_image_3,
            this.state.t_image_4,
            this.state.t_image_5,
            this.state.t_image_6,
            this.state.t_image_7,
            this.state.t_image_8,
            this.state.t_image_9,
            this.state.t_image_10
          ]
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
        '?action=princess_get_listing&provider_id=' +
        this.props.auth.user.id
    )
      .then(response => response.json())
      .then(responseJson => {
        let listing;
        if (responseJson.listing) {
          listing = responseJson.listing;
          if (listing.images) {
            listing.images = JSON.parse(listing.images);
          } else {
            listing.images = [];
          }
          if (listing.image_desc) {
            listing.image_desc = JSON.parse(listing.image_desc);
          } else {
            listing.image_desc = [];
          }
          this.setState(
            {
              listing_created: true,
              loaded: true,
              listing_id: responseJson.listing.id,
              listing: listing,
              // image
              image_1: listing.cover,
              image_2: listing.images[0] ? listing.images[0] : '',
              image_3: listing.images[1] ? listing.images[1] : '',
              image_4: listing.images[2] ? listing.images[2] : '',
              image_5: listing.images[3] ? listing.images[3] : '',
              image_6: listing.images[4] ? listing.images[4] : '',
              image_7: listing.images[5] ? listing.images[5] : '',
              image_8: listing.images[6] ? listing.images[6] : '',
              image_9: listing.images[7] ? listing.images[7] : '',
              image_10: listing.images[8] ? listing.images[8] : '',
              t_image_1: '',
              t_image_2: listing.image_desc[0] ? listing.image_desc[0] : '',
              t_image_3: listing.image_desc[1] ? listing.image_desc[1] : '',
              t_image_4: listing.image_desc[2] ? listing.image_desc[2] : '',
              t_image_5: listing.image_desc[3] ? listing.image_desc[3] : '',
              t_image_6: listing.image_desc[4] ? listing.image_desc[4] : '',
              t_image_7: listing.image_desc[5] ? listing.image_desc[5] : '',
              t_image_8: listing.image_desc[6] ? listing.image_desc[6] : '',
              t_image_9: listing.image_desc[7] ? listing.image_desc[7] : '',
              t_image_10: listing.image_desc[8] ? listing.image_desc[8] : ''
            },
            () => {}
          );
        }
      })
      .catch(error => {
        // alert(error.message);
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
    // const {navigate} = this.props.navigation;

    const navigateAction = NavigationActions.navigate({
      routeName: 'UnreadOrders',
      params: {},
      action: NavigationActions.navigate({routeName: 'UnreadOrders'})
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    const colr = 'aaaaaa';
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
                  {this.lang.PLEASE_WAIT_WHILE_GALLERY}
                </Text>
              </View>
            </View>
          </SideMenu>
        </View>
      );
    }

    if (this.state.is_showing_instagram_selector) {
      return (
        <View style={globalStyles.containerSplash}>
          <View style={globalStyles.innerContainer}>
            <View style={{width: '100%', height: '100%', display: 'flex'}}>
              <Button
                containerViewStyle={{flex: 1}}
                onPress={() => {
                  this.setState({
                    is_showing_instagram_selector: false,
                    showing_insta_selector_for: 0
                  });
                }}
                buttonStyle={globalStyles.Button}
                loading={this.state.loadingB3}
                backgroundColor={Colors.primary}
                color={Colors.white}
                // icon={''}
                icon={{
                  name: 'arrow-back'
                  // size: 15,
                  // color: "white"
                }}
                rounded
                title={'Go Back'}
              />

              <View
                style={[
                  globalStyles.row,
                  {flex: 4, padding: 0, flexDirection: 'row', flexWrap: 'wrap'}
                ]}
              >
                {this.state.insta_loaded_images.map((insta_image, i) => {
                  if (i == 0) {
                    // alert(JSON.stringify(insta_image));
                  }
                  return (
                    <View
                      key={i}
                      style={[
                        {
                          margin: 3,
                          backgroundColor: Colors.primary,
                          height: 100,
                          width: '30%'
                        }
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            is_showing_instagram_selector: false,
                            ['image_' +
                            this.state.showing_insta_selector_for]: insta_image
                              .images.thumbnail.url,
                            showing_insta_selector_for: 0
                          });
                        }}
                      >
                        <Image
                          style={{height: '100%', width: '100%'}}
                          resizeMode="cover"
                          source={{
                            uri: insta_image.images.thumbnail.url
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      );
    }

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
              <View style={{width: '100%', height: '100%', display: 'flex'}}>
                <View
                  style={[
                    globalStyles.row,
                    {flex: 1, padding: Paddings.medium}
                  ]}
                >
                  <PhotoUpload
                    containerStyle={{marginBottom: 20}}
                    onPhotoSelect={avatar => {
                      if (avatar) {
                        this.setState({
                          image_1: 'data:image/png;base64,' + avatar
                        });
                      }
                    }}
                  >
                    <Image
                      style={{
                        width: width - Paddings.big - Paddings.big,
                        height: 100
                      }}
                      resizeMode="cover"
                      source={{
                        uri: this.state.image_1
                          ? this.state.image_1
                          : 'http://via.placeholder.com/350x150/' +
                            colr +
                            '/555555?text=Cover+Image'
                      }}
                    />
                  </PhotoUpload>
                </View>

                <View
                  style={[
                    globalStyles.row,
                    {flex: 1, padding: Paddings.medium}
                  ]}
                >
                  <View
                    style={[
                      globalStyles.col,
                      {margin: 3, backgroundColor: Colors.primary}
                    ]}
                  >
                    <PhotoUpload
                      containerStyle={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'stretch',
                        margin: '5%',
                        backgroundColor: '#fff',
                        width: '90%'
                      }}
                      onPhotoSelect={avatar => {
                        if (avatar) {
                          this.setState({
                            image_2: 'data:image/png;base64,' + avatar
                          });
                        }
                      }}
                    >
                      <Image
                        style={{height: '100%', width: '100%'}}
                        resizeMode="cover"
                        source={{
                          uri: this.state.image_2
                            ? this.state.image_2
                            : 'http://via.placeholder.com/100x100/' +
                              colr +
                              '/555555?text=Image+2'
                        }}
                      />
                    </PhotoUpload>
                    <View
                      style={{
                        height: 30,
                        backgroundColor: Colors.primary,
                        flexDirection: 'row'
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Icon
                          size={20}
                          onPress={() => {
                            this.showInsta(2);
                          }}
                          name="instagram"
                          type={'material-community'}
                          color="#fff"
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_2 ? (
                          <Icon
                            size={20}
                            onPress={() => {
                              this.setState({
                                is_editing: true,
                                is_editing_val: this.state.t_image_2,
                                is_editing_id: 'image_2'
                              });
                            }}
                            name="text-format"
                            color="#fff"
                          />
                        ) : (
                          false
                        )}
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_2 ? (
                          <Icon
                            size={20}
                            name="delete"
                            color="#fff"
                            onPress={() => {
                              this.setState({image_2: ''});
                            }}
                          />
                        ) : (
                          false
                        )}
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      globalStyles.col,
                      {margin: 3, backgroundColor: Colors.primary}
                    ]}
                  >
                    <PhotoUpload
                      containerStyle={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'stretch',
                        margin: '5%',
                        backgroundColor: '#fff',
                        width: '90%'
                      }}
                      onPhotoSelect={avatar => {
                        if (avatar) {
                          this.setState({
                            image_3: 'data:image/png;base64,' + avatar
                          });
                        }
                      }}
                    >
                      <Image
                        style={{height: '100%', width: '100%'}}
                        resizeMode="cover"
                        source={{
                          uri: this.state.image_3
                            ? this.state.image_3
                            : 'http://via.placeholder.com/100x100/' +
                              colr +
                              '/555555?text=Image+3'
                        }}
                      />
                    </PhotoUpload>
                    <View
                      style={{
                        height: 30,
                        backgroundColor: Colors.primary,
                        flexDirection: 'row'
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Icon
                          size={20}
                          onPress={() => {
                            this.showInsta(3);
                          }}
                          name="instagram"
                          type={'material-community'}
                          color="#fff"
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_3 ? (
                          <Icon
                            size={20}
                            onPress={() => {
                              this.setState({
                                is_editing: true,
                                is_editing_val: this.state.t_image_3,
                                is_editing_id: 'image_3'
                              });
                            }}
                            name="text-format"
                            color="#fff"
                          />
                        ) : (
                          false
                        )}
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_3 ? (
                          <Icon
                            size={20}
                            name="delete"
                            color="#fff"
                            onPress={() => {
                              this.setState({image_3: ''});
                            }}
                          />
                        ) : (
                          false
                        )}
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      globalStyles.col,
                      {margin: 3, backgroundColor: Colors.primary}
                    ]}
                  >
                    <PhotoUpload
                      containerStyle={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'stretch',
                        margin: '5%',
                        backgroundColor: '#fff',
                        width: '90%'
                      }}
                      onPhotoSelect={avatar => {
                        if (avatar) {
                          this.setState({
                            image_4: 'data:image/png;base64,' + avatar
                          });
                        }
                      }}
                    >
                      <Image
                        style={{height: '100%', width: '100%'}}
                        resizeMode="cover"
                        source={{
                          uri: this.state.image_4
                            ? this.state.image_4
                            : 'http://via.placeholder.com/100x100/' +
                              colr +
                              '/555555?text=Image+4'
                        }}
                      />
                    </PhotoUpload>
                    <View
                      style={{
                        height: 30,
                        backgroundColor: Colors.primary,
                        flexDirection: 'row'
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Icon
                          size={20}
                          onPress={() => {
                            this.showInsta(4);
                          }}
                          name="instagram"
                          type={'material-community'}
                          color="#fff"
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_4 ? (
                          <Icon
                            size={20}
                            onPress={() => {
                              this.setState({
                                is_editing: true,
                                is_editing_val: this.state.t_image_4,
                                is_editing_id: 'image_4'
                              });
                            }}
                            name="text-format"
                            color="#fff"
                          />
                        ) : (
                          false
                        )}
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_4 ? (
                          <Icon
                            size={20}
                            name="delete"
                            color="#fff"
                            onPress={() => {
                              this.setState({image_4: ''});
                            }}
                          />
                        ) : (
                          false
                        )}
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    globalStyles.row,
                    {flex: 1, padding: Paddings.medium}
                  ]}
                >
                  <View
                    style={[
                      globalStyles.col,
                      {margin: 3, backgroundColor: Colors.primary}
                    ]}
                  >
                    <PhotoUpload
                      containerStyle={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'stretch',
                        margin: '5%',
                        backgroundColor: '#fff',
                        width: '90%'
                      }}
                      onPhotoSelect={avatar => {
                        if (avatar) {
                          this.setState({
                            image_5: 'data:image/png;base64,' + avatar
                          });
                        }
                      }}
                    >
                      <Image
                        style={{height: '100%', width: '100%'}}
                        resizeMode="cover"
                        source={{
                          uri: this.state.image_5
                            ? this.state.image_5
                            : 'http://via.placeholder.com/100x100/' +
                              colr +
                              '/555555?text=Image+5'
                        }}
                      />
                    </PhotoUpload>
                    <View
                      style={{
                        height: 30,
                        backgroundColor: Colors.primary,
                        flexDirection: 'row'
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Icon
                          size={20}
                          onPress={() => {
                            this.showInsta(5);
                          }}
                          name="instagram"
                          type={'material-community'}
                          color="#fff"
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_5 ? (
                          <Icon
                            size={20}
                            onPress={() => {
                              this.setState({
                                is_editing: true,
                                is_editing_val: this.state.t_image_5,
                                is_editing_id: 'image_5'
                              });
                            }}
                            name="text-format"
                            color="#fff"
                          />
                        ) : (
                          false
                        )}
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_5 ? (
                          <Icon
                            size={20}
                            name="delete"
                            color="#fff"
                            onPress={() => {
                              this.setState({image_5: ''});
                            }}
                          />
                        ) : (
                          false
                        )}
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      globalStyles.col,
                      {margin: 3, backgroundColor: Colors.primary}
                    ]}
                  >
                    <PhotoUpload
                      containerStyle={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'stretch',
                        margin: '5%',
                        backgroundColor: '#fff',
                        width: '90%'
                      }}
                      onPhotoSelect={avatar => {
                        if (avatar) {
                          this.setState({
                            image_6: 'data:image/png;base64,' + avatar
                          });
                        }
                      }}
                    >
                      <Image
                        style={{height: '100%', width: '100%'}}
                        resizeMode="cover"
                        source={{
                          uri: this.state.image_6
                            ? this.state.image_6
                            : 'http://via.placeholder.com/100x100/' +
                              colr +
                              '/555555?text=Image+6'
                        }}
                      />
                    </PhotoUpload>
                    <View
                      style={{
                        height: 30,
                        backgroundColor: Colors.primary,
                        flexDirection: 'row'
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Icon
                          size={20}
                          onPress={() => {
                            this.showInsta(6);
                          }}
                          name="instagram"
                          type={'material-community'}
                          color="#fff"
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_6 ? (
                          <Icon
                            size={20}
                            onPress={() => {
                              this.setState({
                                is_editing: true,
                                is_editing_val: this.state.t_image_6,
                                is_editing_id: 'image_6'
                              });
                            }}
                            name="text-format"
                            color="#fff"
                          />
                        ) : (
                          false
                        )}
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_6 ? (
                          <Icon
                            size={20}
                            name="delete"
                            color="#fff"
                            onPress={() => {
                              this.setState({image_6: ''});
                            }}
                          />
                        ) : (
                          false
                        )}
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      globalStyles.col,
                      {margin: 3, backgroundColor: Colors.primary}
                    ]}
                  >
                    <PhotoUpload
                      containerStyle={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'stretch',
                        margin: '5%',
                        backgroundColor: '#fff',
                        width: '90%'
                      }}
                      onPhotoSelect={avatar => {
                        if (avatar) {
                          this.setState({
                            image_7: 'data:image/png;base64,' + avatar
                          });
                        }
                      }}
                    >
                      <Image
                        style={{height: '100%', width: '100%'}}
                        resizeMode="cover"
                        source={{
                          uri: this.state.image_7
                            ? this.state.image_7
                            : 'http://via.placeholder.com/100x100/' +
                              colr +
                              '/555555?text=Image+7'
                        }}
                      />
                    </PhotoUpload>
                    <View
                      style={{
                        height: 30,
                        backgroundColor: Colors.primary,
                        flexDirection: 'row'
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Icon
                          size={20}
                          onPress={() => {
                            this.showInsta(7);
                          }}
                          name="instagram"
                          type={'material-community'}
                          color="#fff"
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_7 ? (
                          <Icon
                            size={20}
                            onPress={() => {
                              this.setState({
                                is_editing: true,
                                is_editing_val: this.state.t_image_7,
                                is_editing_id: 'image_7'
                              });
                            }}
                            name="text-format"
                            color="#fff"
                          />
                        ) : (
                          false
                        )}
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_7 ? (
                          <Icon
                            size={20}
                            name="delete"
                            color="#fff"
                            onPress={() => {
                              this.setState({image_7: ''});
                            }}
                          />
                        ) : (
                          false
                        )}
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    globalStyles.row,
                    {flex: 1, padding: Paddings.medium}
                  ]}
                >
                  <View
                    style={[
                      globalStyles.col,
                      {margin: 3, backgroundColor: Colors.primary}
                    ]}
                  >
                    <PhotoUpload
                      containerStyle={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'stretch',
                        margin: '5%',
                        backgroundColor: '#fff',
                        width: '90%'
                      }}
                      onPhotoSelect={avatar => {
                        if (avatar) {
                          this.setState({
                            image_8: 'data:image/png;base64,' + avatar
                          });
                        }
                      }}
                    >
                      <Image
                        style={{height: '100%', width: '100%'}}
                        resizeMode="cover"
                        source={{
                          uri: this.state.image_8
                            ? this.state.image_8
                            : 'http://via.placeholder.com/100x100/' +
                              colr +
                              '/555555?text=Image+8'
                        }}
                      />
                    </PhotoUpload>
                    <View
                      style={{
                        height: 30,
                        backgroundColor: Colors.primary,
                        flexDirection: 'row'
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Icon
                          size={20}
                          onPress={() => {
                            this.showInsta(8);
                          }}
                          name="instagram"
                          type={'material-community'}
                          color="#fff"
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_8 ? (
                          <Icon
                            size={20}
                            onPress={() => {
                              this.setState({
                                is_editing: true,
                                is_editing_val: this.state.t_image_8,
                                is_editing_id: 'image_8'
                              });
                            }}
                            name="text-format"
                            color="#fff"
                          />
                        ) : (
                          false
                        )}
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_8 ? (
                          <Icon
                            size={20}
                            name="delete"
                            color="#fff"
                            onPress={() => {
                              this.setState({image_8: ''});
                            }}
                          />
                        ) : (
                          false
                        )}
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      globalStyles.col,
                      {margin: 3, backgroundColor: Colors.primary}
                    ]}
                  >
                    <PhotoUpload
                      containerStyle={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'stretch',
                        margin: '5%',
                        backgroundColor: '#fff',
                        width: '90%'
                      }}
                      onPhotoSelect={avatar => {
                        if (avatar) {
                          this.setState({
                            image_9: 'data:image/png;base64,' + avatar
                          });
                        }
                      }}
                    >
                      <Image
                        style={{height: '100%', width: '100%'}}
                        resizeMode="cover"
                        source={{
                          uri: this.state.image_9
                            ? this.state.image_9
                            : 'http://via.placeholder.com/100x100/' +
                              colr +
                              '/555555?text=Image+9'
                        }}
                      />
                    </PhotoUpload>
                    <View
                      style={{
                        height: 30,
                        backgroundColor: Colors.primary,
                        flexDirection: 'row'
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Icon
                          size={20}
                          onPress={() => {
                            this.showInsta(9);
                          }}
                          name="instagram"
                          type={'material-community'}
                          color="#fff"
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_9 ? (
                          <Icon
                            size={20}
                            onPress={() => {
                              this.setState({
                                is_editing: true,
                                is_editing_val: this.state.t_image_9,
                                is_editing_id: 'image_9'
                              });
                            }}
                            name="text-format"
                            color="#fff"
                          />
                        ) : (
                          false
                        )}
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_9 ? (
                          <Icon
                            size={20}
                            name="delete"
                            color="#fff"
                            onPress={() => {
                              this.setState({image_9: ''});
                            }}
                          />
                        ) : (
                          false
                        )}
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      globalStyles.col,
                      {margin: 3, backgroundColor: Colors.primary}
                    ]}
                  >
                    <PhotoUpload
                      containerStyle={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'stretch',
                        margin: '5%',
                        backgroundColor: '#fff',
                        width: '90%'
                      }}
                      onPhotoSelect={avatar => {
                        if (avatar) {
                          this.setState({
                            image_10: 'data:image/png;base64,' + avatar
                          });
                        }
                      }}
                    >
                      <Image
                        style={{height: '100%', width: '100%'}}
                        resizeMode="cover"
                        source={{
                          uri: this.state.image_10
                            ? this.state.image_10
                            : 'http://via.placeholder.com/100x100/' +
                              colr +
                              '/555555?text=Image+10'
                        }}
                      />
                    </PhotoUpload>
                    <View
                      style={{
                        height: 30,
                        backgroundColor: Colors.primary,
                        flexDirection: 'row'
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Icon
                          size={20}
                          onPress={() => {
                            this.showInsta(10);
                          }}
                          name="instagram"
                          type={'material-community'}
                          color="#fff"
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_10 ? (
                          <Icon
                            size={20}
                            onPress={() => {
                              this.setState({
                                is_editing: true,
                                is_editing_val: this.state.t_image_10,
                                is_editing_id: 'image_10'
                              });
                            }}
                            name="text-format"
                            color="#fff"
                          />
                        ) : (
                          false
                        )}
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {this.state.image_10 ? (
                          <Icon
                            size={20}
                            name="delete"
                            color="#fff"
                            onPress={() => {
                              this.setState({image_10: ''});
                            }}
                          />
                        ) : (
                          false
                        )}
                      </View>
                    </View>
                  </View>
                </View>
                <View style={[globalStyles.row, {flex: 1}]}>
                  <View style={globalStyles.col}>
                    <Button
                      containerViewStyle={{flex: 1}}
                      onPress={() => this.saveImages()}
                      buttonStyle={globalStyles.Button}
                      loading={this.state.loadingB1}
                      backgroundColor={Colors.primary}
                      color={Colors.white}
                      rounded
                      title={this.lang.UPLOAD_AND_SAVE}
                    />

                    {/* <Button
                      containerViewStyle={{flex: 1}}
                      onPress={() => this.loadInstagram()}
                      buttonStyle={globalStyles.Button}
                      loading={this.state.loadingB3}
                      backgroundColor={Colors.primary}
                      color={Colors.white}
                      rounded
                      title={this.lang.LOAD_FROM_INSTAGRAM}
                    /> */}

                    <Text style={{textAlign: 'center', width: '100%'}}>
                      {this.lang.TAP_TO_CHANGE_IMG}
                    </Text>
                  </View>
                </View>
              </View>
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

          <Dialog.Container visible={this.state.choosing_action}>
            <Dialog.Button
              label={'from instagram'}
              onPress={() => {
                this.setState({choosing_action_from_instagram: false});
              }}
            />
            <Dialog.Button label={'from device'} onPress={() => {}} />
          </Dialog.Container>

          <Dialog.Container visible={this.state.is_editing}>
            <Dialog.Title>{this.lang.EDIT_DESCR}</Dialog.Title>
            <Dialog.Input
              onChangeText={text => this.setState({is_editing_val: text})}
              value={this.state.is_editing_val}
            />
            <Dialog.Button
              label={this.lang.CANCEL}
              onPress={() => {
                this.setState({is_editing: false});
              }}
            />
            <Dialog.Button
              label={this.lang.OK}
              onPress={() => {
                const returnObj = {
                  is_editing_val: '',
                  is_editing: false,
                  is_editing_id: false
                };
                returnObj[
                  't_' + this.state.is_editing_id
                ] = this.state.is_editing_val;
                this.setState(returnObj);
                this.setState({is_editing: false});
              }}
            />
          </Dialog.Container>
        </SideMenu>
        <InstagramLogin
          ref={ref => (this.instagramLogin = ref)}
          clientId="0e78a5a5cfe74d0caedfe354e1c86963"
          redirectUrl="http://princessapp.co/wp-admin/admin-ajax.php?action=insta_redirect"
          scopes={['public_content']}
          onLoginSuccess={token => {
            this.setState(
              {
                insta_token: token
              },
              () => {
                this.setState({
                  is_showing_instagram_selector: true,
                  showing_insta_selector_for: this.l
                });
              }
            );
            this.loadInstagram(token);
            // alert(token);
          }}
          onLoginFailure={data => console.log(JSON.stringify(data))}
        />
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

export default connect(mapStateToProps)(ProverGallery);
