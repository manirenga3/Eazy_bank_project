import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../../store/app.state';
import * as AuthActions from '../../store/auth-store/auth.actions';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit, OnDestroy {
  message: string;
  storeSub$: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.storeSub$ = this.store
      .select('auth')
      .subscribe((authData) => (this.message = authData.error));
  }

  onClose() {
    this.store.dispatch(AuthActions.clearError());
  }

  ngOnDestroy(): void {
    if (this.storeSub$) {
      this.storeSub$.unsubscribe();
    }
  }
}
