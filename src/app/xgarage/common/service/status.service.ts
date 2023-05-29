import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../generic/genericservice";
import { Status } from "../model/status";

@Injectable({providedIn: 'root'})
export class StatusService extends GenericService<Status> {
    constructor(http: HttpClient){
        super(http, config.coreApiUrl + '/status');
    }

    statuses: Status[];
}
