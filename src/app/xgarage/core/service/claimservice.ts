import { MessageResponse } from './../../common/dto/messageresponse';
import { Claim } from './../model/claim';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from '../../common/generic/genericservice';
import { ClaimDto } from '../dto/claimdto';


@Injectable({
    providedIn: 'root'
})
export class ClaimService extends GenericService<Claim>{

    constructor(http: HttpClient){
        super(http, config.coreApiUrl + '/claim');
    }

    
    public getByTenant(tenantId: number){
        return this.http.get<ClaimDto[]>(config.coreApiUrl + '/claim/tenant/' + tenantId);
    }

    cancel(id: number) {
        return this.http.post<MessageResponse>(config.coreApiUrl + '/claim/cancel/' + id, null);
      }
}