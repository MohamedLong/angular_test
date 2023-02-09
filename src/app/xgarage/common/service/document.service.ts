import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../generic/genericservice";

@Injectable({providedIn: "root"})
export class DocumentService extends GenericService<Document>{
    constructor(http: HttpClient){
        super(http, config.apiUrl);
    }
}
