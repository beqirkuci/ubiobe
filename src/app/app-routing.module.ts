import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { TopbarComponent} from './layouts/top-bar/top-bar.component';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/signup2', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: './dashboards/dashboard.module#DashboardModule'
      },
      {
        path: 'starter',
        loadChildren: './starter/starter.module#StarterModule'
      },
      {
        path: 'component',
        loadChildren: './component/component.module#ComponentsModule'
      },
      { path: 'cards', loadChildren: './cards/cards.module#CardsModule' },
      { path: 'icons', loadChildren: './icons/icons.module#IconsModule' },
      { path: 'forms', loadChildren: './form/forms.module#FormModule' },
      { path: 'tables', loadChildren: './table/tables.module#TablesModule' },
      { path: 'charts', loadChildren: './charts/charts.module#ChartModule' },
      {
        path: 'widgets',
        loadChildren: './widgets/widgets.module#WidgetsModule'
      },
      { path: 'ecom', loadChildren: './ecommerce/ecom.module#EcomModule' },
      {
        path: 'timeline',
        loadChildren: './timeline/timeline.module#TimelineModule'
      },
      {
        path: 'extra-component',
        loadChildren:
          './extra-component/extra-component.module#ExtraComponentModule'
      },
      { path: 'apps', loadChildren: './apps/apps.module#AppsModule' },
      { path: 'maps', loadChildren: './maps/maps.module#MapsModule' },
    ]
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '',
        loadChildren:
          './authentication/authentication.module#AuthenticationModule'
      }
    ]
  },
  {
    path: '',
    component: TopbarComponent,
    children: [
      {
        path: '',
        loadChildren:
          './sample-pages/sample-pages.module#SamplePagesModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
