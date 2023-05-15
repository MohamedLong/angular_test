import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../../common/generic/genericservice';
import { config } from 'src/app/config';
import { BidDto } from '../dto/biddto';
import { MultipleBids} from '../dto/multiplebids';
import { BidOrderDto } from '../dto/bidorderdto';

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
        return this.http.get<BidDto[]>(this.apiServerUrl + '/order/' + orderId);
    }

    cancelBid(bidId: number){
        return this.http.post(this.apiServerUrl + '/cancelBid/' + bidId, {"comments": ""});
    }

    approveMultipleBids(bidOrderDto: BidOrderDto) {
        return this.http.post(this.apiServerUrl + '/approveBid/multiple', bidOrderDto);
    }

    approveBidByBidId(reqId: number, bidId: number) {
        return this.http.post(this.apiServerUrl + '/approveBid/' + reqId + '/' + bidId, '');
    }

    rejectBidByBidId(reqId: number, bidId: number) {
        return this.http.post(this.apiServerUrl + '/rejectBid/' + reqId + '/' + bidId, null);
    }

    rejectMutltipleBids(bidList: MultipleBids) {
        return this.http.post(this.apiServerUrl + '/rejectBid/multiple', bidList);
    }

    getBidsByClaim(id: number) {
        return this.http.get<BidDto[]>(this.apiServerUrl + '/claim/' + id);
    }
}
