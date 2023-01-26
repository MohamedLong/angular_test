import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { config } from 'src/app/config';
import { GenericService } from '../../common/generic/genericservice';
import { PartType } from '../../common/model/parttype';

@Injectable({
  providedIn: 'root'
})
export class PartService extends GenericService<any> {

  constructor(protected http: HttpClient) {
      super(http, config.coreApiUrl + '/category');
  }

  getPartByPartName(partName: string) {
    return this.http.get<{id: number, name: string, status: number}[]>(config.coreApiUrl + '/part/' + partName).pipe(
        tap(res => {
            return res
        }), catchError(err => {
            return throwError(err)
        })
    )
  }

  getPartTypes() {
    return this.http.get<PartType[]>(config.coreApiUrl + '/partTypes/all').pipe(
        tap(res => {
            return res
        }), catchError(err => {
            return throwError(err)
        })
    )
  }

}
