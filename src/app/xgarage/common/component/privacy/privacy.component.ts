import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    displayPrivateSuppliers: boolean = false;
    supplierSelected: boolean = false;
    @Input() id: number;
    @Input() type: string;
    @Input() privacyControl: FormControl;
    @Input() suppliersControl: FormControl;
    @Input() label: string;
    @Input() selectionList: any;
    @Output() enableBidding: EventEmitter<boolean> = new EventEmitter();
    multipleSelect: boolean;

    ngOnInit(): void {
       // console.log(this.type)
     }

    onSelectChange(value: string) {
        //console.log(value)
        this.privateSuppliersList = [];
        this.suppliersControl.reset(this.suppliersControl.value);

        if (value == 'Private' || value == 'Direct') {
            this.getSuppliers();
            this.displayPrivateSuppliers = true;
            this.enableBidding.emit(false);

            value == 'Direct' ? this.multipleSelect = false : this.multipleSelect = true;
        } else {
            this.enableBidding.emit(true);
            this.displayPrivateSuppliers = false;
        }

        // console.log(this.privateSuppliersList)
    }

    getSuppliers() {
        if (this.id) {
            this.type == 'job' ?
                this.selectedPrivateSuppliers = this.supplierService.getSupplierByBrandId(this.id)
                :
                this.selectedPrivateSuppliers = this.tenantService.getTenantsByType(this.id)
        }
    }

    selectSupplier(value: Supplier[]) {
        //check if at least 1 supplier is slected
        console.log(value)
        if (value.length > 0 && this.multipleSelect) {
            this.supplierSelected = true;

        } else if (value.length > 0 && !this.multipleSelect) {
            this.suppliersControl.setValue(value[0].id);
            //console.log(this.suppliersControl)
            this.supplierSelected = true;
        }
        else {
            this.supplierSelected = false;
        }

        this.privateSuppliersList = value;
    }

    removePrivateSupplier(value: { id: any; }) {
        // console.log(this.suppliersControl.value)
        if (this.multipleSelect) {
            let updatedPrivateSuppliers = this.suppliersControl.value.filter(supplier => {
                return supplier.id !== value.id;
            });
            this.suppliersControl.setValue(updatedPrivateSuppliers);
            this.privateSuppliersList = updatedPrivateSuppliers;

            if (this.suppliersControl.value.length == 0) {
                this.privacyControl.setValue('Public');
                this.supplierSelected = false;
            }
        } else {
            this.enableBidding.emit(true);
            this.privacyControl.setValue('Bidding');
            this.privateSuppliersList = [];
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
