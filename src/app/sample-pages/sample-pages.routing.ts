import { Routes } from '@angular/router';

import { HelperclassesComponent } from './helper-classes/hc.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ProfileComponent } from './profile/profile.component';
import { BachecaComponent } from './bacheca/bacheca.component';
import { PricingComponent } from './pricing/pricing.component';
// import { ProfileAdminComponent } from './profile-admin/profile-admin.component';

export const SamplePagesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'helperclasses',
        component: HelperclassesComponent,
        data: {
          title: 'Helper Classes',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Helper Classes' }
          ]
        }
      },
      {
        path: 'invoice',
        component: InvoiceComponent,
        data: {
          title: 'Invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Invoice Page' }
          ]
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'Profile',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Profile Page' }
          ]
        }
      },
      {
        path: 'bacheca',
        component: BachecaComponent,
        data: {
          title: 'Bacheca',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Bacheca Page' }
          ]
        }
      },
      // {
      //   path: 'profile-admin',
      //   component: ProfileAdminComponent,
      //   data: {
      //     title: 'Profile Admin',
      //     urls: [
      //       { title: 'Dashboard', url: '/dashboard' },
      //       { title: 'Profile Admin Page' }
      //     ]
      //   }
      // },
      {
        path: 'pricing',
        component: PricingComponent,
        data: {
          title: 'Pricing',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Pricing Page' }
          ]
        }
      },
    ]
  }
];
