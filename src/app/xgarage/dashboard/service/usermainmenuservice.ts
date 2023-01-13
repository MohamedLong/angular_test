import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { DeleteMessage } from '../model/deleteMessage';
import { UserMainMenu } from '../model/usermainmenu';

@Injectable()
export class UserMainMenuService {

    constructor(private http: HttpClient) { }

    getUserMainMenus() {
        return this.http.get<UserMainMenu[]>(`${config.dashboardUrl}/userMainMenu/all`)
            .toPromise()
            .then(res => res as UserMainMenu[])
            .then(data => data);
    }

    getUserMainMenusByRoleId(id:number) {
        return this.http.get<UserMainMenu[]>(`${config.dashboardUrl}/userMainMenu/role/id/${id}`)
            .toPromise()
            .then(res => res as UserMainMenu[])
            .then(data => data);
    }

    saveUserMainMenu(usermainmenu: UserMainMenu) {
        return this.http.post<UserMainMenu>(`${config.dashboardUrl}/userMainMenu/save`,usermainmenu)
    }

    updateUserMainMenu(usermainmenu: UserMainMenu) {
        return this.http.put<UserMainMenu>(`${config.dashboardUrl}/userMainMenu/update`,usermainmenu)
    }

    deleteUserMainMenu(usermainmenuId: number) {
        return this.http.delete<DeleteMessage>(`${config.dashboardUrl}/userMainMenu/delete/${usermainmenuId}`)
    }

}
