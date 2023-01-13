import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../generic/genericservice";
import { Metrics } from "../model/metrics";

@Injectable()
export class MetricService extends GenericService<Metrics> {
    constructor(http: HttpClient){
        super(http, config.apiUrl + '/api/v1/metric');
    }
}