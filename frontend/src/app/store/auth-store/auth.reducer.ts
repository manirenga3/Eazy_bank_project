import { createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';

import { User } from 'src/app/model/user.model';

export interface State {
  userData: User;
  authorization: string;
  error: string;
  authStatus: boolean;
}

const initialState: State = {
  userData: null,
  authorization: null,
  error: null,
  authStatus: false,
};

export const authReducer = createReducer(
  // Initial state
  initialState,

  // On login success
  on(AuthActions.loginSuccess, (state, { user, authorization }) => {
    let newUserData = {
      ...state.userData,
      id: user.id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      email: user.email,
      role: user.role,
      createDt: user.createDt,
      authorities: [...user.authorities],
    };
    return {
      ...state,
      userData: newUserData,
      authorization: authorization,
      authStatus: true,
    };
  }),

  // On login fail
  on(AuthActions.loginFail, (state, { error }) => ({
    ...state,
    error: error,
  })),

  // On clear error
  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  // On logout
  on(AuthActions.logout, (state) => ({
    ...state,
    userData: null,
    authorization: null,
    error: null,
    authStatus: false,
  }))
);
