import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../../store/app.state';
import * as AuthActions from '../../store/auth-store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  authStatus: boolean = false;
  storeSub$: Subscription;

  constructor(
    private store: Store<fromApp.AppState>,
    private toast: HotToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storeSub$ = this.store.select('auth').subscribe((authData) => {
      this.authStatus = authData.authStatus;
    });
  }

  onLogout() {
    this.toast.loading('Logging out...', { duration: 2000 });
    setTimeout(() => {
      this.store.dispatch(AuthActions.logout());
      this.router.navigate(['/login']);
      this.toast.success('Logged out successfully');
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this.storeSub$) {
      this.storeSub$.unsubscribe();
    }
  }
}
