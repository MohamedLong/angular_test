import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from "../../common/generic/genericservice";
import { Category } from "../model/category";

@Injectable({
    providedIn: 'root'
  })
  export class CategoryService extends GenericService<Category> {
  
    constructor(protected http: HttpClient) {
        super(http, config.coreApiUrl + '/category');
    }
  
  }