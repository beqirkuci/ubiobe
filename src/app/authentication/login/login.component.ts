import { Component } from '@angular/core';
import { AuthenticationService, LoginPayload } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: LoginPayload = {
    email: '',
    password: ''
  };

  constructor(private auth: AuthenticationService, private toastr: ToastrService) {
  }

  loginform = true;
  recoverform = false;

  showRecoverForm() {
    this.loginform = !this.loginform;
    this.recoverform = !this.recoverform;
  }

  redirectHome() {
    if (localStorage.getItem('role') === 'admin') {
      document.location.href = '/#/dashboard/profile-admin';
    } else if (localStorage.getItem('role') === 'user' || localStorage.getItem('role') === 'professional'
    || localStorage.getItem('role') === 'ambassador') {
      document.location.href = '/#/profile';
    }
  }

  login() {
    this.auth.login(this.credentials)
      .then(
        res => {
          if (res.success === true && res.active === true) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('name', res.name);
            localStorage.setItem('surname', res.surname);
            localStorage.setItem('email', res.email);
            localStorage.setItem('_id', res.userId);
            localStorage.setItem('role', res.role);
            localStorage.setItem('gender', res.gender);
            localStorage.setItem('profilePic', res.profilePic);
            this.redirectHome();
          }
          if (res.success === false && res.active === false) {
            this.toastr.error('Account non attivato! Vai alla tua email e conferma il tuo account.');
          }
          if (res.success === false && res.messsage === 'User not found!') {
            this.toastr.error('L\'email non esiste!');
          }
        },
        error => console.error(error));
  }
}
