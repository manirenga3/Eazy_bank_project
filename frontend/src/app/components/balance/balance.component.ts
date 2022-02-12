import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../../store/app.state';
import * as AuthActions from '../../store/auth-store/auth.actions';

import { User } from 'src/app/model/user.model';

import { environment } from '../../../environments/environment';
import { AppConstants } from '../../constants/app.constants';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
})
export class BalanceComponent implements OnInit, OnDestroy {
  user: User;
  transactions: any = null;
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
          `${environment.rootUrl}${AppConstants.BALANCE_API_URL}`,
          this.user,
          { withCredentials: true }
        )
        .pipe(
          this.toast.observe({
            success: 'Balance loaded successfully',
            loading: 'Loading balance...',
            error: 'There was an error',
          })
        )
        .subscribe({
          next: (res) => {
            this.transactions = res;
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
