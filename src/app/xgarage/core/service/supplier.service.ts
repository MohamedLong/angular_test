import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { Observable } from 'rxjs';
import { config } from 'src/app/config';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { GenericService } from '../../common/generic/genericservice';
import { Supplier } from '../model/supplier';
import { SupplierDto } from '../dto/supplierdto';

@Injectable({
    providedIn: 'root'
})
export class SupplierService extends GenericService<Supplier> {
    constructor(protected http: HttpClient, private authService: AuthService) {
        super(http, config.coreApiUrl + '/supplier');
     }

    signupSupplier(supplier: Supplier) {
        let userId = JSON.parse(this.authService.getStoredUser()).id;
        supplier.user = userId;
        return this.http.post(config.coreApiUrl + '/supplier/signup', supplier).pipe(
            map(res => {
                return res
            }), catchError(err => {
                return throwError(err)
            })
        )
    }

    getSuppliers() {
        return this.http.get<SupplierDto[]>(config.coreApiUrl + '/supplier/all');
    }

    getSupplierById(supplierId: number) {
        return this.http.get<Supplier>(`${config.coreApiUrl}/supplier/id/${supplierId}`).pipe(
            tap(res => {
                return res
            }), catchError(err => {
                return throwError(err)
            })
        )
    }

    changeSupplierStatus(id: number, status: boolean) {
        return this.http.put(`${config.coreApiUrl}/supplier/changeStatus/${id}/${status}`, '').pipe(
            tap(res => {
                return res
            }), catchError(err => {
                return throwError(err)
            })
        )
    }


}
