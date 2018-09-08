import { Injectable } from '@angular/core';
import {
  // HttpClientModule,
  HttpClient,
  HttpHeaders,
  // HttpParams
} from '@angular/common/http';
import { stringify } from 'querystring';

// import { RequestOptions } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
// import { map } from 'rxjs/operators/map';
// import { Router } from '@angular/router';

interface TokenResponse {
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  name: string;
  surname: string;
  gender: string;
  dateOfBirth: Date;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient) { }

  public messages() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get('http://151.236.38.205:3000/api/messages', httpOptions).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  public posts(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get('http://151.236.38.205:3000/api/getPostsByUserId/' + id, httpOptions).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  public bacheca() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get('http://151.236.38.205:3000/api/allposts/', httpOptions).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  public images(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get('http://151.236.38.205:3000/api/images/' + id, httpOptions).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  public login(payload) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post('http://151.236.38.205:3000/api/login', JSON.stringify(payload), httpOptions).toPromise()
      .then(res => this.extractDataWithAuth(res))
      .catch(this.handleErrorPromise);
  }

  private saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.token = token;
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('token');
  }

  public signup(payload) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post('http://151.236.38.205:3000/api/register', JSON.stringify(payload), httpOptions).toPromise()
      .then(res => this.extractDataWithAuth(res))
      .catch(this.handleErrorPromise);
  }

  public changeRole(payload) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.put('http://151.236.38.205:3000/api/updateRole', JSON.stringify(payload), httpOptions).toPromise()
      .then(res => this.extractData(res))
      .catch(this.handleErrorPromise);
  }

  public activate(token: string) {
    return this.http.put('http://151.236.38.205:3000/api/activate/' + token, '').toPromise()
      .then(res => this.extractData(res))
      .catch(this.handleErrorPromise);
  }

  //   postFile(fileToUpload: File): Observable<boolean> {
  //     const endpoint = 'your-destination-url';
  //     const formData: FormData = new FormData();
  //     formData.append('fileKey', fileToUpload, fileToUpload.name);
  //     return this.httpClient
  //       .post(endpoint, formData, { headers: yourHeadersConfig })
  //       .map(() => { return true; })
  //       .catch((e) => this.handleError(e));
  // }

  public postFile(fileToUpload: File) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http.post('http://151.236.38.205:3000/api/upload', formData, httpOptions).toPromise()
      .then(res => this.extractData(res))
      .catch(this.handleErrorPromise);
  }

  public adsFile(payload, id) {
    const jsonAds = {'adsid' : String(id), 'path': payload, 'id' : String(id)};
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      })
    };
    return this.http.post('http://151.236.38.205:3000/api/ads', JSON.stringify(jsonAds), httpOptions).toPromise()
      .then(res => this.extractData(res))
      .catch(this.handleErrorPromise);
  }

  public getAds() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get('http://151.236.38.205:3000/api/ads', httpOptions).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  public editAds(adsID, payload, id) {
    const jsonAds = {'adsid' : String(adsID), 'path': payload, 'id' : String(adsID)};
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      })
    };
    return this.http.put('http://151.236.38.205:3000/api/adsEdit/' + id, JSON.stringify(jsonAds), httpOptions).toPromise()
      .then(res => this.extractData(res))
      .catch(this.handleErrorPromise);
  }

  public activatePro(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      })
    };
    return this.http.put('http://151.236.38.205:3000/api/activatePro/' + id, '', httpOptions).toPromise()
      .then(res => this.extractData(res))
      .catch(this.handleErrorPromise);
  }

  public proExperiences(payload) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.put('http://151.236.38.205:3000/api/userExperiences', JSON.stringify(payload), httpOptions).toPromise()
      .then(res => this.extractData(res))
      .catch(this.handleErrorPromise);
  }

  public createExperiences(payload) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post('http://151.236.38.205:3000/api/createExperiences', JSON.stringify(payload), httpOptions).toPromise()
      .then(res => this.extractData(res))
      .catch(this.handleErrorPromise);
  }

  private extractDataWithAuth(res) {
    this.saveToken(res.token);
    return res || {};
  }

  private extractData(res) {
    return res || {};
  }

  private handleErrorPromise(error: Response | any) {
    console.error(error.message || error);
    return Promise.reject(error.message || error);
  }

  public users() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get('http://151.236.38.205:3000/api/users', httpOptions).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  public invite(payload) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post('http://151.236.38.205:3000/api/invite', JSON.stringify(payload), httpOptions).toPromise()
      .then(res => this.extractData(res))
      .catch(this.handleErrorPromise);
  }
}
