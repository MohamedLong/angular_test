import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { config } from "src/app/config";
import { MessageResponse } from "../dto/messageresponse";
import { GenericService } from "../generic/genericservice";
import { Tenant } from "../model/tenant";

@Injectable({
    providedIn: 'root'
})
export class TenantService extends GenericService<Tenant>{
    constructor(http: HttpClient) {
        super(http, config.apiUrl + '/v1/tenant');
    }

    public getTenantsByType(typeId: number) {
        return this.http.get<Tenant[]>(this.apiServerUrl + '/type/' + typeId);
    }

    changeEnableStatus(tenantId: number, status: boolean) {
        return this.http.put<MessageResponse>(config.apiUrl + '/tenant/enable/' + tenantId + '/' + status, null);
      }

}
