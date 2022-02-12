import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountComponent } from './components/account/account.component';
import { BalanceComponent } from './components/balance/balance.component';
import { CardsComponent } from './components/cards/cards.component';
import { ContactComponent } from './components/contact/contact.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoansComponent } from './components/loans/loans.component';
import { LoginComponent } from './components/login/login.component';
import { NoticesComponent } from './components/notices/notices.component';

import { AuthRouteguard } from './routeGuards/auth.routeguard';
import { LoginRouteguard } from './routeGuards/login.routeguard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    title: 'EazyBank - Login',
    component: LoginComponent,
    canActivate: [LoginRouteguard],
  },
  {
    path: 'contact',
    title: 'EazyBank - Contact Us',
    component: ContactComponent,
    canActivate: [LoginRouteguard],
  },
  {
    path: 'notices',
    title: 'EazyBank - Notices',
    component: NoticesComponent,
    canActivate: [LoginRouteguard],
  },
  {
    path: 'dashboard',
    title: 'EazyBank - Dashboard',
    component: DashboardComponent,
    canActivate: [AuthRouteguard],
  },
  {
    path: 'myAccount',
    title: 'EazyBank - Account',
    component: AccountComponent,
    canActivate: [AuthRouteguard],
  },
  {
    path: 'myBalance',
    title: 'EazyBank - Balance',
    component: BalanceComponent,
    canActivate: [AuthRouteguard],
  },
  {
    path: 'myLoans',
    title: 'EazyBank - Loans',
    component: LoansComponent,
    canActivate: [AuthRouteguard],
  },
  {
    path: 'myCards',
    title: 'EazyBank - Cards',
    component: CardsComponent,
    canActivate: [AuthRouteguard],
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
