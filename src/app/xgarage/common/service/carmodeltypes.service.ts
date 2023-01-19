import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../generic/genericservice";
import { CarModelType } from "../model/carmodeltype";

@Injectable({
    providedIn: 'root'
})
export class CarModelTypeService extends GenericService<CarModelType>{
    constructor(http: HttpClient){
        super(http, config.coreApiUrl + '/carModelType');
    }
}
