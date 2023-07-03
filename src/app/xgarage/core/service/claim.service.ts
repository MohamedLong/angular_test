import { MessageResponse } from '../../common/dto/messageresponse';
import { Claim } from '../model/claim';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from '../../common/generic/genericservice';
import { ClaimDto } from '../dto/claimdto';
import { BidDto } from '../dto/biddto';
import { Part } from '../model/part';


@Injectable({
    providedIn: 'root'
})
export class ClaimService extends GenericService<Claim>{

    constructor(http: HttpClient) {
        super(http, config.coreApiUrl + '/claim');
    }


    getByTenant(tenantId: number) {
        return this.http.get<ClaimDto[]>(config.coreApiUrl + '/claim/tenant/' + tenantId);
    }

    getClaimsByTenant(page?: number) {
        let endpoint = page? `/claim/tenant?pageNo=${page}&pageSize=100` : '/claim/tenant';
        return this.http.get<ClaimDto[]>(config.coreApiUrl + '/claim/tenant?pageNo=0&pageSize=150');
    }

    getClaimTicks() {
        return this.http.get<any[]>(config.coreApiUrl + '/claimTicks/all');
    }

    getClaimPartList() {
        return this.http.get<any[]>(config.coreApiUrl + '/claimPartList/list');
    }

    saveClaimParts(parts: any) {
        return this.http.post<MessageResponse>(config.coreApiUrl + '/claimParts/saveAll', parts);
    }

    getClaimParts(id: number) {
        return this.http.get<any>(config.coreApiUrl + '/claimParts/claim/' + id);
    }

    updateClaim(claim: any) {
        return this.http.put<any>(config.coreApiUrl + '/claim/updateClaim', claim);
    }

    saveClaimBid(bid: any) {
        return this.http.post<any>(config.coreApiUrl + '/claimBid/saveAll', bid);
    }

    getClaimBids() {
        return this.http.get<any>(config.coreApiUrl + '/claim/tenantSupplier');
    }

    getClaimBidByBidId(id:  number) {
        return this.http.get<BidDto[]>(config.coreApiUrl + '/claimBid/bid/' + id);
    }

    deleteClaimPartByPartId(id: number) {
        return this.http.delete<any>(config.coreApiUrl + '/claimParts/delete/' + id);
    }

    saveClaimPart(body: {claim: {id: number}, part: Part}) {
        return this.http.post<any>(config.coreApiUrl + '/claimParts/save', body);
    }

    saveClaim(body) {
        return this.http.post<any>(config.coreApiUrl + '/claim/saveClaim', body);
    }

    getClaimOrders() {
        return this.http.get<any[]>(config.storeApiUrl + '/orders/claim/tenant');
    }

}
