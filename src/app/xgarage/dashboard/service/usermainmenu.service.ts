import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { MessageResponse } from '../../common/dto/messageresponse';
import { UserMainMenu } from '../model/usermainmenu';
import { UserMainMenuDto } from '../dto/usermainmenudto';

@Injectable({providedIn: 'root'})
export class UserMainMenuService {

    constructor(private http: HttpClient) { }

    getUserMainMenus() {
        return this.http.get<UserMainMenu[]>(`${config.dashboardUrl}/userMainMenu/all`)
            .toPromise()
            .then(res => res as UserMainMenu[])
            .then(data => data);
    }

    getUserMainMenusByRoleId(id:number) {
        return this.http.get<UserMainMenuDto[]>(`${config.dashboardUrl}/userMainMenu/role/${id}`)
            .toPromise()
            .then(res => res as UserMainMenuDto[])
            .then(data => data);
    }

    saveUserMainMenu(usermainmenu: any) {
        return this.http.post<UserMainMenu>(`${config.dashboardUrl}/userMainMenu/save`, usermainmenu);
    }

    updateUserMainMenu(usermainmenu: any) {
        return this.http.put<UserMainMenu>(`${config.dashboardUrl}/userMainMenu/update`, usermainmenu);
    }

    deleteUserMainMenu(usermainmenuId: number) {
        return this.http.delete<MessageResponse>(`${config.dashboardUrl}/userMainMenu/delete/${usermainmenuId}`);
    }

}
