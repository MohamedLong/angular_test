import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MessageResponse } from '../dto/messageresponse';

@Injectable()
export abstract class GenericService<T> {


    protected apiServerUrl: string;

    constructor(protected http: HttpClient, routerDir: string){
        this.apiServerUrl = routerDir;
    }

    public getAll() {
        return this.http.get<T[]>(this.apiServerUrl + '/all');
    }

    public getAllForUser() {
        return this.http.get<T[]>(this.apiServerUrl + '/user/all');
    }

    public getForUser() {
        return this.http.get<T[]>(this.apiServerUrl + '/user');
    }

    public getById(entityId: number) {
        return this.http.get<T>(this.apiServerUrl + '/' + entityId);
    }

    public add(t: T): Observable<T> {
        return this.http.post<T>(this.apiServerUrl + '/save', t);
    }

    public update(t: T): Observable<T> {
        return this.http.put<T>(this.apiServerUrl + '/update', t);
    }

    public delete(entityId: number): Observable<MessageResponse> {
        return this.http.delete<MessageResponse>(this.apiServerUrl + '/delete/' + entityId);
    }

    public getByParent(parentId: number){
        return this.http.get<T[]>(this.apiServerUrl + '/parent/' + parentId);
    }

}
