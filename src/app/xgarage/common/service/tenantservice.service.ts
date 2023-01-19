import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../generic/genericservice";
import { Tenant } from "../model/tenant";

@Injectable({
    providedIn: 'root'
})
export class TenantService extends GenericService<Tenant>{
    constructor(http: HttpClient){
        super(http, config.apiUrl + '/tenant');
    }
}
