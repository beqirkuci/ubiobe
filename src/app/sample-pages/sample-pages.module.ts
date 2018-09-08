import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SamplePagesRoutes } from './sample-pages.routing';
import { HelperclassesComponent } from './helper-classes/hc.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ProfileComponent } from './profile/profile.component';
import { BachecaComponent } from './bacheca/bacheca.component';
import { PricingComponent } from './pricing/pricing.component';
import { ToastrModule } from 'ngx-toastr';
// import { ProfileAdminComponent } from './profile-admin/profile-admin.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SamplePagesRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    HelperclassesComponent,
    InvoiceComponent,
    ProfileComponent,
    BachecaComponent,
    PricingComponent,
    // ProfileAdminComponent
  ]
})
export class SamplePagesModule {}
