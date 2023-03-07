import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../../common/generic/genericservice';
import { config } from 'src/app/config';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { MessageResponse } from '../../common/dto/messageresponse';

@Injectable({
    providedIn: 'root'
})
export class RequestService extends GenericService<any> {
    constructor(protected http: HttpClient) {
        super(http, config.coreApiUrl + '/request');
    }

    public getByJob(jobId: number){
        return this.http.get<any[]>(this.apiServerUrl + '/job/' + jobId);
    }

    cancelRequest(requestId: number) {
        return this.http.get<MessageResponse>(this.apiServerUrl + '/cancelRequest/' + requestId);
    }

    setSupplierNotInterested(requestId: number){
        return this.http.post<MessageResponse>(this.apiServerUrl + '/supplierNotInterested/' + requestId, null);
    }

    getNotInterestedSuppliers(requestId: number) {
        return this.http.get<any>(this.apiServerUrl + '/notInterestedSuppliers/' + requestId);
    }

    part: BehaviorSubject<any> = new BehaviorSubject({});
}
