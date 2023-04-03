import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from '../../common/generic/genericservice';
import { config } from 'src/app/config';
import { MessageResponse } from '../../common/dto/messageresponse';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class OrderService extends GenericService<any> {

    constructor(protected http: HttpClient) {
        super(http, config.storeApiUrl + '/orders');
    }

    notify(order) {
        return this.http.post<MessageResponse>(this.apiServerUrl + '/notify', order);
    }

    changeOrderStatus(orderRequest: any, status: string){
        if(status == 'cancel') {
            return this.cancelOrderBySupplier(orderRequest);
        }
        if(status == 'accept') {
            return this.acceptOrder(orderRequest);
        }
        if(status == 'complete') {
            return this.completeOrder(orderRequest);
        }
        return null;
    }

    cancelOrder(orderRequest: any) {
        return this.http.post<MessageResponse>(this.apiServerUrl + '/cancel', orderRequest);
    }

    cancelOrderBySupplier(orderRequest: any) {
        return this.http.post<MessageResponse>(this.apiServerUrl + '/seller/cancel', orderRequest);
    }

    acceptOrder(orderRequest: any) {
        return this.http.post<MessageResponse>(this.apiServerUrl + '/accept', orderRequest);
    }

    completeOrder(orderRequest: any) {
        return this.http.post<MessageResponse>(this.apiServerUrl + '/readyShipping', orderRequest);
    }
}
