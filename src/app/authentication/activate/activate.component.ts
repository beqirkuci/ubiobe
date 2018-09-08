/* tslint:disable */

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import {
  NgbModal,
  // ModalDismissReasons,
  // NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styles: ['p:hover, h1:hover, h2:hover, h3:hover, h4:hover, h5:hover { color: #383838 !important}']
})
export class ActivateComponent implements OnInit {

  accountAcctivated = true;
  proSignup = false;
  activated: boolean;
  condition = false;
  workHere = false;
  fileToUpload: File = null;

  form: FormGroup;
  formErrors = {
    experiences: [
      { title: '', from: '', to: '', experience: '', workHere: '' }
    ]
  };
  validationMessages = {
    experiences: {
      title: {
        required: 'Title is required'
      },
      from: {
        required: 'From is required.'
      },
      to: {
        required: 'To is required.'
      },
      experience: {
        required: 'Experience is required.'
      },
      workHere: {
      }
    }
  };

  constructor(
    private auth: AuthenticationService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.buildForm();
    let token = window.location.href.split('?')[1];
    if (token) {
      token = token.substring(0, token.length - 1);
      this.auth.activate(token)
        .then(res => {
          if (res.success === true) {
            this.activated = true;
            localStorage.setItem('token', res.token);
            localStorage.setItem('_id', res.user._id);
            localStorage.setItem('name', res.user.name);
            localStorage.setItem('surname', res.user.surname);
            localStorage.setItem('email', res.user.email);
            localStorage.setItem('gender', res.user.gender);
            localStorage.setItem('dateOfBirth', res.user.dateOfBirth);
            localStorage.setItem('permission', res.user.permission);
          } else {
            this.activated = false;
          }
        },
          error => {
            this.activated = false;
            console.error(error);
          }
        );
    } else {
      this.activated = true;
    }
    this.workHere = !this.workHere;
  }

  open(content) {
    this.modalService.open(content).result.then(
      result => {
      },
      reason => {
      }
    );
  }

  save() {
    if (this.condition) {
      document.getElementById('btnClose').click();
      this.showProSignupForm();
    } else {
      this.toastr.error('Devi controllare le condizione per continuare il processo di registrazione come professionista.');
    }
  }

  redirectProfile() {
    document.location.href = '/#/profile';
  }

  showProSignupForm() {
    this.proSignup = !this.proSignup;
    this.accountAcctivated = !this.accountAcctivated;
  }

  get formData() { 
    return <FormArray>this.form.get('experiences');
  }

  // build initial form
  buildForm() {
    // build our form
    this.form = this.fb.group({
      experiences: this.fb.array([
        this.createExperience()
      ])
    });

    // watch for changes and validate
    this.form.valueChanges.subscribe(data => this.validateForm());
  }

  /**
  * validate the entire form
  */
  validateForm() {
    for (let field in this.formErrors) {
      // clear that input field errors
      this.formErrors[field] = '';

      // grab an input field by name
      let input = this.form.get(field);

      if (input.invalid && input.dirty) {
        // figure out the type of error
        // loop over the formErrors field names
        for (let error in input.errors) {
          // assign that type of error message to a variable
          this.formErrors[field] = this.validationMessages[field][error];
        }
      }
    }

    this.validateExperiences();
  }

  /**
   * validate the experiences formarray
   */
  validateExperiences() {
    // grab the experiences formarray
    const experiences = <FormArray>this.form.get('experiences');

    // clear the form errors
    this.formErrors.experiences = [];

    // loop through however many formgroups are in the formarray
    let n = 1;
    while (n <= experiences.length) {

      // add the clear errors back
      this.formErrors.experiences.push({ title: '', from: '', to: '', experience: '', workHere: '' });

      // grab the specific group (experience)
      const experience = <FormGroup>experiences.at(n - 1);

      // validate that specific group. loop through the groups controls
      for (let field in experience.controls) {
        // get the formcontrol
        let input = experience.get(field);

        // do the validation and save errors to formerrors if necessary 
        if (input.invalid && input.dirty) {
          for (let error in input.errors) {
            this.formErrors.experiences[n - 1][field] = this.validationMessages.experiences[field][error];
          }
        }
      }

      n++;
    }
  }

  createExperience() {
    return this.fb.group({
      title: [''],
      from: [''],
      to: [''],
      experience: [''],
      workHere: [''],
      fileToUpload: '',
      path: ''
    });
  }

  addExperience() {
    const experiences = <FormArray>this.form.get('experiences');
    experiences.push(this.createExperience());
  }

  removeExperience(i) {
    const experiences = <FormArray>this.form.get('experiences');
    experiences.removeAt(i);
  }

  processForm() {
    console.log('processing', JSON.stringify(this.form.value));
    this.auth.proExperiences(this.form.value)
      .then(res => {
        console.log(res);
        this.toastr.success('I dati professionali sono stati inseriti con successo. Riceverai una notifica via email.');
        this.redirectProfile();
        // this.open(proFinished);
      },
        error => this.toastr.error('Qualcosa è andato storto, prova ancora!')
      );
  }

  workHereChange(values: any) {
    this.workHere = !this.workHere;
  }

  handleFileInput(files: FileList, i) {
    // this.fileToUpload = files.item(0);
    const experiences = <FormArray>this.form.get('experiences');
    experiences.controls[i].patchValue({ fileToUpload: files.item(0) });
    console.log(experiences);
  }

  uploadFileToActivity(i) {
    const experiences = <FormArray>this.form.get('experiences');
    let fileToUpload = experiences.controls[i]['value'].fileToUpload;
    this.auth.postFile(fileToUpload)
      .then(res => {
        const experiences = <FormArray>this.form.get('experiences');
        experiences.controls[i].patchValue({ path: res.path });
      },
        error => console.log(error)
      );
  }

  ngOnInit() {
    // build the data model for our form
    this.buildForm();
  }

}
