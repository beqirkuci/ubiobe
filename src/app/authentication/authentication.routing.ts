import { Routes } from '@angular/router';

import { NotfoundComponent } from './404/not-found.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { Login2Component } from './login2/login2.component';
import { SignupComponent } from './signup/signup.component';
import { Signup2Component } from './signup2/signup2.component';
import { ChisiamoComponent } from './chi_siamo/chi_siamo.component';
import { ActivateComponent } from './activate/activate.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '404',
        component: NotfoundComponent
      },
      {
        path: 'lock',
        component: LockComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'login2',
        component: Login2Component
      },
      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'chi_siamo',
        component: ChisiamoComponent
      },
      {
        path: 'signup2',
        component: Signup2Component
      },
      {
        path: 'activate',
        component: ActivateComponent
      }
    ]
  }
];
