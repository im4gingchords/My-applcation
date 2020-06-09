import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKNED_URL = environment.apiUrl + '/user/';

@Injectable({providedIn: 'root'})
export class Authservice {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private isUserPresent: boolean;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  isPresent(){
    return this.isUserPresent;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string){
     const authData: AuthData = {email, password};
     return this.http.post(BACKNED_URL + 'signup', authData)
     .subscribe(() => {
       // tslint:disable-next-line: no-unused-expression
       this.router.navigate(['/']);
     }, error => {
       this.authStatusListener.next(false);
     });
  }

  login(email: string, password: string){
    const authData: AuthData = {email, password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKNED_URL + 'login', authData)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      console.log(token);
      if (token){
      const expiresInDuration = response.expiresIn;
      this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.userId = response.userId;
      this.isUserPresent = true;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      this.setAuthData(token, expirationDate, this.userId);
      console.log(expirationDate);
      this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser() {

    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const isInFuture = authInformation.expirationDate.getTime() - now.getTime();
    console.log(authInformation, isInFuture);
    if (isInFuture > 0){
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.setAuthTimer(isInFuture/ 1000);
      this.authStatusListener.next(true);

    }

  }

  logout() {

    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);


  }

  private setAuthTimer(duration: number){
    console.log("Setting timer" + duration);
    this.tokenTimer =  setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private setAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate){
      return;
    }

    return{
      token,
      expirationDate: new Date(expirationDate),
      userId
    }
  }
}
