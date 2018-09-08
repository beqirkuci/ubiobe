import { Injectable } from '@angular/core';
import { AuthenticationService, LoginPayload } from '../../services/authentication.service';

import { Message } from './message';
import { DatePipe } from '@angular/common';

@Injectable()
export class MailService {
  Jsonres = [];
  photo = '';
  pipe = new DatePipe('it-IT');
  experiences = [];

  constructor(private auth: AuthenticationService) {
    if (localStorage.getItem('role') !== 'admin') {
      this.logout();
    }
    this.callMSG();
  }
  callMSG() {
    this.auth.messages()
      .then(
        res => {
          for (let i = 0; i < res.length; i++) {
            if (res[i].user.gender === 'Male') {
              this.photo = 'assets/images/users/male-avatar.png';
            } else {
              this.photo = 'assets/images/users/female-avatar.png';
            }
            this.experiences = [];
            for (let j = 0; j < res[i].experiences.length; j++) {
              const to = res[i].experiences[j].to ? res[i].experiences[j].to.toString().substring(0, 10) : null;
              this.experiences.push({
                _id: res[i].experiences[j]._id,
                from: res[i].experiences[j].from.toString().substring(0, 10),
                fromFormatted: this.pipe.transform(res[i].experiences[j].from, 'mediumDate'),
                to: to,
                toFormatted: this.pipe.transform(to, 'mediumDate'),
                workHere: res[i].experiences[j].workHere,
                experience: res[i].experiences[j].experience,
                path: res[i].experiences[j].path,
                user_id: res[i].experiences[j].user_id
              });
            }
            this.Jsonres.push({
              from: res[i].user.name + ' ' + res[i].user.surname,
              email: res[i].user.email,
              date: ' ' + res[i].time,
              subject: res[i].title,
              avatar: this.photo,
              icon: 'group',
              iconClass: 'mat-text-primary',
              body: res[i].content,
              experiences : this.experiences,
              tag: res[i].user.permission,
              type: res[i].user.permission,
              important: true,
              permission: res[i].user.permission,
              gender: res[i].user.gender,
              id: 1,
              idMSG: res[i].user_id,
            });
          }
        },
        error => console.log(error));
  }
  getMessages(): Promise<Message[]> {
    return Promise.resolve(this.Jsonres);
  }

  logout() {
    window.localStorage.clear();
    document.location.href = '/#/signup2';
  }
}
