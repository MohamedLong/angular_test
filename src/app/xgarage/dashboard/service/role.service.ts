import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { MessageResponse } from '../../common/dto/messageresponse';
import { Role } from '../../common/model/role';

@Injectable({providedIn: 'root'})
export class RoleService {

    constructor(private http: HttpClient) { }

    getRoles() {
        return this.http.get<Role[]>(`${config.apiUrl}/v1/role/all`)
            .toPromise()
            .then(res => res as Role[])
            .then(data => data);
    }

    saveRole(role: Role) {
        return this.http.post<Role>(`${config.apiUrl}/v1/role/save`, role);
    }

    updateRole(role: Role) {
        return this.http.put<Role>(`${config.apiUrl}/v1/role/update`, role);
    }

    deleteRole(roleId: number) {
        return this.http.delete<MessageResponse>(`${config.apiUrl}/v1/role/delete/${roleId}`);
    }

}
