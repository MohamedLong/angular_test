import { MessageResponse } from '../../common/dto/messageresponse';
import { Claim } from '../model/claim';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from '../../common/generic/genericservice';
import { ClaimDto } from '../dto/claimdto';


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
        return this.http.put<MessageResponse>(config.coreApiUrl + '/claim/updateClaim', claim);
    }

    saveClaimBid(bid: any) {
        return this.http.post<any>(config.coreApiUrl + '/claimBid/saveAll', bid);
    }

    getClaimBids() {
        return this.http.get<any>(config.coreApiUrl + '/claimBid/all');
    }
}
