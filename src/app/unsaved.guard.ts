import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<any>;
}
@Injectable({providedIn: 'root'})
export class UnsavedChangesGaurd
  implements CanDeactivate<any>
{
  constructor() {}
  canDeactivate(
    component: ComponentCanDeactivate
  ): boolean | Observable<any> {
    return component.canDeactivate();
  }
}
