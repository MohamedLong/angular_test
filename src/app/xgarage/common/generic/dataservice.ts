import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({providedIn: 'root'})
export class DataService<R>{
  nameSource = new BehaviorSubject<any>('');
  name = this.nameSource.asObservable();
  constructor() { }
  changeObject(object: R) {
    this.nameSource.next(object);
    //console.log(this.name)
  }
}
