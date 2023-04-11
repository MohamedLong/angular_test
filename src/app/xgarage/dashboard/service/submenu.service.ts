import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { SubMenu } from '../model/submenu';

@Injectable({providedIn: 'root'})
export class SubMenuService {

    constructor(private http: HttpClient) { }

    getSubMenusByModule(id: number) {
        return this.http.get<SubMenu[]>(config.dashboardUrl + '/subMenu/main/' + id)
            .toPromise()
            .then(res => res as SubMenu[])
            .then(data => data);
    }

}
