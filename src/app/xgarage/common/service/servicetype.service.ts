import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../generic/genericservice";
import { ServiceType } from "../model/servicetype";

@Injectable({
    providedIn: 'root'
})
export class ServiceTypesService extends GenericService<ServiceType>{
    constructor(http: HttpClient){
        super(http, config.coreApiUrl + '/serviceTypes');
    }

}
