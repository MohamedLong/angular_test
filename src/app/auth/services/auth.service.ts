import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { of, Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { Tokens } from '../models/tokens';
import jwt_decode from "jwt-decode";
import { config } from 'src/app/config';
import { UserSubMenuService } from 'src/app/xgarage/dashboard/service/usersubmenu.service';
import { User } from 'src/app/xgarage/common/model/user';
import { MessageResponse } from 'src/app/xgarage/common/dto/messageresponse';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly JWT_TOKEN = 'JWT_TOKEN';
    private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
    private loggedUser: string;
    private apiUrl = config.apiUrl;
    subs = new BehaviorSubject<any>('');


    constructor(private http: HttpClient, private usersubmenuservice: UserSubMenuService, private router: Router) { }
    params: HttpParams;
    headers: HttpHeaders;

    signup(user: User) {
        return this.http.post<MessageResponse>(this.apiUrl + '/web/signup', user);
    };

    newSignup(user: User): Observable<number> {
        return this.http.post<number>(this.apiUrl + '/web/signup', user).pipe(
            map(response => response as number)
        );
    };

    login(user: { username: string, password: string }): Observable<any> {
        this.params = new HttpParams()
            .set("username", user.username)
            .set("password", user.password);
        this.headers = new HttpHeaders()
            .set("Content-Type", "application/x-www-form-urlencoded");
        return this.http.post<any>(this.apiUrl + '/login', null,
            { headers: this.headers, params: this.params })
            .pipe(
                tap(tokens => { this.doLoginUser(user.username, tokens) }),
                mapTo(true),
                catchError(error => {
                    return throwError(error.error);
                }));
    }

    logout() {
        return this.http.post<any>(this.apiUrl + '/logout', {
            'refreshToken': this.getRefreshToken()
        }).pipe(
            tap(() => this.doLogoutUser()),
            mapTo(true),
            catchError(error => {
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

    decoded: any;
    user: any;
    private doLoginUser(username: string, tokens: Tokens) {
        this.storeTokens(tokens);
        this.loggedUser = username;
    }

    doStoreUser(token: string, router: Router, destination?: string) {
        this.decoded = jwt_decode(token);
        this.http.get<any>(this.apiUrl + '/user/info')
            .subscribe(
                {
                    next: (data) => {
                        this.storeUser(JSON.stringify(data));
                        this.getAuthorizedMenu();
                        if (destination) {
                            console.log("LINK OK");
                            router.navigateByUrl(destination);
                        } else {
                            console.log("NO LINK");
                            router.navigate(['']);
                        }
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
        this.removeAppData();
    }

    private getRefreshToken() {
        return localStorage.getItem(this.REFRESH_TOKEN);
    }

    private storeJwtToken(jwt: string) {
        localStorage.setItem(this.JWT_TOKEN, jwt);
    }

    private storeUser(user: any) {
        localStorage.setItem('user', user);
    }

    public getStoredUser() {
        return localStorage.getItem('user');
    }

    private storeTokens(tokens: Tokens) {
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

    private removeAppData() {
        localStorage.removeItem('job');
        localStorage.removeItem('order');
        localStorage.removeItem('orderData');
        localStorage.removeItem('jobId');
        localStorage.removeItem('subs');
        localStorage.removeItem('claim');
        localStorage.removeItem('claimId');
    }

    changePassword(body: any) {
        return this.http.post<MessageResponse>(this.apiUrl + '/changePassword/', body);
    };

    getAuthorizedMenu() {
        let userRole = JSON.parse(localStorage.getItem('user')).roles[0].id;
        this.usersubmenuservice.getUserSubMenusByRoleId(userRole).then(subs => {
            this.router.config.map(parent => {
                if (parent.children && parent.children.length > 0) {
                    parent.children.map(r => {
                        const filtered = subs.filter(sub => r.path === sub.subMenu.routerLink);
                        if (filtered && filtered.length > 0) {
                            r.data = { newAuth: filtered[0].newAuth, printAuth: filtered[0].printAuth, editAuth: filtered[0].editAuth, deleteAuth: filtered[0].deleteAuth, approveAuth: filtered[0].approveAuth, acceptAuth: filtered[0].acceptAuth, cancelAuth: filtered[0].cancelAuth, completeAuth: filtered[0].completeAuth, viewAuth: filtered[0].viewAuth}
                        } else {
                            r.data = { newAuth: false, printAuth: false, editAuth: false, deleteAuth: false, approveAuth: false, acceptAuth: false, cancelAuth: false, completeAuth: false, viewAuth: false}
                        }
                        return;
                    });
                }
                return parent;
            })
            this.router.resetConfig(this.router.config);
        });
    }

    getAuth() {
        let userRole = JSON.parse(localStorage.getItem('user')).roles[0].id;
        this.usersubmenuservice.getUserSubMenusByRoleId(userRole).then(subs => {
            localStorage.setItem('subs', JSON.stringify(subs));
        });
    }
}


