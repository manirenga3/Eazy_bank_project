import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';

import * as fromApp from '../../store/app.state';
import * as AuthActions from '../../store/auth-store/auth.actions';

import { User } from 'src/app/model/user.model';
import { Account } from 'src/app/model/account.model';

import { environment } from '../../../environments/environment';
import { AppConstants } from '../../constants/app.constants';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, OnDestroy {
  user: User;
  account: Account = null;
  storeSub$: Subscription;
  httpSub$: Subscription;

  constructor(
    private store: Store<fromApp.AppState>,
    private http: HttpClient,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.storeSub$ = this.store
      .select('auth')
      .subscribe((authData) => (this.user = authData.userData));
    if (this.user) {
      this.httpSub$ = this.http
        .post(
          `${environment.rootUrl}${AppConstants.ACCOUNT_API_URL}`,
          this.user,
          { withCredentials: true }
        )
        .pipe(
          this.toast.observe({
            success: 'Account details loaded successfully',
            loading: 'Loading account details...',
            error: 'There was an error',
          })
        )
        .subscribe({
          next: (res) => {
            this.account = res;
          },
          error: (error) => {
            if (error.error.message) {
              this.store.dispatch(
                AuthActions.loginFail({
                  error: `${error.error.message} !`,
                })
              );
            }
            this.store.dispatch(
              AuthActions.loginFail({ error: 'An Error Occured !' })
            );
          },
        });
    }
  }

  ngOnDestroy(): void {
    if (this.storeSub$) {
      this.storeSub$.unsubscribe();
    }
    if (this.httpSub$) {
      this.httpSub$.unsubscribe();
    }
  }
}
