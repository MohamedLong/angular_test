import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { Observable } from 'rxjs';
import { config } from 'src/app/config';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class SupplierService {
    constructor(private http: HttpClient, private authService: AuthService) { }

    signupSupplier(supplier: any) {
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
}
