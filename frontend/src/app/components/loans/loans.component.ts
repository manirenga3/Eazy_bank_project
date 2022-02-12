import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HotToastService } from '@ngneat/hot-toast';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../../store/app.state';
import * as AuthActions from '../../store/auth-store/auth.actions';

import { User } from 'src/app/model/user.model';

import { environment } from '../../../environments/environment';
import { AppConstants } from '../../constants/app.constants';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css'],
})
export class LoansComponent implements OnInit, OnDestroy {
  user: User = null;
  loans: any = null;
  currOutstandingBalance: number = 0;
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
          `${environment.rootUrl}${AppConstants.LOANS_API_URL}`,
          this.user,
          { withCredentials: true }
        )
        .pipe(
          this.toast.observe({
            success: 'Loan details loaded successfully',
            loading: 'Loading loan details...',
            error: 'There was an error',
          })
        )
        .subscribe({
          next: (res) => {
            this.loans = res;
            this.loans.forEach(
              (loan) => (this.currOutstandingBalance += loan.outstandingAmount)
            );
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
