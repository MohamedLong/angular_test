import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class DataService<R>{
  private nameSource = new BehaviorSubject<any>('');
  name = this.nameSource.asObservable()
  constructor() { }
  changeObject(object: R) {
    this.nameSource.next(object);
  }
}