import { catchError, mapTo, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { User } from '../../common/model/user';
import { DeleteMessage } from '../model/deleteMessage';
import { of } from 'rxjs';

@Injectable()
export class UserService {

  params: HttpParams;
  headers: HttpHeaders;
  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<User[]>(`${config.apiUrl}/v1/user/all`)
      .toPromise()
      .then(res => res as User[])
      .then(data => data);
  }

  changeStatus(userId: number) {
    return this.http.get<User>(`${config.apiUrl}/v1/user/change-status/${userId}`)
      .toPromise()
      .then(res => res as User);
  }

  saveUser(user: User) {
    return this.http.post<User>(`${config.apiUrl}/v1/user/save/1`, user)
  }

  updateUser(user: User) {
    return this.http.put<User>(`${config.apiUrl}/v1/user/update/1`, user)
  }

  deleteUser(userId: number) {
    return this.http.delete<DeleteMessage>('${config.apiUrl}/v1/user/delete/${userId}');
  }

  assignRoleToUSer(userId: number, roleId: number) {
    return this.http.get<DeleteMessage>(`${config.apiUrl}/v1/user/assignRole/${userId}/${roleId}`);
  }

  changePassword(user : {userId: string, oldPass: string, newPass: string}) {
    this.params = new HttpParams()
      .set("oldPass", user.oldPass)
      .set("newPass", user.newPass);
      this.headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded");
      return this.http.post<any>(`${config.apiUrl}/user/resetPassword/${user.userId}`, null,
      { headers: this.headers, params: this.params })
      .pipe(
        tap(),
        mapTo(true),
        catchError(error => {
          alert(error.error);
          return of(false);
        }));

  }
}