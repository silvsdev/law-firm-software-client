import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component'; // Adjust the path as necessary
import { UserOverviewComponent } from './admin/user-management/user-overview/user-overview.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FileOverviewComponent } from './files/file-overview/file-overview.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { authGuard } from './_guards/auth.guard';
import { AnalyticsComponent } from './analytics/analytics.component';
import { DisbursementOverviewComponent } from './disbursement/disbursement-overview/disbursement-overview.component';
import { LeadOverviewComponent } from './leads/lead-overview/lead-overview.component';
import { LeadDiscoveryComponent } from './leads/lead-discovery/lead-discovery.component';

export const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'files', component: FileOverviewComponent },
      { path: 'users', component: UserOverviewComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'disbursements', component: DisbursementOverviewComponent },
      { path: 'leads', component: LeadOverviewComponent },
      { path: 'discovery-lead', component: LeadDiscoveryComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // default route
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: SignInComponent }
    ]
  },
  { path: '**', redirectTo: 'auth/login' } // catch-all route
];
