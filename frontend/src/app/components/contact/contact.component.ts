import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgForm } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription } from 'rxjs';

import * as fromApp from '../../store/app.state';
import * as AuthActions from '../../store/auth-store/auth.actions';

import { environment } from 'src/environments/environment';
import { AppConstants } from 'src/app/constants/app.constants';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit, OnDestroy {
  model: any = null;
  httpSub$: Subscription;

  constructor(
    private http: HttpClient,
    private toast: HotToastService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {}

  onSaveMessage(form: NgForm) {
    this.httpSub$ = this.http
      .post(`${environment.rootUrl}${AppConstants.CONTACT_API_URL}`, form.value)
      .pipe(
        this.toast.observe({
          success: 'Message sent successfully',
          loading: 'Sending message...',
          error: 'There was an error',
        })
      )
      .subscribe({
        next: (res) => {
          this.model = res;
          form.reset();

          // This is not an error but for showing Reference id, using loginFail action to trigger the alert component
          this.store.dispatch(
            AuthActions.loginFail({
              error: `Your message is submitted. Reference ID is ${this.model.contactId}`,
            })
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

  ngOnDestroy(): void {
    if (this.httpSub$) {
      this.httpSub$.unsubscribe();
    }
  }
}
