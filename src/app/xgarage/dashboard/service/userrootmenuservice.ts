import { HttpClient } from '@angular/common/http';
import { UserRootMenuDto } from '../dto/userrootmenudto';
import { UserRootMenu } from '../model/userrootmenu';
import { config } from 'src/app/config';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class UserRootMenuService {

    constructor(private http: HttpClient) { }

    getUserRootMenus() {
        return this.http.get<UserRootMenu[]>(config.dashboardUrl + '/userRootMenu/all')
            .toPromise()
            .then(res => res as UserRootMenu[])
            .then(data => data);
    }

    getUserRootMenusByRoleId(id:number) {
        return this.http.get<UserRootMenuDto[]>(config.dashboardUrl + '/userRootMenu/role/' + id)
            .toPromise()
            .then(res => res as UserRootMenuDto[])
            .then(data => data);
    }

}
