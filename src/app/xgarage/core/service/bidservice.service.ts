import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../../common/generic/genericservice';
import { config } from 'src/app/config';
import { BidDto } from '../dto/biddto';
import { MultipleBids} from '../dto/multiplebids';
import { BidOrderDto } from '../dto/bidorderdto';
import { MessageResponse } from '../../common/dto/messageresponse';

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
        return this.http.post(this.apiServerUrl + '/cancelBid/' + bidId, {"comments": null});
    }

    approveMultipleBids(bidOrderDto: BidOrderDto) {
        return this.http.post(this.apiServerUrl + '/approveBid/multiple', bidOrderDto);
    }

    approveBidByBidId(reqId: number, bidId: number) {
        return this.http.post(this.apiServerUrl + '/approveBid/' + reqId + '/' + bidId, '');
    }

    approveBid(bidOrderDto: BidOrderDto) {
        return this.http.post(this.apiServerUrl + '/approveBid', bidOrderDto);
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

    changeClaimOrderStatus(bidId: any, status: string){

        if(status == 'cancel') {
            return this.cancelClaimOrderBySupplier(bidId);
        }
        if(status == 'accept') {
            console.log(bidId)
            return this.acceptClaimOrder(bidId);
        }
        if(status == 'complete') {
            return this.completeClaimOrder(bidId);
        }
        return null;
    }

    cancelClaimOrderBySupplier(bidId: any) {
        return this.http.post<MessageResponse>(this.apiServerUrl + '/cancelBid/' + bidId, null);
    }

    acceptClaimOrder(bidId: any) {
        console.log(bidId)
        return this.http.post<MessageResponse>(this.apiServerUrl + '/acceptBid/' + bidId, null);
    }

    completeClaimOrder(bidId: any) {
        return this.http.post<MessageResponse>(this.apiServerUrl + '/completeBid/' + bidId, null);
    }
}
