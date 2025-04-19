import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { UserOverviewComponent } from './admin/user-management/user-overview/user-overview.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FileOverviewComponent } from './files/file-overview/file-overview.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { authGuard } from './_guards/auth.guard';
import { adminGuard } from './_guards/admin.guard';
import { leadGuard } from './_guards/lead.guard';
import { fileGuard } from './_guards/file.guard';
import { userGuard } from './_guards/user.guard';
import { analyticsGuard } from './_guards/analytics.guard';
import { AnalyticsOverviewComponent } from './analytics/analytics-overview/analytics.component';
import { DisbursementOverviewComponent } from './disbursement/disbursement-overview/disbursement-overview.component';
import { LeadOverviewComponent } from './leads/lead-overview/lead-overview.component';
import { LeadDiscoveryComponent } from './leads/lead-discovery/lead-discovery.component';
import { FileViewComponent } from './files/file-view/file-view.component';
import { ReportLayoutComponent } from './layouts/report-layout/report-layout.component';
import { FileOverviewReportComponent } from './analytics/file-overview-report/file-overview-report.component';
import { LeadOverviewReportComponent } from './analytics/leads-overview-report/leads-overview-report.component';


export const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'files',
        component: FileOverviewComponent,
        canActivate: [fileGuard]
      },
      {
        path: 'users',
        component: UserOverviewComponent,
        canActivate: [userGuard]
      },
      {
        path: 'analytics',
        component: AnalyticsOverviewComponent,
        canActivate: [analyticsGuard]
      },
      {
        path: 'disbursements',
        component: DisbursementOverviewComponent,
        canActivate: [adminGuard] // Assuming this is an admin-only feature
      },
      {
        path: 'leads',
        component: LeadOverviewComponent,
        canActivate: [leadGuard]
      },
      {
        path: 'discovery-lead',
        component: LeadDiscoveryComponent,
        canActivate: [leadGuard]
      },
      {
        path: 'legal-file-view-example',
        component: FileViewComponent,
        canActivate: [fileGuard]
      },
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
  {
    path: 'report',
    component: ReportLayoutComponent,
    canActivate: [analyticsGuard], // Apply analytics guard to the parent route
    children:[
      { path: 'file-overview', component: FileOverviewReportComponent },
      { path: 'lead-overview', component: LeadOverviewReportComponent }
    ]
  },

  // catch-all route
  { path: '**', redirectTo: '/dashboard' }
];
