import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';

import * as fromApp from '../../store/app.state';
import * as AuthActions from '../../store/auth-store/auth.actions';

import { User } from 'src/app/model/user.model';

import { environment } from '../../../environments/environment';
import { AppConstants } from '../../constants/app.constants';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent implements OnInit, OnDestroy {
  user: User = null;
  cards: any = [];
  currOutstandingAmt: number = 0;
  storeSub$: Subscription;
  httpSub$: Subscription;

  constructor(
    private http: HttpClient,
    private toast: HotToastService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.storeSub$ = this.store
      .select('auth')
      .subscribe((authData) => (this.user = authData.userData));
    if (this.user) {
      this.httpSub$ = this.http
        .post(
          `${environment.rootUrl}${AppConstants.CARDS_API_URL}`,
          this.user,
          { withCredentials: true }
        )
        .pipe(
          this.toast.observe({
            success: 'Cards details loaded successfully',
            loading: 'Loading cards details...',
            error: 'There was an error',
          })
        )
        .subscribe({
          next: (res) => {
            this.cards = res;
            this.cards.forEach((card) => {
              this.currOutstandingAmt += card.availableAmount;
            });
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
