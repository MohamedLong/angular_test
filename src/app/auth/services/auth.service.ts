import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { Tokens } from '../models/tokens';
import jwt_decode from "jwt-decode";
import { config } from 'src/app/config';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: string;
  private apiUrl = config.apiUrl;



  constructor(private http: HttpClient) {}
  params: HttpParams;
  headers: HttpHeaders;

  signup(body: { firstName: string, lasttName: string, phone: string, password: string, email: string, tenant: {id: number} }) {
    return this.http.post(this.apiUrl + '/web/signup', body).pipe(
        tap((tokens: Tokens) => {
            this.storeTokens(tokens);
        }),
        mapTo(true),
        catchError(error => {
            console.log('error:', error)
            return of(false);
        })
    )
};

  login(user: { username: string, password: string }): Observable<boolean> {
    this.params = new HttpParams()
      .set("username", user.username)
      .set("password", user.password);
    this.headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post<any>(this.apiUrl + '/login',null,
          {headers: this.headers, params: this.params})
      .pipe(
        tap(tokens => {this.doLoginUser(user.username, tokens)}),
        mapTo(true),
        catchError(error => {
          alert(error.error);
          return of(false);
        }));
  }

  logout() {
    return this.http.post<any>(this.apiUrl + '/logout', {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      }));
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    return this.http.post<any>(this.apiUrl + '/refresh', {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeJwtToken(tokens.access_token);
    }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  decoded:any;
  user:any;
  private doLoginUser(username: string, tokens: Tokens) {
    this.storeTokens(tokens);
    this.loggedUser = username;
  }

  doStoreUser(token: string, router: Router){
    this.decoded = jwt_decode(token);
    this.http.get<any>(this.apiUrl + '/user')
    .subscribe(
        {
          next: (data) => {
            this.storeUser(JSON.stringify(data));
            router.navigate(['', 1]);
          },
          error: (e) => {
            console.log("error : " + e.message);
            alert(e);
          }
        }
      );
  }

  public doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
    this.removeUserFromStore();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeUser(user:any) {
    localStorage.setItem('user', user);
  }

  public getStoredUser(){
    return localStorage.getItem('user');
  }

  private storeTokens(tokens: Tokens){
    localStorage.setItem(this.JWT_TOKEN, tokens.access_token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refresh_token);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  private removeUserFromStore() {
    localStorage.removeItem('user');
  }

  changePassword(body: any) {
    let user = this.getStoredUser();
    let userEmail = JSON.parse(user).email;
    return this.http.post(this.apiUrl + '/recoverPassword/' + userEmail, body).pipe(
        tap(res => {
            return res;
        }),
        mapTo(true),
        catchError(error => {
            console.log('error:', error)
            return of(false);
        })
    )
};
}
