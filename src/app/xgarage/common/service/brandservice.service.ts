import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../generic/genericservice";
import { Brand } from "../model/brand";

@Injectable({
    providedIn: 'root'
})
export class BrandService extends GenericService<Brand>{
    constructor(http: HttpClient){
        super(http, config.coreApiUrl + '/brand');
    }
}
