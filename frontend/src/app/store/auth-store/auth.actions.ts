import { createAction, props } from '@ngrx/store';

export const loginStart = createAction(
  '[AUTH] Login Start',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[AUTH] Login Success',
  props<{
    user: {
      id: number;
      name: string;
      mobileNumber: string;
      email: string;
      role: string;
      createDt: Date;
      authorities: {
        id: string;
        name: string;
      }[];
    };
    authorization: string;
  }>()
);

export const loginFail = createAction(
  '[AUTH] Login Fail',
  props<{ error: string }>()
);

export const clearError = createAction('[AUTH] Clear Error');

export const logout = createAction('[AUTH] Logout');
