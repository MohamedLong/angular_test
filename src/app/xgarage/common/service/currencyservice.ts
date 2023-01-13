import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../generic/genericservice";
import { Currency } from "../model/currency";

@Injectable()
export class CurrencyService extends GenericService<Currency> {

    constructor(http: HttpClient){
        super(http, config.apiUrl + '/api/v1/currency');
    }
}