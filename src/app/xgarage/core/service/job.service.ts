import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenericService } from '../../common/generic/genericservice';
import { Job } from '../model/job';
import { MessageResponse } from '../../common/dto/messageresponse';

@Injectable({
    providedIn: 'root'
})
export class JobService extends GenericService<Job> {

    constructor(protected http: HttpClient) {
        super(http, config.coreApiUrl + '/job');
    }

    getJobByClaimNumber(cno: string) {
        return this.http.get<any>(config.coreApiUrl + '/job/claimNo/' + cno).pipe(
            tap(res => {
                return res
            }), catchError(err => {
                return throwError(err)
            })
        )
    }

    saveJob(body: any) {
        return this.http.post<any>(config.coreApiUrl + '/job/saveJob?jobBody=' + body, '').pipe(
            tap(res => {
                return res
            }), catchError(err => {
                return throwError(err)
            })
        )
    }

    partialUpdate(dto: any) {
        return this.http.patch<MessageResponse>(config.coreApiUrl + '/job/updateJob', dto);
    }

    getBidsByJob() {
        return this.http.get<any>(config.coreApiUrl + '/job/tenantSupplier');
    }
}
