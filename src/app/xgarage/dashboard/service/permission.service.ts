import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { Permission } from '../../common/model/permission';

@Injectable({providedIn: 'root'})
export class PermissionService {

    constructor(private http: HttpClient) { }

    getPermissions() {
        return this.http.get<Permission[]>(`${config.apiUrl}/v1/permission/all`)
            .toPromise()
            .then(res => res as Permission[])
            .then(data => data);
    }

    getRolePermissions(roleId: number) {
      return this.http.get<Permission[]>(`${config.apiUrl}/v1/role/${roleId}`)
          .toPromise()
          .then(res => res as Permission[])
          .then(data => data);
  }

    savePermission(permission: Permission) {
        return this.http.post<Permission>(`${config.apiUrl}/v1/permission/save`, permission);
    }

    updatePermission(permission: Permission) {
        return this.http.put<Permission>(`${config.apiUrl}/v1/permission/update`, permission);
    }

    deletePermission(permissionId: number) {
        return this.http.delete<{status: string}>(`${config.apiUrl}/v1/permission/delete/${permissionId}`);
    }

}
