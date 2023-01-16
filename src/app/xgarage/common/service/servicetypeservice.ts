import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../generic/genericservice";
import { ServiceType } from "../model/servicetype";

@Injectable()
export class ServiceTypeService extends GenericService<ServiceType>{
    constructor(http: HttpClient){
        super(http, config.coreApiUrl);
    }
    
}