import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PartType } from 'src/app/xgarage/common/model/parttype';
import { Privacy } from 'src/app/xgarage/common/model/privacy';
import { Part } from '../../model/parts';
import { PartService } from '../../service/part.service';
import { RequestService } from '../../service/request.service';

@Component({
    selector: 'app-request',
    templateUrl: './request.component.html',
    styles: [``]
})
export class RequestComponent implements OnInit {

    constructor(
        private requestService: RequestService,
        private partService: PartService) { }

    partTypes: PartType[];
    description: string;
    selectedPartType: Part;
    privacy = Object.keys(Privacy);
    selectedPrivateSuppliers: Observable<any>;

    ngOnInit(): void {
        this.getPartTypes();
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
        // if (this.car) {
        //     this.selectedPrivateSuppliers = this.supplierService.getSupplierByBrandId(this.car.carData.brandId.id);
        // }
    }
}
