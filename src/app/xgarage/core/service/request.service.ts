import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../../common/generic/genericservice';
import { config } from 'src/app/config';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RequestService extends GenericService<any> {
    constructor(protected http: HttpClient) {
        super(http, config.coreApiUrl + '/');
    }

    info: BehaviorSubject<any> = new BehaviorSubject({});
    part: BehaviorSubject<any> = new BehaviorSubject({});
    newRequest: BehaviorSubject<any> = new BehaviorSubject(false);
}
