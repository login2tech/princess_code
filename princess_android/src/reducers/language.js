export default function language(state = {current: 'en'}, action) {
  switch (action.type) {
    case 'CHANGE_LANGUAGE':
      return {
        current: action.new
      };
    default:
      return state;
  }
}
