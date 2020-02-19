import React from 'react';
import {connect} from 'react-redux';
import SideMenu from 'react-native-side-menu';
import {Header} from 'react-native-elements';
import {globalStyles, Colors, getLanguageStrings} from '../utils/Theme';
import constants from '../utils/Constants.js';
import {NavigationActions} from 'react-navigation';
// import ScalingButton from '../modules/ScalingButton';
import WalletCard from '../modules/WalletCard';
import SlideMenu from './SlideMenu';
import SlideMenu2 from './SlideMenu2';

import TopRightArea from '../modules/TopRightArea';
import {Text, View, ScrollView, Dimensions} from 'react-native';
const endpoint = constants.BASE_URL;
const width = Dimensions.get('window').width;

class ClientWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      wallet_data: [],
      credit_balance: '-'
    };
    this.lang = getLanguageStrings(this.props.language.current);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.language.current != newProps.language.current) {
      this.lang = getLanguageStrings(newProps.language.current);
    }
  }

  goBack() {
    const toHome = NavigationActions.back();
    this.props.navigation.dispatch(toHome);
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

  componentDidMount() {
    this.getRows();
    this.getCreditBalance();
  }

  getCreditBalance() {
    // if(!id) return;
    fetch(
      endpoint +
        '?action=princess_get_credit_balance&uid=' +
        this.props.auth.user.id +
        '&role=' +
        this.props.auth.user_role
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({credit_balance: responseJson.credit_balance});
      })
      .catch(error => {});
  }

  getRows() {
    // alert('?action=princess_user_wallet_tx&user_id='+this.props.auth.user.id+"&role="+this.props.auth.user_role)

    fetch(
      endpoint +
        '?action=princess_user_wallet_tx&user_id=' +
        this.props.auth.user.id +
        '&role=' +
        this.props.auth.user_role
    )
      .then(response => response.json())
      .then(responseJson => {
        // alert(JSON.stringify(responseJson))
        if (responseJson.ok && responseJson.rows) {
          const l = responseJson.rows;
          this.setState({
            wallet_data: l
          });
        } else {
          // alert(responseJson.error);
        }
      })
      .catch(error => {
        alert('unable to fetch rows');
      });
  }

  renderSaloon(obj, i) {
    return <WalletCard obj={obj} key={i} />;
  }

  goToList() {
    const navigateAction = NavigationActions.navigate({
      routeName: 'UnreadOrders',
      params: {},
      action: NavigationActions.navigate({routeName: 'UnreadOrders'})
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    this.menuObj = this.state.isOpen ? (
      this.props.auth.user_role == 'client' ? (
        <SlideMenu2
          navigation={this.props.navigation}
          onItemSelected={this.onMenuItemSelected.bind(this)}
        />
      ) : (
        <SlideMenu
          navigation={this.props.navigation}
          onItemSelected={this.onMenuItemSelected.bind(this)}
        />
      )
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
            // leftComponent={{
            //   icon: 'menu',
            //   color: '#fff',
            //   onPress: () => {
            //     this.toggleSideMenu();
            //   }
            // }}
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
                <View
                  style={[
                    globalStyles.saloon_card,
                    {backgroundColor: Colors.primary, padding: 20}
                  ]}
                >
                  <Text
                    style={{
                      fontWeight: '200',
                      fontSize: 50,
                      color: '#fff',
                      textAlign: 'center'
                    }}
                  >
                    {this.state.credit_balance}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '200',
                      fontSize: 20,
                      color: '#fff',
                      textAlign: 'center'
                    }}
                  >
                    {this.lang.CURRENT_WALLET_BALANCE}
                  </Text>
                </View>
                {this.state.wallet_data.map((obj, i) => {
                  return this.renderSaloon(obj, i);
                })}
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

export default connect(mapStateToProps)(ClientWallet);
