const initialState = {
  user: null,
  user_role: null
};

export default function auth(state = initialState, action) {
  if (!state.hydrated) {
    state = Object.assign({}, initialState, state, {hydrated: true});
  }
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return Object.assign({}, state, {
        user: action.user,
        user_role: action.user_role
      });
    case 'LOGOUT_SUCCESS':
      return Object.assign({}, state, initialState);
    default:
      return state;
  }
}
