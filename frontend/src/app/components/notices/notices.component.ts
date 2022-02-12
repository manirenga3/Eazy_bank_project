import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../../store/app.state';
import * as AuthActions from '../../store/auth-store/auth.actions';

import { AppConstants } from 'src/app/constants/app.constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.css'],
})
export class NoticesComponent implements OnInit, OnDestroy {
  notices: any = [];
  httpSub$: Subscription;

  constructor(
    private http: HttpClient,
    private toast: HotToastService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.httpSub$ = this.http
      .get(`${environment.rootUrl}${AppConstants.NOTICES_API_URL}`)
      .pipe(
        this.toast.observe({
          success: 'Notices loaded successfully',
          loading: 'Loading notices...',
          error: 'There was an error',
        })
      )
      .subscribe({
        next: (res) => {
          this.notices = res;
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

  ngOnDestroy(): void {
    if (this.httpSub$) {
      this.httpSub$.unsubscribe();
    }
  }
}
