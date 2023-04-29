import { Component, OnInit } from '@angular/core';
import { Privacy } from '../../model/privacy';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
})
export class PrivacyComponent implements OnInit {

  constructor() { }

  privateSuppliersList: any[] = [];
  privacyList = Object.keys(Privacy);

  ngOnInit(): void {
  }

  onPrivacyChange(e) {}

  removePrivateSupplier(e) {}

}
