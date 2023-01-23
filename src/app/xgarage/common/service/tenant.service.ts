import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { config } from "src/app/config";
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

}
