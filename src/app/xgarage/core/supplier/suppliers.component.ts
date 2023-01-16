import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { GenericComponent } from 'src/app/xgarage/common/generic/genericcomponent';
import { BrandService } from 'src/app/xgarage/common/service/brandservice';
import { ServiceTypesService } from 'src/app/xgarage/common/service/servicetypeservice';
import { Brand } from '../../common/model/brand';
import { PartType } from '../../common/model/parttype';
import { ServiceType } from '../../common/model/servicetype';
import { PartTypesService } from '../../common/service/parttypeservice';
import { SupplierService } from '../supplier.service';

@Component({
    selector: 'app-suppliers',
    templateUrl: './suppliers.component.html',
    providers: [MessageService, DatePipe]
})
export class SuppliersComponent extends GenericComponent implements OnInit {

    constructor(public route: ActivatedRoute, public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService,
        private partTypeService: PartTypesService,
        private serviceTypesService: ServiceTypesService,
        private brandService: BrandService,
        private supplierService: SupplierService,
        public messageService: MessageService) {
        super(route, datePipe, breadcrumbService);
    }

    partTypesList: PartType[];
    serviceTypesList: ServiceType[];
    brandsList: Brand[];

    ngOnInit(): void {
        this.getPartTypes();
        this.getServiceTypes();
        this.getBrands();
    }

    getPartTypes() {
        this.partTypeService.getAll().subscribe(res => {
            //console.log(res)
            this.partTypesList = res;
        }, err => console.log(err))
    };

    getServiceTypes() {
        this.serviceTypesService.getAll().subscribe(res => {
            //console.log(res)
            this.serviceTypesList = res;
        }, err => console.log(err))
    };

    getBrands() {
        this.brandService.getAll().subscribe(res => {
            //console.log(res)
            this.brandsList = res;
        }, err => console.log(err))
    };

    save() {
        this.master.serviceTypes = this.formatArr(this.master.serviceTypes);
        this.master.partTypes = this.formatArr(this.master.partTypes);
        this.master.brand = this.formatArr(this.master.brand);
        console.log(this.master)

        this.supplierService.signupSupplier(this.master).subscribe(res => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier successfully added!'});
        }, err => {
            if(err.status == 200) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier successfully added!'})
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err})
            }
        });

        this.masterDialog = false;
        this.master = {};
    }

    formatArr(arr: any[]) {
        let newArr = arr.map(el => {
            return el = { "id": el };
        });

        return newArr;
    }
}
