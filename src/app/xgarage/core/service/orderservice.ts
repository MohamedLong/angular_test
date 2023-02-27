import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../../common/generic/genericservice";

@Injectable({
    providedIn: 'root'
})
export class OrderService extends GenericService<any> {

    constructor(protected http: HttpClient) {
        super(http, config.storeApiUrl + '/orders');
    }

    


}
