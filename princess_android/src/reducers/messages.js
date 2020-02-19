export default function messages(state = {error: [], success: []}, action) {
  switch (action.type) {
    case 'ACTION_FAILURE':
      return {
        error: action.messages
      };
    case 'ACTION_SUCCESS':
      return {
        success: action.messages
      };
    default:
      return state;
  }
}
