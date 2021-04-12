import type { Action } from 'redux';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

let cloneObject = (obj: object) => {
  return JSON.parse(JSON.stringify(obj));
};

let newState = { user: { loggedIn: false } };

const initialState = {
  user: {
    loggedIn: false,
  },
};

export const userReducers = (state: object = initialState, action: Action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      newState = cloneObject(state);
      newState.user.loggedIn = true;
      return newState;
    }
    default:
      return state;
  }
};
