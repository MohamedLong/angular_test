import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDto } from '../dto/responsedto';
import { User } from '../model/user';
import { config } from '../../../config';

@Injectable()
export class UserService {
    
    private apiServerUrl = config.apiUrl + '/v1/User';

    constructor(private http: HttpClient) { }

    public getUsers() {
        return this.http.get<User[]>(this.apiServerUrl + '/all');
    }

    public getUserById(userId: number) {
        return this.http.get<User>(this.apiServerUrl + '/id/' + userId);
    }

    public getUserByName(username: string) {
        return this.http.get<User>(this.apiServerUrl + '/name/' + username);
    }

    public getUsersByTenant(tenantId: number) {
        return this.http.get<User[]>(this.apiServerUrl + '/tenant/' + tenantId);
    }

    public addUser(user: User, tenantId: number): Observable<User> {
        return this.http.post<User>(this.apiServerUrl + '/save/' + tenantId, user);
    }
    
    public assignRoleToUser(userId: number, roleId: number){
        this.http.get<void>(this.apiServerUrl + '/assignRole/' + userId + '/' + roleId);
    }

    public revokeRoleFromUser(userId: number, roleId: number){
        this.http.get<void>(this.apiServerUrl + '/revokeRole/' + userId + '/' + roleId);
    }

    public updateUser(user: User, companyId: number): Observable<User> {
        return this.http.put<User>(this.apiServerUrl + '/update/' + companyId, user);
    }
    
    public deleteUser(userId: number): Observable<ResponseDto> {
        return this.http.delete<ResponseDto>(this.apiServerUrl + '/delete/' + userId);
    } 

}