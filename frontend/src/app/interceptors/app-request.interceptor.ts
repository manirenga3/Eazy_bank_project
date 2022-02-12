import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, exhaustMap } from 'rxjs/operators';

import * as fromApp from '../store/app.state';

@Injectable({ providedIn: 'root' })
export class AppRequestInterCeptor implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      take(1),
      exhaustMap((authData) => {
        if (!authData.authStatus) {
          return next.handle(req);
        }
        let header = new HttpHeaders({ Authorization: authData.authorization });
        const modifiedReq = req.clone({ headers: header });
        return next.handle(modifiedReq);
      })
    );
  }
}
