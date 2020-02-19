import {combineReducers} from 'redux';
import messages from './messages';
import auth from './auth';
import language from './language';

export default combineReducers({
  messages,
  auth,
  language
});
