import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../generic/genericservice";
import { TenantType } from "../model/tenanttype";

@Injectable({
    providedIn: 'root'
})
export class TenantTypeService extends GenericService<TenantType>{
    constructor(http: HttpClient){
        super(http, config.apiUrl + '/v1/tenantType');
    }
}