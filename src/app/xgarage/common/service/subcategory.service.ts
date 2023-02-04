import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { config } from "src/app/config";
import { GenericService } from "../../common/generic/genericservice";
import { SubCategory } from "../model/subcategory";

@Injectable({
    providedIn: 'root'
  })
  export class SubCategoryService extends GenericService<SubCategory> {
  
    constructor(protected http: HttpClient) {
        super(http, config.coreApiUrl + '/subcategory');
    }

    getSubCategoriesByCategory(catId: number) {
        return this.http.get<SubCategory[]>(this.apiServerUrl + '/category/' + catId);
    }
  
  }