import { Component } from '@angular/core';
import { AuthenticationService, SignupPayload } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  signupData: SignupPayload = {
    email: '',
    name: '',
    surname: '',
    gender: '',
    dateOfBirth: null,
    password: '',
    confirmPassword: '',
    agreeTerms: false
  };

  passwordNotMatched = false;
  signupForm = true;
  confirmEmailForm = false;

  constructor(private auth: AuthenticationService, private toastr: ToastrService, private modalService: NgbModal) { }

  redirectHome() {
    document.location.href = '/#/sample-pages/profile';
  }

  showConfirmEmailForm() {
    this.signupForm = !this.signupForm;
    this.confirmEmailForm = !this.confirmEmailForm;
  }

  signup() {
    console.log(this.signupData);
    if (this.validatePassword()) {
      this.auth.signup(this.signupData)
        .then(
          res => {
            console.log(res);
            if (res.success === true) {
              this.showConfirmEmailForm();
            // this.redirectHome();
            } else if (res.success === false && res.message === 'This user with this email already Exist') {
              this.toastr.error('Questo utente con questa email esiste già. Si prega di provare un altro.');
            }
          },
          error => console.error(error)
        );
      console.log(this.signupData);
    } else {
      console.log('test');
    }
  }

  validatePassword() {
    if (this.signupData.password === this.signupData.confirmPassword) {
      this.passwordNotMatched = false;
      return true;
    } else {
      this.passwordNotMatched = true;
      return false;
    }
  }

  openTermsModal(content) {
    this.modalService.open(content, { size: 'lg' }).result.then(
      result => {
      },
      reason => {
      }
    );
  }

  openPrivacyModal(content) {
    this.modalService.open(content, { size: 'lg' }).result.then(
      result => {
      },
      reason => {
      }
    );
  }

}
