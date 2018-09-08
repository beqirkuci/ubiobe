import { Injectable } from '@angular/core';
import {
    // HttpClientModule,
    HttpClient,
    HttpHeaders,
    // HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export interface UserDetails {
    _id: string;
    profilePic: string;
    name: string;
    surname: string;
    nickname: string;
    gender: string;
    dateOfBirth: string;
    dateOfBirthFormatted: string;
    placeOfBirth: string;
    placeOfResidence: string;
    maritalStatus: string;
    profession: string;
    isEmailPrivate: boolean;
    email: string;
    email2: string;
    telMobile: number;
    telOffice: number;
    address: string;
    sharedMyData: boolean;
    private: boolean;
    height: number;
    weight: number;
    bmi: string;
    bmiDescription: string;
    permission: string;
    contact: string;
    experiences: [{
        _id: string,
        from: string,
        fromFormatted: string,
        to: string,
        toFormatted: string,
        workHere: boolean,
        title: string,
        experience: string,
        path: string,
        user_id: string
    }];
}

export interface PostObject {
    caption: string;
    text: string;
    image: string;
}

export interface TimelineObject {
    _id: string;
    title: string;
    content: string;
    time: string;
    image: string;
    createdAt: string;
    name: string;
    surname: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    constructor(private http: HttpClient) { }

    private _listners = new Subject<any>();
    private _listners1 = new Subject<any>();
    private _listners2 = new Subject<any>();
    private _listners3 = new Subject<any>();

    listen(): Observable<any> {
        return this._listners.asObservable();
    }

    navigate(filterBy: string) {
        this._listners.next(filterBy);
    }

    listen1(): Observable<any> {
        return this._listners1.asObservable();
    }

    navigate1(filterBy: string) {
        this._listners1.next(filterBy);
    }

    listen2(): Observable<any> {
        return this._listners2.asObservable();
    }

    navigate2(filterBy: string) {
        this._listners2.next(filterBy);
    }

    listen3(): Observable<any> {
        return this._listners3.asObservable();
    }

    navigate3(filterBy: string) {
        this._listners3.next(filterBy);
    }

    public profileData(id) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.get('http://151.236.38.205:3000/api/profile/' + id, httpOptions).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    public updateProfile(payload) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.put('http://151.236.38.205:3000/api/editUser', JSON.stringify(payload), httpOptions).toPromise()
            .then(res => this.extractData(res))
            .catch(this.handleErrorPromise);
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

    public editPost(payload) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            })
        };
        return this.http.put('http://151.236.38.205:3000/api/editPost', JSON.stringify(payload), httpOptions).toPromise()
            .then(res => this.extractData(res))
            .catch(this.handleErrorPromise);
    }

    public deletePost(id) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            })
        };
        return this.http.delete('http://151.236.38.205:3000/api/Post/' + id, httpOptions).toPromise()
            .then(res => this.extractData(res))
            .catch(this.handleErrorPromise);
    }

    public postData(payload) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.post('http://151.236.38.205:3000/api/addPost', JSON.stringify(payload), httpOptions).toPromise()
            .then(res => this.extractData(res))
            .catch(this.handleErrorPromise);
    }

    public like(payload) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.put('http://151.236.38.205:3000/api/like/' + payload, JSON.stringify(payload), httpOptions).toPromise()
            .then(res => this.extractData(res))
            .catch(this.handleErrorPromise);
    }

    public createTimeline(payload) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.post('http://151.236.38.205:3000/api/timeline', JSON.stringify(payload), httpOptions).toPromise()
            .then(res => this.extractData(res))
            .catch(this.handleErrorPromise);
    }

    public getTimeline(id) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.get('http://151.236.38.205:3000/api/timeline/' + id, httpOptions).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    public deleteTimeline(id) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            })
        };
        return this.http.delete('http://151.236.38.205:3000/api/deleteTimeline/' + id, httpOptions).toPromise()
            .then(res => this.extractData(res))
            .catch(this.handleErrorPromise);
    }

    public editTimeline(payload) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            })
        };
        return this.http.put('http://151.236.38.205:3000/api/timeline', JSON.stringify(payload), httpOptions).toPromise()
            .then(res => this.extractData(res))
            .catch(this.handleErrorPromise);
    }

    public shareData(id) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.post('http://151.236.38.205:3000/api/shareData/' + id, '', httpOptions).toPromise()
            .then(res => this.extractData(res))
            .catch(this.handleErrorPromise);
    }

    public addComment(id, payload) {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          })
        };
        return this.http.put('http://151.236.38.205:3000/api/comment/' + id, JSON.stringify(payload), httpOptions).toPromise()
          .then(res => this.extractData(res))
          .catch(this.handleErrorPromise);
      }

    private extractData(res) {
        return res || {};
    }

    private handleErrorPromise(error: Response | any) {
        console.error(error.message || error);
        return Promise.reject(error.message || error);
    }
}
