import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';

import * as AuthActions from './auth.actions';

import { environment } from '../../../environments/environment';
import { AppConstants } from '../../constants/app.constants';

interface AuthResponse {
  id?: number;
  name?: string;
  mobileNumber?: string;
  email?: string;
  role?: string;
  createDt?: Date;
  authorities?: {
    id: string;
    name: string;
  }[];
}

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private toast: HotToastService,
    private router: Router
  ) {}

  loginStart = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap((action) => {
        let header = `Basic ${btoa(`${action.email}:${action.password}`)}`;
        return this.http
          .get<AuthResponse>(
            `${environment.rootUrl}${AppConstants.LOGIN_API_URL}`,
            {
              observe: 'response',
              withCredentials: true,
              headers: new HttpHeaders({ Authorization: header }),
            }
          )
          .pipe(
            this.toast.observe({
              success: 'Logged in successfully',
              loading: 'Logging in...',
              error: 'There was an error',
            }),
            map((res) => {
              return AuthActions.loginSuccess({
                user: {
                  id: res.body.id,
                  name: res.body.name,
                  mobileNumber: res.body.mobileNumber,
                  email: res.body.email,
                  role: res.body.role,
                  createDt: new Date(res.body.createDt),
                  authorities: res.body.authorities,
                },
                authorization: res.headers.get('Authorization'),
              });
            }),
            catchError((err) => {
              if (err.error.message) {
                return of(
                  AuthActions.loginFail({
                    error: `${err.error.message} !`,
                  })
                );
              }
              return of(AuthActions.loginFail({ error: 'An Error Occured !' }));
            })
          );
      })
    );
  });

  loginSuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.router.navigate(['/dashboard']);
        })
      );
    },
    { dispatch: false }
  );
}
