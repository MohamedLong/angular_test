import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Privacy } from '../../model/privacy';
import { SupplierService } from 'src/app/xgarage/core/service/supplier.service';
import { Observable } from 'rxjs';
import { TenantService } from '../../service/tenant.service';
import { Supplier } from 'src/app/xgarage/core/model/supplier';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.component.html',
})
export class PrivacyComponent implements OnInit {

    constructor(private supplierService: SupplierService, private tenantService: TenantService) { }

    privateSuppliersList: any[] = [];
    selectedPrivateSuppliers: Observable<any>;
    privacyList = Object.keys(Privacy);
    displayPrivateSuppliers: boolean = false;
    supplierSelected: boolean = false;
    @Input() id: number;
    @Input() type: string;
    @Input() privacyControl: FormControl;
    @Input() suppliersControl: FormControl;
    ngOnInit(): void {
       // console.log(this.id, this.type, this.privacyControl)
    }

    onPrivacyChange(value) {
        // console.log(value)
        if (value == 'Private') {
            this.getSuppliers();
            this.displayPrivateSuppliers = true;
        } else {
            this.privateSuppliersList = [];
            //----->
            this.suppliersControl.setValue([]);
            //----->
            this.displayPrivateSuppliers = false;
        }
    }

    getSuppliers() {
        if (this.id) {
            this.type == 'job' ?
                this.selectedPrivateSuppliers = this.supplierService.getSupplierByBrandId(this.id)
                :
                this.tenantService.getTenantsByType(this.id).subscribe(res => {
                    console.log(res)
                }, err => {
                    console.log(err)
                })
        }
    }

    selectSupplier(value: Supplier[]) {
        //check if at least 1 supplier is slected
        //console.log(value)
        if (value.length > 0) {
            this.supplierSelected = true;

        } else {
            this.supplierSelected = false;
        }

        this.privateSuppliersList = value;
    }

    removePrivateSupplier(value) {
        // console.log(value)
        let updatedPrivateSuppliers = this.suppliersControl.value.filter(supplier => {
            return supplier.id !== value.id;
        });
        //----->
        this.suppliersControl.setValue(updatedPrivateSuppliers);
        //----->
        this.privateSuppliersList = updatedPrivateSuppliers;

        if (this.suppliersControl.value.length == 0) {
            //----->
            this.privacyControl.setValue('Public');
            //----->
            this.supplierSelected = false;
        }
    }

    resetPrivacy() {
        //console.log('privacy is resetted')
        // if (this.privateSuppliersList.length == 0) {
        //     //----->
        //     this.suppliersControl.setValue([]);
        //     this.privacyControl.setValue('Public');
        //     //----->
        // } else {
        //     this.suppliersControl.setValue([]);
        // }

        // this.privateSuppliersList = [];
        // this.suppliersControl.setValue([]);
        // this.privacyControl.setValue('Public');
    }

}
