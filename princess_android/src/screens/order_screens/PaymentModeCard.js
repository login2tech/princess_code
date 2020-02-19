import React from 'react';
import {connect} from 'react-redux';
import SideMenu from 'react-native-side-menu';
import {Header, Divider, Button} from 'react-native-elements';
import {
  globalStyles,
  Colors,
  Paddings,
  getLanguageStrings
} from '../../utils/Theme';
import constants from '../../utils/Constants.js';
import {NavigationActions} from 'react-navigation';
// import ScalingButton from '../../modules/ScalingButton';
// import OrderBox from '../../modules/OrderBox';
import SlideMenu2 from '..//SlideMenu2';

import TopRightArea from '../../modules/TopRightArea';
// import YesNoSwitch from '../../modules/YesNoSwitch';
// import Divider from '../../modules/Divider';
import {
  Text,
  View,
  DeviceEventEmitter,
  Dimensions,
  ScrollView
} from 'react-native';
const width = Dimensions.get('window').width;
const endpoint = constants.BASE_URL;
import {CreditCardInput} from 'react-native-credit-card-input';

import OppwaCore from 'react-native-oppwa';

// const Oppwa = require('r/eact-native-oppwa');

class PaymentModeCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payment_type: 'partial'
      // admin_commission: 30
      // isOpen: false,
      // filter: '',
      // sort: '',
      // order_data: []
    };
    this.lang = getLanguageStrings(this.props.language.current);
  }
  goBack() {
    const toHome = NavigationActions.back();
    this.props.navigation.dispatch(toHome);
  }
  componentWillReceiveProps(newProps) {
    if (this.props.language.current != newProps.language.current) {
      this.lang = getLanguageStrings(newProps.language.current);
    }
  }

  //
  _onChange(form) {
    // console.log(form)
    if (form.valid) {
      // alert();
      if (form.values.type && form.values.type != 'unionpay') {
        this.setState({
          form_valid: true,
          form_data: form.values
        });
      } else {
        this.setState({
          form_valid: false,
          form_data: {}
        });
      }
    } else {
      this.setState({
        form_valid: false,
        form_data: {},
        form_error: JSON.stringify(form.status)
      });
    }
    // console.log(form);
  }

  onSideMenuChange(v) {
    this.setState({isOpen: v});
  }

  toggleSideMenu() {
    this.setState({isOpen: !this.state.isOpen});
  }

  goAccount() {
    // console.log(this.props.auth)
    if (this.props.auth.user.id) {
      return;
    }
    const toHome = NavigationActions.navigate({
      routeName: 'OuterHome',
      params: {
        // saloon_id : id,
        isInner: true
      }
    });
    this.props.navigation.dispatch(toHome);
  }

  doPayment() {
    this.setState({
      paying: true
    });
    const {state} = this.props.navigation;

    const obj = state.params.obj;
    let frm_data;
    let brnd = this.state.form_data.type;
    if (this.total_payable > 0) {
      if (
        this.state.form_data.type.toLowerCase() == 'visa' ||
        this.state.form_data.type.toLowerCase() == 'master-card'
      ) {
        //
      } else {
        alert('Only master and visa cards are supported.');
        this.setState({
          paying: false
        });
        return;
      }

      if (brnd == 'master-card') {
        brnd = 'MASTER';
      } else if (brnd == 'visa' || brnd == 'VISA') {
        brnd = 'VISA';
      }

      let user_name = this.props.auth.user.name;
      user_name = user_name.split(' ');

      const first_name = user_name[0];
      user_name.shift();
      const last_name = user_name.join(' ');
      frm_data = JSON.parse(JSON.stringify(this.state.form_data));
      frm_data.first_name = first_name;
      frm_data.last_name = last_name;
      frm_data.number = this.state.form_data.number;
      frm_data.cvc = this.state.form_data.cvc;
      frm_data.expiry = this.state.form_data.expiry;

      frm_data.number = '';
      frm_data.cvc = '';
      frm_data.expiry = '';

      frm_data.email = this.props.auth.user.email;
      frm_data.streetAddress = this.state.form_data.address;
      frm_data.billingCity = this.state.form_data.city;
      frm_data.billingState = this.state.form_data.state;
      frm_data.billingCountryCode = this.state.form_data.country_code;
      //
    } else {
      frm_data = {};
    }
    this.doPaymentStep2(
      obj.p_id,
      frm_data,
      this.state.payment_type,
      this.state.credit_balance,
      brnd
    );
  }

  doPaymentStep2(id, form_data, payment_type, credit_balance, brnd) {
    fetch(endpoint + '?action=getCheckoutId', {
      method: 'post',
      headers: {'Content-Type': 'application/json', accept: 'application/json'},
      body: JSON.stringify({
        order_id: id,
        frm_data: form_data,
        payment_type,
        credit_balance
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.full == 'yes') {
          this.setState({
            paying: false
          });
          alert('Payment Successfull');
          this.goBack();
        } else if (responseJson.error) {
          alert(responseJson.error);
        } else {
          const payment_id = responseJson.res.id;
          this.doPaymentStep3(payment_id, brnd);
        }
      })
      .catch(error => {
        this.setState({
          paying: false
        });
        alert(error);
      });
  }

  doPaymentStep3(payment_id, brnd) {
    const {state} = this.props.navigation;

    // const obj = state.params.obj;

    OppwaCore.transactionPayment({
      checkoutID: payment_id,
      holderName: this.state.form_data.name,
      cardNumber: this.state.form_data.number,
      paymentBrand: brnd,
      expiryMonth: this.state.form_data.expiry.split('/')[0],
      expiryYear: '20' + this.state.form_data.expiry.split('/')[1],
      cvv: this.state.form_data.cvc
    });
    return;
  }

  componentDidMount() {
    this.getCreditBalance();

    DeviceEventEmitter.addListener('transactionStatus', data => {
      // alert(JSON.stringify(data));
      if (data.status == 'transactionFailed') {
        // alert(data.paymentError + ' : ' + data.paymentDetails);
        this.setState({
          paying: false,
          loading: false
        });
      } else {
        this.setState({loading: false, paying: false}, () => {
          // alert(data.RedirectUrl)
          const toHome = NavigationActions.navigate({
            routeName: 'paymentView',
            params: {
              links: [data.RedirectUrl]
            }
          });
          this.props.navigation.dispatch(toHome);
        });
      }
      // alert(JSON.stringify(data));
    });
  }

  getCreditBalance() {
    // if(!id) return;
    fetch(
      endpoint +
        '?action=princess_get_credit_balance&uid=' +
        this.props.auth.user.id
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          credit_balance: parseFloat(responseJson.credit_balance)
          // admin_commission: parseFloat(responseJson.admin_commission)
        });
      })
      .catch(error => {});
  }

  goToList() {
    const navigateAction = NavigationActions.navigate({
      routeName: 'UnreadOrders',
      params: {},
      action: NavigationActions.navigate({routeName: 'UnreadOrders'})
    });
    this.props.navigation.dispatch(navigateAction);
  }

  renderCardInput() {
    return (
      <View>
        <View style={[globalStyles.saloon_card, {padding: Paddings.big}]}>
          {this.total_payable > 0 ? (
            <View style={{flex: 1, marginBottom: 30}}>
              <CreditCardInput
                onChange={this._onChange.bind(this)}
                requiresName
                verticalInput
              />
            </View>
          ) : (
            false
          )}

          <View style={{flex: 1}}>
            <Button
              containerViewStyle={{
                width: '100%',
                flex: 1,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 10
              }}
              backgroundColor={Colors.primary}
              onPress={() => {
                this.doPayment();
              }}
              loading={this.state.loading || this.state.paying}
              disabled={
                this.state.loading ||
                (!this.state.form_valid && this.total_payable > 0)
              }
              rounded
              title={this.lang.PROCEED_PAYMENT}
              buttonStyle={globalStyles.Button}
            />
          </View>
        </View>
      </View>
    );
  }

  renderSaloon(obj) {
    if (!obj) {
      return false;
    }

    if (this.state.payment_type == 'partial') {
      this.total_payable = parseFloat((obj.totals - obj.via_cash).toFixed(2));
      this.total_online = parseFloat((obj.totals - obj.via_cash).toFixed(2));
      this.via_cash = obj.via_cash;
    } else {
      this.total_payable = obj.totals;
      this.total_online = obj.total_online;
      this.via_cash = 0;
    }
    // alert(this.state.credit_balance);
    if (this.state.credit_balance > 0) {
      // alert('HERE');
      if (this.state.credit_balance >= this.total_payable) {
        // alert('sd ' + this.total_payable + ' ' + this.state.credit_balance);
        this.credit_balance = this.total_payable;
        this.total_payable = 0;
      } else {
        this.credit_balance = this.state.credit_balance;
        this.total_payable = parseFloat(
          (this.total_payable - this.state.credit_balance).toFixed(2)
        );
        // alert(""+this.credit_balance+" : "+this.total_payable);
      }
    } else {
      this.credit_balance = 0;
    }

    return (
      <View style={{flex: 1}}>
        <View
          style={[globalStyles.saloon_card, {padding: Paddings.big}]}
          key={obj.id}
        >
          <View
            style={[
              globalStyles.row,
              {
                padding: 5,
                flexDirection:
                  this.props.language.current == 'en' ? 'row' : 'row-reverse'
              }
            ]}
          >
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
                  color: '#000'
                }}
              >
                SAR {obj.totals}
              </Text>
            </View>
          </View>

          <View
            style={[
              globalStyles.row,
              {
                padding: 5,
                flexDirection:
                  this.props.language.current == 'en' ? 'row' : 'row-reverse'
              }
            ]}
          >
            <View style={globalStyles.col}>
              <Text>{this.lang.PAY_ONLINE_NOW}</Text>
            </View>
            <View style={globalStyles.col2}>
              <Text> : </Text>
            </View>
            <View style={globalStyles.col}>
              <Text
                style={{
                  textAlign:
                    this.props.language.current == 'en' ? 'left' : 'right',
                  color: '#000'
                }}
              >
                SAR {this.total_online}
              </Text>
            </View>
          </View>

          <Divider style={{backgroundColor: Colors.primary}} />
          {this.credit_balance > 0 ? (
            <View
              style={[
                globalStyles.row,
                {
                  padding: 5,
                  flexDirection:
                    this.props.language.current == 'en' ? 'row' : 'row-reverse'
                }
              ]}
            >
              <View style={globalStyles.col}>
                <Text>{this.lang.CREDIT_POINTS}</Text>
              </View>
              <View style={globalStyles.col2}>
                <Text> : </Text>
              </View>
              <View style={globalStyles.col}>
                <Text
                  style={{
                    textAlign:
                      this.props.language.current == 'en' ? 'left' : 'right',
                    color: '#000'
                  }}
                >
                  {this.credit_balance}
                </Text>
              </View>
            </View>
          ) : (
            false
          )}
          <Divider style={{backgroundColor: Colors.primary}} />
          {this.credit_balance > 0 || this.state.payment_type == 'partial' ? (
            <View
              style={[
                globalStyles.row,
                {
                  padding: 5,
                  flexDirection:
                    this.props.language.current == 'en' ? 'row' : 'row-reverse'
                }
              ]}
            >
              <View style={globalStyles.col}>
                <Text>{this.lang.TOTAL_TO_PAY}</Text>
              </View>
              <View style={globalStyles.col2}>
                <Text> : </Text>
              </View>
              <View style={globalStyles.col}>
                <Text
                  style={{
                    textAlign:
                      this.props.language.current == 'en' ? 'left' : 'right',
                    color: '#000'
                  }}
                >
                  SAR {this.total_payable}
                </Text>
              </View>
            </View>
          ) : (
            false
          )}
          <Divider style={{backgroundColor: Colors.primary}} />
          {this.state.payment_type == 'partial' ? (
            <View
              style={[
                globalStyles.row,
                {
                  padding: 5,
                  flexDirection:
                    this.props.language.current == 'en' ? 'row' : 'row-reverse'
                }
              ]}
            >
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
                    color: '#000'
                  }}
                >
                  SAR {this.via_cash}
                </Text>
              </View>
            </View>
          ) : (
            false
          )}
        </View>

        {this.renderCardInput()}
      </View>
    );
  }

  render() {
    const {state} = this.props.navigation;

    const obj = state.params.obj;

    // alert(obj);

    this.menuObj = this.state.isOpen ? (
      <SlideMenu2
        navigation={this.props.navigation}
        onItemSelected={this.onMenuItemSelected.bind(this)}
      />
    ) : (
      false
    );

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

          <View>
            <ScrollView>
              <Text style={{textAlign: 'center'}}>{this.lang.START_CHAT}</Text>
              <View style={globalStyles.innerContainer}>
                {this.renderSaloon(obj)}
                <View style={globalStyles.emptySpace} />
              </View>
            </ScrollView>
          </View>
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

export default connect(mapStateToProps)(PaymentModeCard);
