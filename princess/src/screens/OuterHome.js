import React from 'react';
import {connect} from 'react-redux';
import {Header, Button, Icon, CheckBox} from 'react-native-elements';
import {register, login, forgot} from '../actions/register';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  globalStyles,
  Colors,
  Paddings,
  getLanguageStrings
} from '../utils/Theme';
import constants from '../utils/Constants.js';
import {NavigationActions, StackActions} from 'react-navigation';

import ReactNative, {
  View,
  Dimensions,Text,
  Image,
  TextInput,
  StyleSheet,
  Animated
} from 'react-native';
const {width, height} = Dimensions.get('window');
const popup_height = Math.min((80 * height) / 100, 600);

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain',
    height: '60%',
    width: '100%',
    alignSelf: 'center'
    // justifyContent
  },
  logo: {
    flex: 0.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%'
  },

  textBox1: {
    flex: 0.2,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center'
  },

  container: {
    flex: 10,
    flexDirection: 'column'
  },
  body: {
    flex: 10,
    backgroundColor: '#ccc'
  },
  footer_menu: {
    position: 'absolute',
    width: width,
    padding: Paddings.big,
    height: popup_height,
    bottom: -height,

    backgroundColor: Colors.primary
    // alignItems      : 'center'
  },
  tip_menu: {
    paddingTop: 10,
    flex: 1,
    width: '100%',
    padding: Paddings.big
  },
  tip_menuLogin: {
    paddingTop: 100,
    flex: 1,
    width: '100%',
    padding: Paddings.big
  },
  button: {
    backgroundColor: '#fff'
  },
  button_label: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});

class OuterHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      name: '',
      password: '',
      cpassword: '',
      phone_number: '',
      instagram: 'https://instagram.com/',
      underProcess: false,
      menu_expanded1: false,
      method: '',
      role: 'client',
      loading1: false,
      terms_check: false,
      loading2: false,
      loadingB1: false
      // loadingB2       : false
    };
    this.y_translate = new Animated.Value(0);
    this.lang = getLanguageStrings(this.props.language.current);
  }

  componentDidMount() {}

  goTo(path) {
    const navigateAction = NavigationActions.navigate({
      routeName: path,
      params: {},
      action: NavigationActions.navigate({routeName: path})
    });
    this.props.navigation.dispatch(navigateAction);
  }

  switchTo(l) {
    if (l != 'ar') {
      l = 'en';
    }
    this.props.dispatch({
      type: 'CHANGE_LANGUAGE',
      new: l
    });
    this.lang = getLanguageStrings(l);
  }

  hideMenu() {
    this.setState(
      {
        menu_expanded: false,
        loading1: false,
        loading2: false,
        loading3: false,
        loading4: false
      },
      () => {
        this.y_translate.setValue(1);
        Animated.spring(this.y_translate, {
          toValue: 0,
          friction: 4
        }).start();
      }
    );
  }
  showForgot() {
    const a = {};
    a.method = 'forgot';
    this.setState(a);
  }

  openMenu(c) {
    let method = '';
    //const role = '';
    switch (c) {
      case 1:
        method = 'login';
        break;
      case 2:
        method = 'register';
        break;
      case 3:
        method = 'forgot';
        break;
      default:
        method = 'login';
        break;
    }
    const a = {};
    a['loading' + c] = true;
    a.method = method;
    // a['role'] = role;
    // a['menu_expanded'] = true;
    this.setState(a);
    setTimeout(() => {
      this.setState(
        {
          menu_expanded: true
        },
        () => {
          this.y_translate.setValue(0);
          Animated.spring(this.y_translate, {
            toValue: 1,
            friction: 3
          }).start();
        }
      );
    }, 500);
  }

  skip() {
    const {state} = this.props.navigation;
    //console.log(state.params);
    if (state.params && state.params.isInner) {
      const backAction = NavigationActions.back({params: state.params});
      this.props.navigation.dispatch(backAction);

      return;
    }
    const toHome = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'Home'})]
    });
    this.props.navigation.dispatch(toHome);
  }
  _scrollToInput(reactNode: any) {
    // Add a 'scroll' ref to your ScrollView
    this.scroll.props.scrollToFocusedInput(reactNode);
  }
  doAuth() {
    if (this.state.method.trim() == 'forgot') {
      if (this.state.email.trim() == '') {
        alert('Please enter an email address/username');
        return;
      }
      this.setState({loadingB1: true});
      this.props.dispatch(
        forgot(
          {
            method: 'forgot',
            action: 'princess_forgot',
            email: this.state.email.trim()
          },
          this.props.navigation,
          () => {
            this.setState({loadingB1: false});
          }
        )
      );

      return;
    }
    if (this.state.email.trim() == '') {
      alert('Please enter an email address');
      return;
    }

    if (this.state.password.trim() == '') {
      alert('Please enter a password');
      return;
    }
    if (this.state.method.trim() == 'register') {
      if (this.state.username.trim() == '') {
        alert('Please enter a username');
        return;
      }

      if (this.state.terms_check == false) {
        alert('You need to accept the terms and conditions');
        return;
      }

      if (this.state.password.trim() != this.state.cpassword.trim()) {
        alert('Password and confirm password do not match.');
        return;
      }

      if (this.state.name.trim() == '' || this.state.cpassword.trim() == '') {
        alert('Please enter all fields');
        return;
      }

      if (this.state.role == 'provider') {
        if (
          this.state.phone_number.trim() == '' ||
          this.state.instagram.trim() == ''
        ) {
          alert('Please enter all fields');
          return;
        }
        if (
          !this.state.instagram.trim().startsWith('https://instagram.com/') ||
          this.state.instagram.trim() == 'https://instagram.com/'
        ) {
          alert(
            'Please enter a valid instagram url that begins with https://instagram.com/'
          );
        }
      }

      this.setState({loadingB1: true});
      this.props.dispatch(
        register(
          {
            method: 'register',
            action: 'princess_register',
            email: this.state.email.trim(),
            username: this.state.username.trim(),
            role: this.state.role.trim(),
            name: this.state.name.trim(),
            password: this.state.password.trim(),
            cpassword: this.state.cpassword.trim(),
            phone_number: this.state.phone_number.trim(),
            instagram: this.state.instagram.trim()
          },
          this.props.navigation,
          () => {
            this.setState({loadingB1: false});
          }
        )
      );
    } else {
      this.setState({loadingB1: true});
      this.props.dispatch(
        login(
          {
            method: 'login',
            action: 'princess_login',
            email: this.state.email.trim(),
            password: this.state.password.trim()
          },
          this.props.navigation,
          () => {
            this.setState({loadingB1: false});
          }
        )
      );
    }
  }

  render() {
    const menu_moveY = this.y_translate.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -height]
    });

    return (
      <View style={globalStyles.containerSplash}>
        <Header
          backgroundColor={Colors.primary}
          style={globalStyles.header}
          centerComponent={{
            text: constants.APP_TITLE,
            style: globalStyles.headerTitle
          }}
        />
        <View style={globalStyles.innerContainer}>
          <View style={styles.logo}>
            <Image
              style={[styles.image, {width}]}
              source={require('../assets/images/logo.png')}
            />
          </View>
          <View style={styles.textBox1}>
            <Button
              containerViewStyle={{width: '100%', flex: 1}}
              backgroundColor={Colors.button}
              onPress={() => {
                this.openMenu(1);
              }}
              loading={this.state.loading1}
              rounded={false}
              title={this.lang.LOGIN}
              buttonStyle={[globalStyles.Button, {borderRadius: 7, height: 50}]}
            />
          </View>
          <View style={styles.textBox1}>
            <Button
              containerViewStyle={{width: '100%', flex: 1}}
              backgroundColor={Colors.button}
              onPress={() => {
                this.openMenu(2);
              }}
              loading={this.state.loading2}
              rounded={false}
              title={this.lang.REGISTER}
              buttonStyle={[globalStyles.Button, {borderRadius: 7, height: 50}]}
            />
          </View>

          {/*
          <View style={styles.textBox1}>
            <Button containerViewStyle={{width:'100%', flex: 1}} backgroundColor={Colors.primary} onPress={()=>{this.openMenu(3)}}  loading={this.state.loading3} rounded={true}  title="LOGIN AS PROVIDER" buttonStyle={globalStyles.Button} />
          </View>
          <View style={styles.textBox1}>
            <Button containerViewStyle={{width:'100%', flex: 1}} backgroundColor={Colors.primary} onPress={()=>{this.openMenu(4)}}  loading={this.state.loading4} rounded={true}  title="REGISTER AS PROVIDER" buttonStyle={globalStyles.Button} />
          </View> */}

          <View style={styles.textBox1}>
            <Button
              containerViewStyle={{width: '100%', flex: 1}}
              backgroundColor={'transparent'}
              onPress={() => {
                this.skip();
              }}
              color={Colors.primary}
              title={this.lang.OR_SKIP}
            />
          </View>

          <View style={styles.textBox1}>
            {this.props.language.current == 'ar' ? (
              <Button
                containerViewStyle={{width: '100%', flex: 1}}
                backgroundColor={'transparent'}
                onPress={() => {
                  this.switchTo('en');
                }}
                color={Colors.primary}
                title={this.lang.SWITCH_TO_ENGLISH}
              />
            ) : (
              <Button
                containerViewStyle={{width: '100%', flex: 1}}
                backgroundColor={'transparent'}
                onPress={() => {
                  this.switchTo('ar');
                }}
                color={Colors.primary}
                title={this.lang.SWITCH_TO_ARABIC}
              />
            )}
          </View>
        </View>
        <Animated.View
          style={[
            styles.footer_menu,
            {
              transform: [{translateY: menu_moveY}],
              height: height,
              backgroundColor: 'transparent',
              padding: 0
            }
          ]}
        >
          {this.state.menu_expanded && (
            <View style={{alignItems: 'center'}}>
              {/*}<Button
                backgroundColor={'transparent'}
                containerViewStyle={{height: pop_neg_height, flex: 1}}
                buttonStyle={{
                  width: width,
                  height: pop_neg_height,
                  alignItems: 'center',
                  margin: 0
                }}
                onPress={() => {
                  this.hideMenu();
                }}
              />*/}
              {/*}
              <ScrollView

              >*/}
              <View
                style={[
                  styles.footer_menu,
                  {width: width, height: popup_height}
                ]}
              >
                <KeyboardAwareScrollView
                  innerRef={ref => {
                    this.scroll = ref;
                  }}
                >
                  <View
                    style={[
                      this.state.method == 'login'
                        ? styles.tip_menuLogin
                        : styles.tip_menu,
                      {
                        justifyContent: 'space-around',
                        minHeight: popup_height - 2 * Paddings.big
                      }
                    ]}
                  >
                    <View style={{justifyContent: 'flex-start'}}>
                      {this.state.method == 'register' ? (
                        <View style={styles.textBox1}>
                          <View style={globalStyles.inputWrapNoBorder}>
                            <Button
                              rounded
                              color={
                                this.state.role == 'provider'
                                  ? '#fff'
                                  : Colors.primary
                              }
                              backgroundColor={
                                this.state.role == 'provider'
                                  ? Colors.primary
                                  : '#fff'
                              }
                              buttonStyle={globalStyles.ButtonTab}
                              containerViewStyle={{
                                width: '100%',
                                flex: 1,
                                borderWidth: 1,
                                borderColor: Colors.primary
                              }}
                              onPress={() => this.setState({role: 'client'})}
                              title={this.lang.CLIENT}
                            />
                            <Button
                              rounded
                              color={
                                this.state.role == 'client'
                                  ? '#fff'
                                  : Colors.primary
                              }
                              backgroundColor={
                                this.state.role == 'client'
                                  ? Colors.primary
                                  : '#fff'
                              }
                              buttonStyle={globalStyles.ButtonTab}
                              containerViewStyle={{
                                width: '100%',
                                flex: 1,
                                borderWidth: 1,
                                borderColor: Colors.primary
                              }}
                              onPress={() => this.setState({role: 'provider'})}
                              title={this.lang.PROVIDER}
                            />
                          </View>
                        </View>
                      ) : (
                        false
                      )}
                      <View style={styles.textBox1}>
                        <View style={globalStyles.inputWrap}>
                          <Icon
                            name="account-circle"
                            size={20}
                            color={Colors.white}
                          />

                          <TextInput
                            style={globalStyles.input}
                            autoCapitalize={'none'}
                            placeholderTextColor={Colors.white}
                            onChangeText={email => this.setState({email})}
                            value={this.state.email}
                            placeholder={
                              this.state.method == 'register'
                                ? this.lang.ENTER_EMAIL
                                : this.lang.ENTER_EMAIL_USERNAME
                            }
                          />
                        </View>
                      </View>
                      {this.state.method == 'register' ? (
                        <View style={styles.textBox1}>
                          <View style={globalStyles.inputWrap}>
                            <Icon
                              name="person"
                              size={20}
                              color={Colors.white}
                            />

                            <TextInput
                              style={globalStyles.input}
                              autoCapitalize={'none'}
                              placeholderTextColor={Colors.white}
                              onChangeText={username =>
                                this.setState({username})
                              }
                              value={this.state.username}
                              placeholder={this.lang.ENTER_USER_NAME}
                            />
                          </View>
                        </View>
                      ) : (
                        false
                      )}

                      {this.state.method == 'register' ? (
                        <View style={styles.textBox1}>
                          <View style={globalStyles.inputWrap}>
                            <Icon
                              name="person"
                              size={20}
                              color={Colors.white}
                            />

                            <TextInput
                              style={globalStyles.input}
                              placeholderTextColor={Colors.white}
                              autoCapitalize={'none'}
                              onChangeText={name => this.setState({name})}
                              value={this.state.name}
                              placeholder={this.lang.ENTER_NAME}
                              onFocus={(event: Event) => {
                                // `bind` the function if you're using ES6 classes
                                this._scrollToInput(
                                  ReactNative.findNodeHandle(event.target)
                                );
                              }}
                            />
                          </View>
                        </View>
                      ) : (
                        false
                      )}

                      {this.state.method == 'register' &&
                      this.state.role == 'provider' ? (
                        <View>
                          <View style={styles.textBox1}>
                            <View style={globalStyles.inputWrap}>
                              <Icon
                                name="phone"
                                size={20}
                                color={Colors.white}
                              />

                              <TextInput
                                style={globalStyles.input}
                                placeholderTextColor={Colors.white}
                                autoCapitalize={'none'}
                                onChangeText={phone_number =>
                                  this.setState({phone_number})
                                }
                                value={this.state.phone_number}
                                placeholder={this.lang.ENTER_PHONE_NUMBER}
                                onFocus={(event: Event) => {
                                  // `bind` the function if you're using ES6 classes
                                  this._scrollToInput(
                                    ReactNative.findNodeHandle(event.target)
                                  );
                                }}
                              />
                            </View>
                          </View>
                          <View style={styles.textBox1}>
                            <View style={globalStyles.inputWrap}>
                              <Icon
                                name="instagram"
                                size={20}
                                color={Colors.white}
                                type="material-community"
                              />

                              <TextInput
                                style={globalStyles.input}
                                placeholderTextColor={Colors.white}
                                autoCapitalize={'none'}
                                onChangeText={instagram =>
                                  this.setState({instagram})
                                }
                                value={this.state.instagram}
                                placeholder={this.lang.PLACE_INSTA}
                                onFocus={(event: Event) => {
                                  // `bind` the function if you're using ES6 classes
                                  this._scrollToInput(
                                    ReactNative.findNodeHandle(event.target)
                                  );
                                }}
                              />
                            </View>
                          </View>
                        </View>
                      ) : (
                        false
                      )}

                      {this.state.method != 'forgot' ? (
                        <View style={styles.textBox1}>
                          <View style={globalStyles.inputWrap}>
                            <Icon name="https" size={20} color={Colors.white} />

                            <TextInput
                              style={globalStyles.input}
                              placeholderTextColor={Colors.white}
                              onChangeText={password =>
                                this.setState({password})
                              }
                              value={this.state.password}
                              secureTextEntry
                              placeholder={this.lang.ENTER_PASSWORD}
                              onFocus={(event: Event) => {
                                // `bind` the function if you're using ES6 classes
                                this._scrollToInput(
                                  ReactNative.findNodeHandle(event.target)
                                );
                              }}
                            />
                          </View>
                        </View>
                      ) : (
                        false
                      )}

                      {this.state.method == 'register' ? (
                        <View style={styles.textBox1}>
                          <View style={globalStyles.inputWrap}>
                            <Icon name="https" size={20} color={Colors.white} />

                            <TextInput
                              style={globalStyles.input}
                              placeholderTextColor={Colors.white}
                              onChangeText={cpassword =>
                                this.setState({cpassword})
                              }
                              value={this.state.cpassword}
                              secureTextEntry
                              placeholder={this.lang.CONFIRM_PASSWORD}
                              onFocus={(event: Event) => {
                                // `bind` the function if you're using ES6 classes
                                this._scrollToInput(
                                  ReactNative.findNodeHandle(event.target)
                                );
                              }}
                            />
                          </View>
                        </View>
                      ) : (
                        false
                      )}

                      {this.state.method == 'register' ? (
                        <View>
                          <View style={styles.textBox1}>
                            <CheckBox
                              containerStyle={{
                                backgroundColor: 'transparent',
                                padding: 0,
                                borderWidth: 0
                              }}
                              textStyle={{color: 'white', padding: 0}}
                              title={this.lang.TERMS_CHECK}
                              checked={this.state.terms_check}
                              onPress={() =>
                                this.setState({
                                  terms_check: !this.state.terms_check
                                })
                              }
                            />
                          </View>

                          <View style={styles.textBox1}>
                            <Button
                              containerViewStyle={{width: '100%', flex: 1}}
                              color={Colors.white}
                              title={this.lang.TAP_TO_READ}
                              backgroundColor={'transparent'}
                              onPress={() => this.goTo('Terms')}
                            />
                          </View>
                        </View>
                      ) : (
                        false
                      )}

                      <View style={styles.textBox1} />
                      <View style={styles.textBox1}>
                        <Button
                          containerViewStyle={{width: '100%', flex: 1}}
                          onPress={() => this.doAuth()}
                          buttonStyle={globalStyles.Button}
                          disabled={this.state.loadingB1}
                          loading={this.state.loadingB1}
                          backgroundColor={Colors.white}
                          color={Colors.primary}
                          rounded
                          title={this.lang[this.state.method.toUpperCase()]}
                        />
                      </View>

                      {this.state.method == 'login' ? (
                        <View style={styles.textBox1}>
                          <Button
                            backgroundColor={'transparent'}
                            containerViewStyle={{width: '100%', flex: 1}}
                            onPress={() => {
                              this.showForgot(3);
                            }}
                            color={Colors.white}
                            title={this.lang.FORGOT_PASSWORD}
                          />
                        </View>
                      ) : (
                        <Text>{ ' '}</Text>
                      )}
                    </View>
                    <View style={[styles.textBox1, {alignSelf: 'flex-end'}]}>
                      <Button
                        buttonStyle={globalStyles.Button}
                        //backgroundColor={'transparent'}
                        containerViewStyle={{width: '100%', flex: 1}}
                        onPress={() => {
                          this.hideMenu();
                        }}
                        //color={Colors.white}
                        backgroundColor={Colors.white}
                        color={Colors.primary}
                        rounded
                        title={this.lang.GO_BACK}
                      />
                    </View>
                  </View>
                </KeyboardAwareScrollView>
                {/*}    </ScrollView> */}
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    messages: state.messages,
    language: state.language
  };
};

export default connect(mapStateToProps)(OuterHome);
