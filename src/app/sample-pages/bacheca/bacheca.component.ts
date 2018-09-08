import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ProfileService, UserDetails, PostObject } from '../../services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService, LoginPayload } from '../../services/authentication.service';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { post } from 'selenium-webdriver/http';

@Component({
  selector: 'app-root',
  templateUrl: './bacheca.component.html',
  styleUrls: ['./bacheca.component.css']
})
export class BachecaComponent implements OnInit {
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
  postEditable = false;
  editPostId: string;
  gender = '';
  userId = '';
  reader: any;
  comment: string;
  ads1 = '';
  ads2 = '';
  ads3 = '';
  ads4 = '';

  constructor(private profileService: ProfileService,
    private toastr: ToastrService, private auth: AuthenticationService, private modalService: NgbModal) {
    if (localStorage.getItem('role') === 'admin') {
      this.logout();
    }
    if (localStorage.getItem('token') === 'undefined' || localStorage.getItem('token') === 'null' || !localStorage.getItem('token')) {
      this.toastr.error('Devi effettuare il login per vedere il profilo!');
      this.logout();
    } else {
      this.bacheca();
      this.gender = localStorage.getItem('gender');
      this.ads();
    }
  }

  bacheca() {
    let id;
    if (window.location.href.split('?')[1]) {
      id = localStorage.getItem('contactId');
    } else {
      id = localStorage.getItem('_id');
    }
    this.userId = localStorage.getItem('_id');
    this.auth.bacheca()
      .then(
        res => {
          console.log(res.postmap);
          this.postsArrays = [];
          for (let i = 0; i < res.postmap.length; i++) {
            const likes = [];
            for (let j = 0; j < res.postmap[i].likes.length; j++) {
              likes.push({
                _id: res.postmap[i].likes[j]._id,
                name: res.postmap[i].likes[j].name,
                surname: res.postmap[i].likes[j].surname
              });
            }
            const comments = [];
            for (let j = 0; j < res.postmap[i].comment.length; j++) {
              comments.push({
                _id: res.postmap[i].comment[j]._id,
                name: res.postmap[i].comment[j].name,
                surname: res.postmap[i].comment[j].surname,
                comment: res.postmap[i].comment[j].comment,
                createdAt: this.pipe.transform(res.postmap[i].comment[j].created, 'medium')
              });
            }
            let profileImg;
            if (res.postmap[i].user.profilePic) {
              profileImg = res.postmap[i].user.profilePic;
            } else if (res.postmap[i].user.gender === 'Female') {
              profileImg = 'assets/images/users/female-avatar.png';
            } else if (res.postmap[i].user.gender === 'Male') {
              profileImg = 'assets/images/users/male-avatar.png';
            } else {
              profileImg = 'assets/images/users/male-avatar.png';
            }
            this.postsArrays.push({
              '_id': res.postmap[i]._id,
              'time': this.pipe.transform(res.postmap[i].createdAt, 'medium'),
              'caption': res.postmap[i].caption,
              'text': res.postmap[i].text,
              'img': res.postmap[i].image,
              'totalLikes': res.postmap[i].numbersOfLikes,
              'likes': likes,
              'comments': comments,
              'user': {
                'name': res.postmap[i].user.name + ' ' + res.postmap[i].user.surname,
                'gender': res.postmap[i].user.gender,
                'profilePic': profileImg
              }
            });
            // }
          }
          console.log(this.postsArrays);
        },
        error => console.log(error));
  }

  ads() {
    this.auth.getAds()
      .then(
        res => {
          for (let i = 0; i < res.adsMap.length; i++) {
            if (res.adsMap[i].id === '1') {
              this.ads1 = res.adsMap[i].path;
            }
            if (res.adsMap[i].id === '2') {
              this.ads2 = res.adsMap[i].path;
            }
            if (res.adsMap[i].id === '3') {
              this.ads3 = res.adsMap[i].path;
            }
            if (res.adsMap[i].id === '4') {
              this.ads4 = res.adsMap[i].path;
            }
          }
        },
        error => console.log(error));
  }

  createPost() {
    this.profileService.postData(this.postObject)
      .then(
        res => {
          // this.toastr.success('Post have been created!');
          this.postsArrays.push({
            'name': localStorage.getItem('name') + ' ' + localStorage.getItem('surname'),
            'time': this.pipe.transform(Date.now(), 'fullDate'),
            'text': this.postObject.text,
            'likes': '0'
          });
          this.postObject.caption = null;
          this.postObject.text = null;
          this.postObject.image = null;
          this.bacheca();
          this.imageSrc = null;
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

  handleFileInputforPost(files: FileList) {
    this.reader = new FileReader();
    this.reader.onload = e => this.imageSrc = this.reader.result;

    this.reader.readAsDataURL(files.item(0));
    this.auth.postFile(files.item(0))
      .then(res => {
        this.postObject.image = res.path;
      },
        error => console.error(error)
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

  like(id) {
    this.profileService.like(id)
      .then(
        res => {
          if (res.success) {
            if (res.likes === 1) {
              document.getElementById(id).innerHTML = res.likes +
                '<span> Like</span>';
            } else {
              document.getElementById(id).innerHTML = res.likes +
                '<span> Likes</span>';
            }
          }
        },
        error => {
          this.toastr.error('Qualcosa è andato storto, prova ancora!');
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

  addComment(id) {
    console.log(this.comment);
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

}
