import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../generic/genericservice";

@Injectable({
    providedIn: 'root'
})
export class ServiceTypesService extends GenericService<any>{
    constructor(http: HttpClient){
        super(http, config.coreUrl + '/serviceTypes');
    }

}
