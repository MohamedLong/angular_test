import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../../common/generic/genericservice";
import { PartType } from "../../common/model/parttype";

@Injectable({
    providedIn: 'root'
  })
  export class PartTypeService extends GenericService<PartType> {
  
    constructor(protected http: HttpClient) {
        super(http, config.coreApiUrl + '/partTypes');
    }
  
  }