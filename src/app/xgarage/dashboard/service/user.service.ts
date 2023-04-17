import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { User } from '../../common/model/user';
import { UserDto } from '../../common/dto/userdto';
import { MessageResponse } from '../../common/dto/messageresponse';

@Injectable({providedIn: 'root'})
export class UserService {

  params: HttpParams;
  headers: HttpHeaders;

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<UserDto[]>(config.apiUrl + '/user/all')
      .toPromise()
      .then(res => res as UserDto[])
      .then(data => data);
  }

  getUserById(userId: number) {
    return this.http.get<User>(config.apiUrl + '/user/id/' + userId);
  }

  changeStatus(userId: number) {
    return this.http.get<User>(config.apiUrl + '/user/change-status/' + userId)
      .toPromise()
      .then(res => res as User);
  }

  changeEnableStatus(userId: number, status: boolean) {
    return this.http.put<MessageResponse>(config.apiUrl + '/user/enable/' + userId + '/' + status, null);
  }

  changeActivateStatus(userId: number, status: boolean) {
    return this.http.put<MessageResponse>(config.apiUrl + '/user/activate/' + userId + '/' + status, null);
  }

  saveUser(user: User) {
    return this.http.post<User>(config.apiUrl + '/user/save/', user);
  }

  saveNewUser(user: User) {
    return this.http.post<User>(config.apiUrl + '/web/signup', user);
  }

  updateUser(user: User) {
    return this.http.put<User>(config.apiUrl + '/web/user/update', user);
  }

  deleteUser(userId: number) {
    return this.http.delete<MessageResponse>(config.apiUrl + '/user/delete/' + userId);
  }

  changeUserRole(userId: number, roleName: string) {
    return this.http.post<MessageResponse>(config.apiUrl + '/changeUserRole/' + userId + '/' + roleName, null);
  }

  // changePassword(user : {userId: string, oldPass: string, newPass: string}) {
  //   this.params = new HttpParams()
  //     .set("oldPass", user.oldPass)
  //     .set("newPass", user.newPass);
  //     this.headers = new HttpHeaders()
  //     .set("Content-Type", "application/x-www-form-urlencoded");
  //     return this.http.post<any>(config.apiUrl + '/user/resetPassword/' + user.userId, null,
  //     { headers: this.headers, params: this.params })
  //     .pipe(
  //       tap(),
  //       mapTo(true),
  //       catchError(error => {
  //         alert(error.error);
  //         return of(false);
  //       }));
  // }

  changePassword(body: any) {
   // console.log('inside userService: ', body);
    return this.http.post<MessageResponse>(config.apiUrl + '/changePassword', body);
  };

}
