import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../../common/generic/genericservice';
import { config } from 'src/app/config';
import { BidDto } from '../dto/biddto';

@Injectable({
    providedIn: 'root'
})
export class BidService extends GenericService<any> {
    constructor(protected http: HttpClient) {
        super(http, config.coreApiUrl + '/bid');
    }

    getByRequest(requestId: number){
        return this.http.get<BidDto[]>(this.apiServerUrl + '/request/' + requestId);
    }

    getByJob(jobId: number){
        return this.http.get<BidDto[]>(this.apiServerUrl + '/job/' + jobId);
    }

    getByOrder(orderId: number){
        return this.http.get<BidDto[]>(this.apiServerUrl + '/order/' + 342);
    }

    cancelBid(bidId: number){
        return this.http.post(this.apiServerUrl + '/cancelBid/' + bidId, {"comments": ""});
    }
}
