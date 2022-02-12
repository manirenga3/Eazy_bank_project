import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../app/store/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'eazy-bank';
  error: string = null;
  storeSub$: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.storeSub$ = this.store
      .select('auth')
      .subscribe((authData) => (this.error = authData.error));
  }

  ngOnDestroy(): void {
    if (this.storeSub$) {
      this.storeSub$.unsubscribe();
    }
  }
}
