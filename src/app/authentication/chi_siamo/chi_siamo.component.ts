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
  templateUrl: './chi_siamo.component.html',
  styleUrls: ['./chi_siamo.component.css']
})
export class ChisiamoComponent {
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
  passwordLength = false;
  signupForm = true;
  confirmEmailForm = false;

  constructor(private auth: AuthenticationService, private toastr: ToastrService, private modalService: NgbModal) { }

  redirectHome() {
    document.location.href = '/#/sample-pages/profile';
  }

  login() {
    document.location.href = '/#/login';
  }
  showConfirmEmailForm() {
    this.signupForm = !this.signupForm;
    this.confirmEmailForm = !this.confirmEmailForm;
  }

  signup() {
    console.log(this.signupData);
    if (this.validatePasswordLength() && this.validatePassword()) {
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
      // console.log("done");
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

  validatePasswordLength() {
    if (this.signupData.password.length > 5) {
      this.passwordLength = false;
      return true;
    } else {
      this.passwordLength = true;
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

  chisiamo() {
    document.location.href = '/#/chi_siamo';
  }

  home() {
    document.location.href = '/#/signup2';
  }

}
