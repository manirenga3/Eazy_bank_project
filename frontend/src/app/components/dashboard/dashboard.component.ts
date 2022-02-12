import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../../store/app.state';

import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: User = null;
  storeSub$: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.storeSub$ = this.store
      .select('auth')
      .subscribe((authData) => (this.user = authData.userData));
  }

  ngOnDestroy(): void {
    if (this.storeSub$) {
      this.storeSub$.unsubscribe();
    }
  }
}
