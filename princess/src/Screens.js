import {createStackNavigator, createAppContainer} from 'react-navigation';
import SplashScreen from './screens/Splash';
import OuterHome from './screens/OuterHome';
import Home from './screens/Home';
import Saloon from './screens/Saloon';
import ProviderHome from './screens/ProviderHome';
import BookDate from './screens/BookDate';
import MyOrdersNew from './screens/order_screens/MyOrdersNew';
import MyOrdersConfirmed from './screens/order_screens/MyOrdersConfirmed';
import MyOrdersPendingPayment from './screens/order_screens/MyOrdersPendingPayment';
import MyOrders from './screens/order_screens/MyOrders';
import PaymentModeCard from './screens/order_screens/PaymentModeCard';
import Chat from './screens/chat';
import BookingSuccess from './screens/BookingSuccess';
import paymentView from './screens/paymentView';
import AllOrders from './screens/provider/AllOrders';
import ConfirmedOrders from './screens/provider/ConfirmedOrders';
import PaymentPendingOrders from './screens/provider/PaymentPendingOrders';
import NewOrders from './screens/provider/NewOrders';
import Terms from './screens/provider/Terms';
import ProverGallery from './screens/provider/ProverGallery';
import Schedule from './screens/provider/Schedule';
import Payouts from './screens/provider/Payouts';
import SingleImg from './screens/SingleImg';
import Profile from './screens/Profile';
import ProviderProfile from './screens/provider/ProviderProfile';
import ClientWallet from './screens/ClientWallet';

import ContactPage from './screens/pages/ContactPage';
import TermsPage from './screens/pages/TermsPage';
// import MyPayouts from './screens/MyPayouts'

import UnreadOrders from './screens/pages/UnreadOrders';

const Screens = createStackNavigator(
  {
    SplashScreen: {
      screen: SplashScreen,
    },
    OuterHome: {
      screen: OuterHome,
    },

    Home: {
      screen: Home,
    },

    Saloon: {
      screen: Saloon,
    },

    ProviderHome: {
      screen: ProviderHome,
    },
    BookDate: {
      screen: BookDate,
    },
    MyOrders: {
      screen: MyOrders,
    },
    PaymentModeCard: {
      screen: PaymentModeCard,
    },
    BookingSuccess: {
      screen: BookingSuccess,
    },
    paymentView: {
      screen: paymentView,
    },
    Chat: {
      screen: Chat,
    },
    AllOrders: {
      screen: AllOrders,
    },
    NewOrders: {
      screen: NewOrders,
    },
    ConfirmedOrders: {
      screen: ConfirmedOrders,
    },
    PaymentPendingOrders: {
      screen: PaymentPendingOrders,
    },
    Terms: {
      screen: Terms,
    },
    ProverGallery: {
      screen: ProverGallery,
    },
    Schedule: {
      screen: Schedule,
    },
    Payouts: {
      screen: Payouts,
    },
    SingleImg: {
      screen: SingleImg,
    },
    Profile: {
      screen: Profile,
    },
    ProviderProfile: {
      screen: ProviderProfile,
    },
    ClientWallet: {
      screen: ClientWallet,
    },
    UnreadOrders: {
      screen: UnreadOrders,
    },
    MyOrdersNew: {screen: MyOrdersNew},
    MyOrdersConfirmed: {screen: MyOrdersConfirmed},
    MyOrdersPendingPayment: {screen: MyOrdersPendingPayment},
    ContactPage: {screen: ContactPage},
    TermsPage: {screen: TermsPage},
  },
  {
    headerMode: 'none',
    initialScreen: 'SplashScreen',
  },
);

export default createAppContainer(Screens);
