import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { MessageResponse } from '../../common/dto/messageresponse';
import { UserSubMenu } from '../model/usersubmenu';

@Injectable()
export class UserSubMenuService {

    constructor(private http: HttpClient) { }

    getUserSubMenus() {
        return this.http.get<UserSubMenu[]>(`${config.dashboardUrl}/userSubMenu/all`)
            .toPromise()
            .then(res => res as UserSubMenu[])
            .then(data => data);
    }

    getUserSubMenusByRoleId(id:number) {
      return this.http.get<UserSubMenu[]>(config.dashboardUrl + '/userSubMenu/role/' + id)
          .toPromise()
          .then(res => res as UserSubMenu[])
          .then(data => data);
  }

    saveUserSubMenu(usersubmenu: UserSubMenu) {
        return this.http.post<UserSubMenu>(`${config.dashboardUrl}/userSubMenu/save`,usersubmenu)
    }

    updateUserSubMenu(usersubmenu: UserSubMenu) {
        return this.http.put<UserSubMenu>(`${config.dashboardUrl}/userSubMenu/update`,usersubmenu)
    }

    deleteUserSubMenu(usersubmenuId: number) {
        return this.http.delete<MessageResponse>(`${config.dashboardUrl}/userSubMenu/delete/${usersubmenuId}`)
    }

}
