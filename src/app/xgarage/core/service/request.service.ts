import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../../common/generic/genericservice';
import { config } from 'src/app/config';
import { BehaviorSubject, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RequestService extends GenericService<Request> {
    constructor(protected http: HttpClient) {
        super(http, config.coreApiUrl + '/request');
    }

    public getByJob(jobId: number){
        return this.http.get<Request[]>(this.apiServerUrl + '/job/' + jobId);
    }

    part: BehaviorSubject<any> = new BehaviorSubject({});
}
