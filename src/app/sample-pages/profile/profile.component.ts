/* tslint:disable */

import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ProfileService, UserDetails, PostObject, TimelineObject } from '../../services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService, LoginPayload } from '../../services/authentication.service';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { local } from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userDetails: UserDetails = {
    _id: null,
    profilePic: null,
    name: null,
    surname: null,
    nickname: null,
    gender: null,
    dateOfBirth: null,
    dateOfBirthFormatted: null,
    placeOfBirth: null,
    placeOfResidence: null,
    maritalStatus: null,
    profession: null,
    isEmailPrivate: false,
    email: null,
    email2: null,
    telMobile: null,
    telOffice: null,
    address: null,
    sharedMyData: null,
    private: null,
    height: null,
    weight: null,
    bmi: null,
    bmiDescription: null,
    permission: null,
    contact: null,
    experiences: [{
      _id: null,
      from: null,
      fromFormatted: null,
      to: null,
      toFormatted: null,
      workHere: null,
      title: null,
      experience: null,
      path: null,
      user_id: null
    }]
  };
  contacts: any = [];
  pipe = new DatePipe('it-IT');
  postsArrays = [];
  closeResult: string;
  postObject: PostObject = {
    caption: null,
    text: null,
    image: null
  };
  imgArrays = [];
  imageSrc: any = '';
  imageSrcTimeline: any = '';
  postEditable = false;
  editPostId: string;
  nickname: string;
  profilePicToUpload: any;
  totalUsers: number;
  activeIds: string[] = [];
  timelineData: TimelineObject[] = [];
  timelineObject = {
    title: null,
    time: null,
    content: null,
    image: null
  };
  timelineEditable = false;
  editTimelineId: string;
  comment: string = '';
  loggedInUserRole: string;
  mediaToUpload: any;

  workHere = false;
  fileToUpload: File = null;
  condition = false;

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
    private profileService: ProfileService,
    private toastr: ToastrService,
    private auth: AuthenticationService,
    private modalService: NgbModal,
    private fb: FormBuilder) {
    if (localStorage.getItem('role') === 'admin') {
      this.logout();
    }
    if (localStorage.getItem('token') === 'undefined' || localStorage.getItem('token') === 'null' || !localStorage.getItem('token')) {
      this.toastr.error('Devi effettuare il login per vedere il profilo!');
      this.logout();
    } else {
      const id = window.location.href.split('?')[1];
      console.log('id from constr: ' + id);
      if (!id) {
        this.userDetails._id = localStorage.getItem('_id');
        this.userDetails.name = localStorage.getItem('name');
        this.userDetails.surname = localStorage.getItem('surname');
        this.userDetails.gender = localStorage.getItem('gender');
        this.userDetails.dateOfBirth = localStorage.getItem('dateOfBirth');
        this.userDetails.email = localStorage.getItem('email');
        this.userDetails.permission = localStorage.getItem('role');
        this.profileData();
      } else {
        if (id.substring(id.length - 1, id.length) === '=') {
          this.viewProfile(id.substring(0, id.length - 1));
        } else {
          this.viewProfile(id);
        }
      }
    }
    this.imgMedia();
    this.posts();
    this.profileService.listen().subscribe((m: any) => {
      this.onNameClick();
    });
    this.profileService.listen1().subscribe((m: any) => {
      toastr.success('Un invito è stato inviato!');
    });
    this.profileService.listen2().subscribe((m: any) => {
      toastr.error('Oops! Qualcosa è andato storto, prova ancora!');
    });

    this.workHere = !this.workHere;
    this.loggedInUserRole = localStorage.getItem('role');
  }

  onNameClick() {
    document.location.href = '/#/profile';
    this.profileData();
    this.posts();
    this.imgMedia();
    this.getTimeline();
  }

  // gets called at profilo tab and onInit
  profileData() {
    console.log('profileData', window.location.href.split('?')[1]);
    let id;
    if (window.location.href.split('?')[1]) {
      id = localStorage.getItem('contactId');
    } else {
      id = localStorage.getItem('_id');
    }
    this.profileService.profileData(id)
      .then(
        res => {
          this.totalUsers = res['nr of users total '];
          this.userDetails._id = res.user._id;
          if (res.user.profilePic) {
            this.userDetails.profilePic = res.user.profilePic;
          } else if (res.user.gender === 'Female') {
            this.userDetails.profilePic = 'assets/images/users/female-avatar.png';
          } else if (res.user.gender === 'Male') {
            this.userDetails.profilePic = 'assets/images/users/male-avatar.png';
          } else {
            this.userDetails.profilePic = 'assets/images/users/male-avatar.png';
          }
          this.userDetails.private = res.user.private;
          this.userDetails.name = res.user.name;
          this.userDetails.surname = res.user.surname;
          this.userDetails.nickname = res.user.nickname;
          this.userDetails.gender = res.user.gender;
          this.userDetails.dateOfBirth = res.user.dateOfBirth.toString().substring(0, 10);
          this.userDetails.dateOfBirthFormatted = this.pipe.transform(this.userDetails.dateOfBirth, 'mediumDate');
          this.userDetails.placeOfBirth = res.user.placeOfBirth;
          this.userDetails.placeOfResidence = res.user.placeOfResidence;
          this.userDetails.maritalStatus = res.user.maritalStatus;
          this.userDetails.profession = res.user.profession;
          this.userDetails.isEmailPrivate = res.user.isEmailPrivate;
          this.userDetails.email = res.user.email;
          this.userDetails.email2 = res.user.email2;
          this.userDetails.telMobile = res.user.telMobile;
          this.userDetails.telOffice = res.user.telOffice;
          this.userDetails.address = res.user.address;
          this.userDetails.sharedMyData = res.user.sharedMyData;
          if (res.user.privateData) {
            this.userDetails.height = res.user.privateData.height;
            this.userDetails.weight = res.user.privateData.weight;
            this.userDetails.bmi = res.user.privateData.bmi;
            this.userDetails.bmiDescription = res.user.privateData.description;
          }
          this.userDetails.permission = res.user.permission;
          this.userDetails.contact = res.user.contact;
          if (res.user.permission === 'professional') {
            if (this.userDetails.experiences.length === 1) {
              this.userDetails.experiences.pop();
              for (let i = 0; i < res.user.experiences.length; i++) {
                const to = res.user.experiences[i].to ? res.user.experiences[i].to.toString().substring(0, 10) : null;
                this.userDetails.experiences.push({
                  _id: res.user.experiences[i]._id,
                  from: res.user.experiences[i].from.toString().substring(0, 10),
                  fromFormatted: this.pipe.transform(res.user.experiences[i].from, 'mediumDate'),
                  to: to,
                  toFormatted: this.pipe.transform(to, 'mediumDate'),
                  workHere: res.user.experiences[i].workHere,
                  title: res.user.experiences[i].title,
                  experience: res.user.experiences[i].experience,
                  path: res.user.experiences[i].path,
                  user_id: res.user.experiences[i].user_id
                });
              }
            }
          }
          console.log(this.userDetails);
        },
        error => {
          this.toastr.error('Qualcosa è andato storto, prova ancora!');
          console.error(error);
        }
      );
  }

  updateProfile(nickname?: string) {
    if (nickname) {
      this.userDetails.nickname = nickname;
    }
    console.log(this.userDetails);
    this.profileService.updateProfile(this.userDetails)
      .then(
        res => {
          this.userDetails.bmi = res.bmi;
          this.toastr.success('Profilo aggiornato!');
          console.log(res);
        },
        error => {
          this.toastr.error('Qualcosa è andato storto, prova ancora!');
          console.error(error);
        }
      );
  }

  // called at all users tab
  users() {
    this.profileService.users()
      .then(
        res => {
          this.contacts = res.allUsers;
          console.log(this.contacts);
        },
        error => {
          console.log(error);
        }
      ).catch(
        error => {
          console.error(error);
        }
      );
  }

  posts() {
    // console.log('posts');
    let id;
    if (window.location.href.split('?')[1]) {
      id = localStorage.getItem('contactId');
    } else {
      id = localStorage.getItem('_id');
    }
    this.auth.posts(id)
      .then(
        res => {
          this.postsArrays = [];
          for (let i = 0; i < res.length; i++) {
            const likes = [];
            for (let j = 0; j < res[i].likes.length; j++) {
              likes.push({
                _id: res[i].likes[j]._id,
                name: res[i].likes[j].name,
                surname: res[i].likes[j].surname
              });
            }
            const comments = [];
            for (let j = 0; j < res[i].comment.length; j++) {
              comments.push({
                _id: res[i].comment[j]._id,
                name: res[i].comment[j].name,
                surname: res[i].comment[j].surname,
                comment: res[i].comment[j].comment,
                createdAt: this.pipe.transform(res[i].comment[j].created, 'medium')
              });
            }
            this.postsArrays.push({
              '_id': res[i]._id,
              'name': res[i].user.name + ' ' + res[i].user.surname,
              'time': this.pipe.transform(res[i].createdAt, 'medium'),
              'caption': res[i].caption,
              'text': res[i].text,
              'img': res[i].image,
              'totalLikes': res[i].likes.length,
              'likes': likes,
              'comments': comments
            });
          }
        },
        error => console.log(error));
  }

  imgMedia() {
    let id;
    if (window.location.href.split('?')[1]) {
      id = localStorage.getItem('contactId');
    } else {
      id = localStorage.getItem('_id');
    }
    this.imgArrays = [];
    this.auth.images(id)
      .then(
        res => {
          console.log(res);
          for (let i = 0; i < res.length; i++) {
            this.imgArrays.push({
              'src': res[i],
            });
          }
        },
        error => console.log(error));
  }

  handleFileInputforMedia(files: FileList) {
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;

    reader.readAsDataURL(files.item(0));
    this.mediaToUpload = files.item(0);

  }

  uploadMediaImage() {
    this.auth.postFile(this.mediaToUpload)
      .then(res => {
        if (res.success) {
          this.imgArrays.push({
            'src': res.path,
          });
        }
        this.imageSrc = null;
        document.getElementById('closeUploadMedia').click();
        console.log(res);
      },
        error => console.error(error)
      );
  }

  createPost() {
    this.profileService.postData(this.postObject)
      .then(
        res => {
          if (res.success) {
            document.getElementById('closeCreatePostModal').click();
            // this.toastr.success('Post have been created!');
            this.posts();
          }
          this.postObject.caption = null;
          this.postObject.text = null;
          this.postObject.image = null;
          this.imageSrc = null;
        },
        error => {
          this.toastr.error('Qualcosa è andato storto, prova ancora!');
          console.error(error);
        }
      );
  }

  like(id) {
    this.profileService.like(id)
      .then(
        res => {
          if (res.success) {
            // if (res.message === 'you liked this post') {
            if (res.likes === 1) {
              document.getElementById(id).innerHTML = res.likes +
                '<span> Like</span>';
            } else {
              document.getElementById(id).innerHTML = res.likes +
                '<span> Likes</span>';
            }
            // } else {
            //   document.getElementById(id).innerHTML = res.likes +
            //     '<span *ngIf="res.likes===1"> Like</span><span *ngIf="res.likes!==1"> Likes</span>';
            // }
          }
        },
        error => {
          this.toastr.error('Qualcosa è andato storto, prova ancora!');
          console.error(error);
        }
      );
  }

  viewProfile(id) {
    // console.log('viewProfile');
    this.profileService.profileData(id)
      .then(
        res => {
          window.location.href = '/#/profile?' + id;
          document.getElementById('activity').click();
          localStorage.setItem('contactId', res.user._id);
          this.totalUsers = res['nr of users total '];
          this.userDetails._id = res.user._id;
          if (res.user.profilePic) {
            this.userDetails.profilePic = res.user.profilePic;
          } else if (res.user.gender === 'Female') {
            this.userDetails.profilePic = 'assets/images/users/female-avatar.png';
          } else if (res.user.gender === 'Male') {
            this.userDetails.profilePic = 'assets/images/users/male-avatar.png';
          } else {
            this.userDetails.profilePic = 'assets/images/users/male-avatar.png';
          }
          this.userDetails.private = res.user.private;
          this.userDetails.name = res.user.name;
          this.userDetails.surname = res.user.surname;
          this.userDetails.nickname = res.user.nickname;
          this.userDetails.gender = res.user.gender;
          this.userDetails.dateOfBirth = res.user.dateOfBirth.toString().substring(0, 10);
          this.userDetails.dateOfBirthFormatted = this.pipe.transform(this.userDetails.dateOfBirth, 'mediumDate');
          this.userDetails.placeOfBirth = res.user.placeOfBirth;
          this.userDetails.placeOfResidence = res.user.placeOfResidence;
          this.userDetails.maritalStatus = res.user.maritalStatus;
          this.userDetails.profession = res.user.profession;
          this.userDetails.isEmailPrivate = res.user.isEmailPrivate;
          this.userDetails.email = res.user.email;
          this.userDetails.email2 = res.user.email2;
          this.userDetails.telMobile = res.user.telMobile;
          this.userDetails.telOffice = res.user.telOffice;
          this.userDetails.address = res.user.address;
          this.userDetails.sharedMyData = res.user.sharedMyData;
          if (res.user.privateData) {
            this.userDetails.height = res.user.privateData.height;
            this.userDetails.weight = res.user.privateData.weight;
            this.userDetails.bmi = res.user.privateData.bmi;
            this.userDetails.bmiDescription = res.user.privateData.description;
          }
          this.userDetails.permission = res.user.permission;
          this.userDetails.contact = res.user.contact;
          if (res.user.permission === 'professional') {
            this.userDetails.experiences = [
              {
                _id: null,
                from: null,
                fromFormatted: null,
                to: null,
                toFormatted: null,
                workHere: null,
                title: null,
                experience: null,
                path: null,
                user_id: null
              }
            ];
            this.userDetails.experiences.pop();
            for (let i = 0; i < res.user.experiences.length; i++) {
              const to = res.user.experiences[i].to ? res.user.experiences[i].to.toString().substring(0, 10) : null;
              this.userDetails.experiences.push({
                _id: res.user.experiences[i]._id,
                from: res.user.experiences[i].from.toString().substring(0, 10),
                fromFormatted: this.pipe.transform(res.user.experiences[i].from, 'mediumDate'),
                to: to,
                toFormatted: this.pipe.transform(to, 'mediumDate'),
                workHere: res.user.experiences[i].workHere,
                title: res.user.experiences[i].title,
                experience: res.user.experiences[i].experience,
                path: res.user.experiences[i].path,
                user_id: res.user.experiences[i].user_id
              });
            }
          }
          this.posts();
          this.imgMedia();
          this.getTimeline();
        },
        error => {
          this.toastr.error('Qualcosa è andato storto, prova ancora!');
          console.error(error);
        }
      );
  }

  logout() {
    window.localStorage.clear();
    document.location.href = '/#/signup2';
  }

  ngOnInit() {
  }

  openPostModal(content) {
    this.modalService.open(content).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  viewDocument(path) {
    // console.log(path);
    const win = window.open(path, '_blank');
    win.focus();
  }

  handleFileInputforPost(files: FileList) {
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;

    reader.readAsDataURL(files.item(0));
    this.auth.postFile(files.item(0))
      .then(res => {
        this.postObject.image = res.path;
        console.log(this.postObject);
      },
        error => console.error(error)
      );
  }

  handleFileInputforProfilePic(files: FileList) {
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;

    reader.readAsDataURL(files.item(0));
    this.profilePicToUpload = files.item(0);

  }

  uploadProfilePict() {
    this.auth.postFile(this.profilePicToUpload)
      .then(res => {
        if (res.success) {
          localStorage.setItem('profilePic', res.path);
          this.profileService.navigate3('something');
          this.userDetails.profilePic = res.path;
          this.updateProfile();
          this.imageSrc = null;
          document.getElementById('closeProfilePic').click();
        }
      },
        error => console.error(error)
      );
  }

  changePostStatus(postId) {
    this.postEditable = !this.postEditable;
    this.editPostId = postId;
  }

  editPost(postId, caption, text) {
    const postToEdit = {
      '_id': postId,
      'caption': caption,
      'text': text
    };
    this.profileService.editPost(postToEdit)
      .then(
        res => {
          if (res.success) {
            this.changePostStatus(postId);
            this.editPostId = '';
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  deletePost(postId) {
    console.log(postId);
    this.profileService.deletePost(postId)
      .then(
        res => {
          console.log(res);
          this.posts();
          document.getElementById('close').click();
        },
        error => {
          console.error(error);
        }
      );
  }

  confirmDeletePost(content) {
    this.modalService.open(content).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  uploadProfilePic(content) {
    this.modalService.open(content).result.then(
      result => {
        // this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  handleFileInputforTimeline(files: FileList) {
    const reader = new FileReader();
    reader.onload = e => this.imageSrcTimeline = reader.result;

    reader.readAsDataURL(files.item(0));
    this.auth.postFile(files.item(0))
      .then(res => {
        this.timelineObject.image = res.path;
        console.log(this.timelineObject);
      },
        error => console.error(error)
      );
  }

  createTimelineItem() {
    console.log(this.timelineObject);
    this.profileService.createTimeline(this.timelineObject)
      .then(
        res => {
          if (res.success === true) {
            this.getTimeline();
            this.timelineObject.title = null;
            this.timelineObject.time = null;
            this.timelineObject.content = null;
            this.imageSrcTimeline = null;
            this.collapse();
          } else {
            this.toastr.error('Qualcosa è andato storto, prova ancora!');
          }
        },
        error => {
          this.toastr.error('Qualcosa è andato storto, prova ancora!');
        }
      );
  }

  collapse() {
    this.activeIds = [];
  }

  getTimeline() {
    let id;
    if (window.location.href.split('?')[1]) {
      id = localStorage.getItem('contactId');
    } else {
      id = localStorage.getItem('_id');
    }
    this.profileService.getTimeline(id)
      .then(
        res => {
          this.timelineData = [];
          if (res.success === true && res.message === 'you dont have timeline') {
          } else {
            for (let i = 0; i < res.timelineMap.length; i++) {
              this.timelineData.push({
                _id: res.timelineMap[i]._id,
                title: res.timelineMap[i].title,
                content: res.timelineMap[i].content,
                createdAt: this.pipe.transform(res.timelineMap[i].createdAt, 'mediumDate'),
                time: this.pipe.transform(res.timelineMap[i].time, 'mediumDate'),
                image: res.timelineMap[i].image,
                name: res.timelineMap[i].name,
                surname: res.timelineMap[i].surname
              });
            }
            // console.log(this.timelineData);
          }
          // console.log(res);
        },
        error => {
          console.error(error);
        }
      );
  }

  confirmDeleteTimeline(content) {
    this.modalService.open(content).result.then(
      result => {
        // this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  deleteTimeline(id) {
    console.log(id);
    this.profileService.deleteTimeline(id)
      .then(
        res => {
          console.log(res);
          this.getTimeline();
          document.getElementById('closeTimeline').click();
          if (res.success === true) {
            this.toastr.success('Timeline cancellata con successo!');
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  changeTimelineStatus(timelineId) {
    this.timelineEditable = !this.timelineEditable;
    this.editTimelineId = timelineId;
  }

  editTimeline(timelineId, title, content) {
    const timelineToEdit = {
      '_id': timelineId,
      'title': title,
      'content': content
    };
    this.profileService.editTimeline(timelineToEdit)
      .then(
        res => {
          if (res.success) {
            this.toastr.success('Timeline modificata');
            this.changeTimelineStatus(timelineId);
            this.editTimelineId = '';
          }
        },
        error => {
          this.toastr.error('C è stato un errore.');
          console.error(error);
        }
      );
  }

  openLikesModal(content) {
    this.modalService.open(content).result.then(
      result => {
        // this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  shareData() {
    const id = localStorage.getItem('contactId');
    this.profileService.shareData(id)
      .then(
        res => {
          if (res.success) {
            this.toastr.success('La tua richiesta di condividere i tuoi dati con questo utente è andata a buon fine');
            this.userDetails.sharedMyData = true;
          }
          if (res.success === false && res.message === 'you have shared once private data with this user') {
            this.toastr.warning('Hai condiviso una volta i dati privati con questo utente!');
          }
          // console.log(res);
        },
        error => {
          console.error(error);
          this.toastr.error('Oops. c-è stato un errore.');
        }
      );
  }

  addComment(id) {
    const commentObject = {
      'comment': this.comment
    };
    let index = -1;
    for (let i = 0; i < this.postsArrays.length; i++) {
      if (this.postsArrays[i]._id === id) {
        index = i;
      }
    }
    if (this.comment.length === 0) {
      this.toastr.error('Non si può inserire un commento vuoto!');
    } else {
      this.profileService.addComment(id, commentObject)
        .then(
          res => {
            console.log(res);
            if (res.success === true) {
              this.postsArrays[index].comments.unshift({
                '_id': 'someFakeId',
                'name': localStorage.getItem('name'),
                'surname': localStorage.getItem('surname'),
                'comment': commentObject.comment,
                'createdAt': this.pipe.transform(new Date(), 'medium')
              });
              this.comment = '';
            }
          },
          error => {
            console.error(error);
          }
        );
    }
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' }).result.then(
      result => {
        // this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  save(proSignupForm) {
    if (this.condition) {
      document.getElementById('btnClose').click();
      this.buildForm();
      this.open(proSignupForm);
    } else {
      this.toastr.error('Devi controllare le condizione per continuare il processo di registrazione come professionista.');
    }
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
    if (this.condition) {
      this.auth.proExperiences(this.form.value)
        .then(res => {
          // console.log(res);
          this.toastr.success('I dati professionali sono stati inseriti con successo. Riceverai una notifica via email.');
          document.getElementById('btnClose').click();
        },
          error => this.toastr.error('Qualcosa è andato storto, prova ancora!')
        );
    } else {
      // console.log(this.form.value);
      this.auth.createExperiences(this.form.value)
        .then(res => {
          // console.log(res);
          if (res.success) {
            this.toastr.success('I dati professionali sono stati inseriti con successo.');
            document.getElementById('btnClose').click();
          }
        },
          error => this.toastr.error('Qualcosa è andato storto, prova ancora!')
        );
    }

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

  createExperiences(proSignupForm) {
    console.log(this.condition);
    this.buildForm();
    this.open(proSignupForm);
  }
}
