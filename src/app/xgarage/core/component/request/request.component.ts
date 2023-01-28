import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { PartType } from 'src/app/xgarage/common/model/parttype';
import { Privacy } from 'src/app/xgarage/common/model/privacy';
import { Part } from '../../model/parts';
import { PartService } from '../../service/part.service';
import { RequestService } from '../../service/request.service';
import { SupplierService } from '../../service/supplier.service';

@Component({
    selector: 'app-request',
    templateUrl: './request.component.html',
    styles: [``]
})
export class RequestComponent implements OnInit {

    constructor(
        private requestService: RequestService,
        private partService: PartService,
        private supplierService: SupplierService) { }

    partTypes: PartType[];
    partType: PartType;
    description: string;
    selectedPartType: Part;
    privacyList = Object.keys(Privacy);
    privacy: string = ''
    selectedPrivateSuppliers: Observable<any>;

    data: any = '';
 
    ngOnInit(): void {
        this.getPartTypes();
        this.requestService.info.subscribe(data => {
           this.data = data;
        })
    }

    getPartTypes() {
        this.partService.getPartTypes().subscribe(res => {
            this.partTypes = res;
        }, err => {
            console.log(err)
        })
    }

    onSelectPartType(part: Part) {
        this.selectedPartType = part;
        console.log(part)
    }

    onRequest(event) {
        console.log(event)
    }

    onPrivacyChange() {
        this.getSupplierByBrandId();
    }

    getSupplierByBrandId() {
        if (this.data.car) {
            this.selectedPrivateSuppliers = this.supplierService.getSupplierByBrandId(this.data.car.brandId.id);
        }
    }
}
