import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../generic/genericservice";
import { CarModel } from "../model/carmodel";

@Injectable({
    providedIn: 'root'
})
export class CarModelService extends GenericService<CarModel> {
    constructor(http: HttpClient){
        super(http, config.coreApiUrl + '/carmodel');
    }
}