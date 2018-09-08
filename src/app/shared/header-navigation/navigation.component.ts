import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService, LoginPayload } from '../../services/authentication.service';
import { ProfileService } from '../../services/profile.service';
import { DatePipe } from '@angular/common';
import {
  NgbModal,
  ModalDismissReasons,
  NgbPanelChangeEvent,
  NgbCarouselConfig
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() Filter: EventEmitter<any> = new EventEmitter();

  public config: PerfectScrollbarConfigInterface = {};

  public showSearch = false;
  route: string;
  isAdmin: boolean;
  isUser: boolean;
  name = '';
  email = '';
  photo = '';
  profilePicture = null;
  role = '';
  time: Date;
  gender = '';
  pipe = new DatePipe('it-IT');
  closeResult: string;
  inviteEmail: string;
  constructor(
    private modalService: NgbModal,
    location: Location,
    router: Router,
    private auth: AuthenticationService,
    private profileService: ProfileService) {
    this.name = localStorage.getItem('name');
    this.email = localStorage.getItem('email');
    this.role = localStorage.getItem('role');
    this.gender = localStorage.getItem('gender');
    if (localStorage.getItem('profilePic')) {
      this.profilePicture = localStorage.getItem('profilePic');
    } else if (this.gender === 'Female') {
      this.profilePicture = 'assets/images/users/female-avatar.png';
    } else if (this.gender === 'Male') {
      this.profilePicture = 'assets/images/users/male-avatar.png';
    } else {
      this.profilePicture = '';
    }
    this.profileService.listen3().subscribe((m: any) => {
      this.profilePicture = localStorage.getItem('profilePic');
    });
    if (this.role === 'admin') {
      this.callMSG();
    }
    router.events.subscribe((val) => {
      // console.log(location.path());
      if (location.path() === '/dashboard/profile-admin' || location.path() === '/tables/datatable' || location.path() === '/apps/email'
      || location.path() === '/tables/ads') {
        this.isAdmin = true;
        this.isUser = false;
      } else {
        this.isAdmin = false;
        this.isUser = true;
      }
    });
  }

  // This is for Notifications
  notifications: Object[] = [
    {
      btn: 'btn-danger',
      icon: 'ti-link',
      title: 'Luanch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    },
    {
      btn: 'btn-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    },
    {
      btn: 'btn-info',
      icon: 'ti-settings',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    },
    {
      btn: 'btn-primary',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];
  // This is for Mymessages
  mymessages: Object[] = [];
  reverseRes = [];

  callMSG() {
    this.auth.messages()
      .then(
        res => {
          res = res.reverse();
          localStorage.setItem('msgLength', res.length);
          for (let i = 0; i < res.length; i++) {
            if (res[i].user.gender === 'Male') {
              this.photo = 'assets/images/users/male-avatar.png';
            } else {
              this.photo = 'assets/images/users/female-avatar.png';
            }
            this.mymessages.push({
              useravatar: this.photo,
              status: 'online',
              from: res[i].user.name + ' ' + res[i].user.surname,
              subject: res[i].title,
              time: this.pipe.transform(res[i].time, 'fullDate'),
              length: res.length,
            });
          }
        },
        error => console.log(error));
  }
  logout() {
    window.localStorage.clear();
    document.location.href = '/#/signup2';
  }

  inbox() {
    document.location.href = '/#/apps/email';
  }

  redirectProfile() {
    this.profileService.navigate('something');
    document.location.href = '/#/profile';
    // document.getElementById('myProfile').click();
  }

  inviteFriend(invite) {
    this.modalService.open(invite).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  inviteFunction() {
    const inviteJson = {
      'email': this.inviteEmail,
    };

    this.auth.invite(inviteJson)
      .then(
        res => {
          if (res.success) {
            document.getElementById('closeModal').click();
            this.profileService.navigate1('something');
            this.inviteEmail = '';
          }
        },
        error => {
          document.getElementById('closeModal').click();
          this.profileService.navigate2('something');
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

  ngAfterViewInit() { }
}
