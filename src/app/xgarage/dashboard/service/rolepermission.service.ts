import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RolePermission } from '../../common/model/rolepermission';

@Injectable({providedIn: 'root'})
export class RolePermissionService {

    constructor(private http: HttpClient) { }

    getRolePermissions() {
        return this.http.get<any>('assets/demo/data/role-permission.json')
            .toPromise()
            .then(res => res.data as RolePermission[])
            .then(data => data);
    }

}
