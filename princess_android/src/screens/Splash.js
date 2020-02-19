import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  StatusBar,
  Easing,
  Animated
} from 'react-native';
import ProgressBar from '../modules/progressBar';
import {globalStyles, Colors} from '../utils/Theme';
import {StackActions, NavigationActions} from 'react-navigation';
import constants from '../utils/Constants.js';
import OneSignal from 'react-native-onesignal'; // Import package from node modules

import {scale} from '../utils/ThemeHelper';
import {connect} from 'react-redux';
const endpoint = constants.BASE_URL;

const timeFrame = 500;
import CircleTransition from '../modules/CircleTransition';
const ANIMATION_DURATION = 1500;
const INITIAL_VIEW_BACKGROUND_COLOR = '#fff';
const CIRCLE_COLOR1 = Colors.primary;
const CIRCLE_COLOR2 = Colors.primary;
const CIRCLE_COLOR3 = Colors.primary;
const CIRCLE_COLOR4 = Colors.primary;
const TRANSITION_BUFFER = 10;
// const POSITON = 'custom';
const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain',
    height: '70%'
  },
  logo: {
    flex: 2,
    justifyContent: 'flex-end'
  },

  textBox1: {
    flex: 0.5,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center'
  },
  textBox2: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textBox3: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  textBox4: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'red',
    alignItems: 'center'
  },

  hero: {
    fontSize: 40,
    color: '#fff'
  },
  appVersion: {
    fontSize: 20,
    color: '#fff'
  },
  progress: {
    alignSelf: 'center',
    marginBottom: 35,
    marginTop: 35,
    // flex  : 1,
    backgroundColor: '#f7cecf'
  }
});

export class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      viewBackgroundColor: INITIAL_VIEW_BACKGROUND_COLOR,
      circleColor: CIRCLE_COLOR1,
      customLeftMargin: 0,
      customTopMargin: 0,
      counter: 0
    };

    this.changeColor = this.changeColor.bind(this);

    OneSignal.init('0c36b3d8-97d9-448f-8aac-940f35366710', {
      kOSSettingsKeyAutoPrompt: true
    });
    OneSignal.enableSound(true);
    OneSignal.inFocusDisplaying(2);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    // console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    // console.log('Message: ', openResult.notification.payload.body);
    // console.log('Data: ', openResult.notification.payload.additionalData);
    // console.log('isActive: ', openResult.notification.isAppInFocus);
    // console.log('openResult: ', openResult);
  }
  route = '';

  onIds(device) {
    // console.log('Device info: ', device);
  }

  componentWillMount() {
    this.animatedValue = new Animated.Value(0);
  }
  up() {
    this.setState(
      {
        customLeftMargin: 0,
        customTopMargin: 0
      },
      this.circleTransition.start(this.changeColor)
    );
  }

  componentDidMount() {
    StatusBar.setHidden(true, 'none');
    // let route;
    if (this.props.auth.user && this.props.auth.user_role) {
      OneSignal.sendTags({
        key: 'uid',
        key2: this.props.auth.user_role + '_' + this.props.auth.user.id
      });

      if (this.props.auth.user_role == 'provider') {
        // OneSignal.sendTags({key: "uid", key2: this.props.auth.user_role+'_'+this.props.auth.user.id});

        this.route = false;
        fetch(
          endpoint +
            '?action=princess_my_listing&provider_id=' +
            this.props.auth.user.id
        )
          .then(response => response.json())
          .then(responseJson => {
            // console.log(responseJson);
            if (responseJson.listing) {
              this.route = 'AllOrders'; //Home
            } else {
              this.route = 'ProviderHome'; //Home
            }
          });
          this.route = 'AllOrders'; //Home
      } else {
        this.route = 'Home'; //Home
      }
    } else {
      this.route = 'OuterHome';
      // route = ' ';
    }

    Animated.timing(this.animatedValue, {
      toValue: -150,
      duration: 1500
    }).start();
    this.up();

    this.timer = setInterval(() => {
      if (this.state.progress == 1) {
        clearInterval(this.timer);
        setTimeout(() => {
          StatusBar.setHidden(true, 'none'); // false, slide
          // alert(this.route);
          if (this.route) {
            const toHome = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({routeName: this.route})]
            });
            this.props.navigation.dispatch(toHome);
          }else{
            alert('no route')
          }
        }, 1000);
      } else {
        const random = Math.random() * 0.5;
        let progress = this.state.progress + random;
        if (progress > 1) {
          progress = 1;
        }

        this.setState({progress});
      }
    }, timeFrame);
  }
  changeColor() {
    const {circleColor, counter} = this.state;
    const newCounter = counter < 3 ? counter + 1 : 0;
    const newCircleColor = this.getColor(newCounter);
    this.setState({
      viewBackgroundColor: circleColor,
      counter: newCounter
    });
    this.changeCircleColor(newCircleColor);
  }

  changeCircleColor(newCircleColor) {
    // setTimeout(() => {
    //   this.setState({
    //     circleColor: newCircleColor
    //   });
    // }, TRANSITION_BUFFER + 5);
  }

  getColor(counter) {
    switch (counter) {
      case 0:
        return CIRCLE_COLOR1;
      case 1:
        return CIRCLE_COLOR2;
      case 2:
        return CIRCLE_COLOR3;
      case 3:
        return CIRCLE_COLOR4;
      default:
        return CIRCLE_COLOR4;
    }
  }

  render() {
    // const interpolateColor = this.animatedValue.interpolate({
    //   inputRange: [0, 150],
    //   outputRange: ['rgb(255,255,255)', Colors.primary]
    // });
    // const animatedStyle = {
    //   backgroundColor: interpolateColor
    // };
    const {
      circleColor,
      viewBackgroundColor,
      customTopMargin,
      customLeftMargin
    } = this.state;
    const width = (6 / 10) * Dimensions.get('window').width;
    return (
      <View
        style={[
          globalStyles.containerSplash,
          {backgroundColor: viewBackgroundColor}
        ]}
      >
        <CircleTransition
          ref={circle => {
            this.circleTransition = circle;
          }}
          color={circleColor}
          expand
          customTopMargin={customTopMargin}
          customLeftMargin={customLeftMargin}
          transitionBuffer={TRANSITION_BUFFER}
          duration={ANIMATION_DURATION}
          easing={Easing.linear}
          position={'center'}
        >
          <View style={{height: '100%'}}>
            <Animated.View
              style={[
                styles.logo,
                {transform: [{translateY: this.animatedValue}]}
              ]}
            >
              <Image
                style={[
                  styles.image,
                  {
                    width: width,
                    marginLeft: '20%'
                  }
                ]}
                source={require('../assets/images/logo.png')}
              />
            </Animated.View>
            <ProgressBar
              color="#ea4556"
              style={styles.progress}
              progress={this.state.progress}
              width={scale(320)}
            />
          </View>
        </CircleTransition>
        <View style={{height: '100%'}}>
          <Animated.View
            style={[
              styles.logo,
              {transform: [{translateY: this.animatedValue}]}
            ]}
          >
            <Image
              style={[styles.image, {width: width, marginLeft: '20%'}]}
              source={require('../assets/images/logo.png')}
            />
          </Animated.View>
          <ProgressBar
            color="#ea4556"
            style={styles.progress}
            progress={this.state.progress}
            width={scale(320)}
          />
        </View>

        {/* <View style={styles.textBox1} />
        <View style={styles.textBox1} /> */}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth // use global auth state, to check if device registration is done or not
  };
};

export default connect(mapStateToProps)(SplashScreen);
