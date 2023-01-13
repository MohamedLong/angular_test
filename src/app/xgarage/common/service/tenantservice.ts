import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { config } from "src/app/config";
import { GenericService } from "../generic/genericservice";
import { Tenant } from "../model/tenant";

@Injectable()
export class TenantService extends GenericService<Tenant>{
    constructor(http: HttpClient){
        super(http, config.apiUrl);
    }

    public getUserTenant(){
        return this.http.get<Tenant>(this.apiServerUrl + '/api/tenant/user');
    }

    getAllTenants() {
        return this.http.get<Tenant[]>(this.apiServerUrl + '/api/tenant/all').pipe(
            tap(res => {
                return res;
            }), catchError(err => {
                console.log(err);
                return err;
            })
        );
    }


}
