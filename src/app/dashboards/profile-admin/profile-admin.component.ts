import { Component } from '@angular/core';
import { AuthenticationService, LoginPayload } from '../../services/authentication.service';
@Component({
  templateUrl: 'profile-admin.component.html'
})
export class ProfileAdminComponent {
  constructor(private auth: AuthenticationService) {
    if (localStorage.getItem('role') !== 'admin') {
    this.logout();
    }
  }
  logout() {
    window.localStorage.clear();
    document.location.href = '/#/signup2';
  }

}
