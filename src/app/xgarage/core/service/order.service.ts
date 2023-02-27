import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from '../../common/generic/genericservice';
import { config } from 'src/app/config';

@Injectable({
    providedIn: 'root'
})
export class OrderService extends GenericService<any> {

    constructor(protected http: HttpClient) {
        super(http, config.storeApiUrl + '/orders');
    }

    notify(order) {
        return this.http.post(this.apiServerUrl + '/notify', order);
    }
}
