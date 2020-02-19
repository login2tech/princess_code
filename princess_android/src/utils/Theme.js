import {scale} from './ThemeHelper';
import {StyleSheet, Dimensions, Platform} from 'react-native';
const {width, height} = Dimensions.get('window');

const getLanguageStrings = function(lang) {
  let languages;
  if (lang == 'ar') {
    languages = require('../languages/ar.json');
  } else {
    languages = require('../languages/en.json');
  }

  return languages;
};
const Colors = {
  primary: '#bb2553',

  button: '#000000',
  buttonSec: '#222222',
  primaryDark: '#eea5a9',
  secondary: '#000000',
  pinkBg: '#f3f3f3',
  pinkBg2:'#DD92A9',
  white: '#ffffff',

  success: '#3bd555',
  info: '#19bfe5',
  warning: '#feb401',
  danger: '#ed1c4d',
  disabled: '#cacaca',

  twitter: '#41abe1',
  google: '#e94335',
  facebook: '#3b5998'
};

const Paddings = {
  small: 5,
  big: 20,
  medium: 10
};

const FontsFamily = {
  light: 'Gotham-Medium',
  regular: 'Gotham-Medium',
  bold: 'Gotham-Medium'
};

const FontBaseValue = scale(18);

const Fonts = {
  sizes: {
    h0: scale(32),
    h1: scale(26),
    h2: scale(24),
    h3: scale(20),
    h4: scale(18),
    h5: scale(16),
    h6: scale(15),
    p1: scale(16),
    p2: scale(15),
    p3: scale(15),
    p4: scale(13),
    s1: scale(15),
    s2: scale(13),
    s3: scale(13),
    s4: scale(12),
    s5: scale(12),
    s6: scale(13),
    s7: scale(10),
    base: FontBaseValue,
    small: FontBaseValue * 0.8,
    medium: FontBaseValue,
    large: FontBaseValue * 1.2,
    xlarge: FontBaseValue / 0.75,
    xxlarge: FontBaseValue * 1.6
  },

  lineHeights: {
    medium: 18,
    big: 24
  },

  family: FontsFamily
};

const globalStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    flex: 1,
    height: height,
    display: 'flex'
  },
  containerSplash: {
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    flex: 1,
    height: height,
    display: 'flex'
  },
  emptySpace: {
    paddingTop: 50,
    paddingBottom: 50
  },
  text: {
    marginBottom: 5,
    color: Colors.primary,
    ...Platform.select({
      ios: {fontFamily: 'Arial'},
      android: {fontFamily: 'Gotham-Medium'}
    })
  },

  innerContainer: {
    justifyContent: 'flex-start',
    flex: 1,
    margin: Paddings.big,
    backgroundColor: Colors.white,
    width: width - Paddings.big * 2
    // zIndex:1
  },

  innerContainerPadded: {
    padding: Paddings.big
  },

  input: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    // backgroundColor : 'transparent',
    color: '#fff',
    alignSelf: 'center',
    paddingLeft: Paddings.big,
    ...Platform.select({
      ios: {fontFamily: 'Arial'},
      android: {fontFamily: 'Gotham-Medium'}
    })
  },
  inputWithBox: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    borderColor: '#d0bf00',
    borderWidth: 1,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    paddingLeft: Paddings.big,
    ...Platform.select({
      ios: {fontFamily: 'Arial'},
      android: {fontFamily: 'Gotham-Medium'}
    })
  },

  inputWithBoxMultiline: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    borderColor: '#d0bf00',
    borderWidth: 1,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    paddingLeft: Paddings.big,
    ...Platform.select({
      ios: {fontFamily: 'Arial'},
      android: {fontFamily: 'Gotham-Medium'}
    })
  },

  inputWrap: {
    flex: 1,
    marginBottom: Paddings.big,
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    flexDirection: 'row',
    ...Platform.select({
      ios: {fontFamily: 'Arial'},
      android: {fontFamily: 'Gotham-Medium'}
    })
  },

  inputWrapNoBorder: {
    flex: 1,
    marginBottom: Paddings.big,
    flexDirection: 'row',
    width: '100%',
    ...Platform.select({
      ios: {fontFamily: 'Arial'},
      android: {fontFamily: 'Gotham-Medium'}
    })
  },

  Button: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    margin: 0
  },

  ButtonTab: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    margin: 0,
    borderWidth: 1,
    borderColor: Colors.primary
  },

  ButtonViewDets: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    margin: 0,
    padding: Paddings.small,
    fontFamily: 'Gotham-Medium'
  },

  saloon_card: {
    width: '100%',
    marginBottom: 10,
    shadowRadius: 2,
    borderRadius: 5,
    backgroundColor: Colors.pinkBg
    // borderBottomWidth: 5,
    // borderBottomColor: Colors.primary,
    // shadowOffset: {width: 10, height: 10},
    // shadowColor: 'black',
    // shadowOpacity: 1.0,
    // elevation: 1
  },

  header: {
    flexDirection: 'row',
    paddingTop: Paddings.big,
    paddingBottom: Paddings.medium,
    paddingLeft: 10,
    width: width,
    justifyContent: 'center',
    backgroundColor: Colors.primary
  },

  headings: {
    fontSize: Fonts.sizes.h3,
    color: Colors.primary,
    paddingBottom: Paddings.medium,
    ...Platform.select({
      ios: {fontFamily: 'Arial'},
      android: {fontFamily: 'Gotham-Medium'}
    })
  },

  headerTitle: {
    color: Colors.white,
    fontSize: Fonts.sizes.h2,
    lineHeight: Fonts.sizes.big,
    alignSelf: 'center',
    ...Platform.select({
      ios: {fontFamily: 'Arial'},
      android: {fontFamily: 'Gotham-Medium'}
    })
  },

  row: {
    flexDirection: 'row',
    display: 'flex'
  },
  col: {
    flexDirection: 'column',
    flex: 1
  },
  col10: {
    flexDirection: 'column',
    flex: 0.2
  },
  col20: {
    flexDirection: 'column',
    flex: 0.4
  },
  col30: {
    flexDirection: 'column',
    flex: 0.6
  },
  col40: {
    flexDirection: 'column',
    flex: 0.8
  },
  col60: {
    flexDirection: 'column',
    flex: 1.2
  },
  col70: {
    flexDirection: 'column',
    flex: 1.4
  },
  col80: {
    flexDirection: 'column',
    flex: 1.6
  },
  col90: {
    flexDirection: 'column',
    flex: 1.8
  },

  errorBox: {
    borderColor: Colors.danger,
    backgroundColor: 'rgba(255,0,0,0.5)',
    borderWidth: 2,
    padding: Paddings.medium,
    marginBottom: Paddings.medium,
    marginTop: Paddings.medium,
    ...Platform.select({
      ios: {fontFamily: 'Arial'},
      android: {fontFamily: 'Gotham-Medium'}
    })
  },

  successBox: {
    borderColor: Colors.success,
    backgroundColor: 'rgba(34,139,34,0.5)',
    borderWidth: 2,
    padding: Paddings.medium,
    marginBottom: Paddings.medium,
    marginTop: Paddings.medium,
    ...Platform.select({
      ios: {fontFamily: 'Arial'},
      android: {fontFamily: 'Gotham-Medium'}
    })
  },

  saloon_card_img_wrap: {
    position: 'relative'
  },
  saloon_card_gallery_wrap: {
    position: 'relative',
    flexDirection: 'row'
  },
  saloon_card_img: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10
  },
  salooon_card_title: {
    fontSize: Fonts.sizes.h5,
    fontWeight:'normal',
    color: Colors.primary,
    ...Platform.select({
      ios: {fontFamily: 'Arial'},
      android: {fontFamily: 'Gotham-Light'}
    })
  },
  saloon_card_det_wrap: {
    padding: Paddings.medium
  },

  saloon_card_red: {
    borderTopColor: Colors.danger
  },

  saloon_card_green: {
    borderTopColor: Colors.success
  },

  saloon_card_yellow: {
    borderTopColor: Colors.warning
  },
  saloon_green: {
    backgroundColor: Colors.success,
    position: 'absolute',
    padding: Paddings.small,
    color: '#fff',
    bottom: 10,
    left: 10,
    fontFamily: 'Gotham-Medium'
  },
  saloon_yellow: {
    backgroundColor: Colors.warning,
    position: 'absolute',
    padding: Paddings.small,
    color: '#fff',
    bottom: 10,
    left: 10,
    fontFamily: 'Gotham-Medium'
  },
  saloon_red: {
    backgroundColor: Colors.danger,
    position: 'absolute',
    padding: Paddings.small,
    color: '#fff',
    bottom: 10,
    left: 10,
    fontFamily: 'Gotham-Medium'
  },
  filter_box: {
    position: 'absolute',
    bottom: 0,
    width: width,
    left: 0,
    flexDirection: 'row',
    display: 'flex',
    margin: 0
  },
  filter_box_colapsable: {
    position: 'absolute',
    bottom: 40,
    width: width,
    left: 0,
    flexDirection: 'row',
    display: 'flex',
    margin: 0
  },
  cardIcon: {
    // color    : Colors.primary,
    fontSize: Fonts.sizes.p,
    padding: 0,
    margin: 0
  },
  singleRev: {
    paddingBottom: Paddings.big
  },

  fontHas: {
    ...Platform.select({
      ios: {fontFamily: 'Arial'},
      android: {fontFamily: 'Gotham-Light'}
    })
  }
});

export {globalStyles, Colors, Paddings, Fonts, getLanguageStrings};
