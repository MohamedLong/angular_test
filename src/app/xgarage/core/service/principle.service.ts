import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../../../app/auth/services/auth.service';
import { config } from './../../../../app/config';
import { GenericService } from '../../common/generic/genericservice';

@Injectable({
  providedIn: 'root'
})
export class PrincipleService extends GenericService<any> {

  constructor(protected http: HttpClient, private authService: AuthService) {
    super(http, config.coreApiUrl + '/principle');
  }


}



