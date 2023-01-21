import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../generic/genericservice";
import { CarModelYear } from "../model/carmodelyear";

@Injectable({
    providedIn: 'root'
})
export class CarModelYearService extends GenericService<CarModelYear>{
    constructor(http: HttpClient){
        super(http, config.coreApiUrl + '/carModelYear');
    }
}
