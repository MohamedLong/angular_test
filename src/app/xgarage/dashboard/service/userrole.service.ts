import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRole } from '../../common/model/userrole';

@Injectable()
export class UserRoleService {

    constructor(private http: HttpClient) { }

    getUserRoles() {
        return this.http.get<any>('assets/demo/data/user-role.json')
            .toPromise()
            .then(res => res.data as UserRole[])
            .then(data => data);
    }

}