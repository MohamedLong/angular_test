import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { config } from 'src/app/config';
import { GenericService } from '../../common/generic/genericservice';
import { Car } from '../model/car';

@Injectable({
    providedIn: 'root'
})
export class CarService extends GenericService<any> {

    constructor(protected http: HttpClient) {
        super(http, config.coreApiUrl + '/car');
    }

    getCarByChn(chn: string) {
        return this.http.get<Car>(this.apiServerUrl + '/chassisNumber/' + chn).pipe(
            tap(res => {
                return res
            }), catchError(err => {
                return throwError(err)
            })
        )
    }
}
