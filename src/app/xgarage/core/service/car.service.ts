import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { GenericService } from '../../common/generic/genericservice';
import { Car } from '../model/car';

@Injectable({
  providedIn: 'root'
})
export class CarService  extends GenericService<Car> {

  constructor(protected http: HttpClient) {
      super(http, config.coreApiUrl + '/car');
  }
}
