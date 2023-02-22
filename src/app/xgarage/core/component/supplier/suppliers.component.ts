import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { GenericComponent } from 'src/app/xgarage/common/generic/genericcomponent';
import { Brand } from 'src/app/xgarage/common/model/brand';
import { PartType } from 'src/app/xgarage/common/model/parttype';
import { ServiceType } from 'src/app/xgarage/common/model/servicetype';
import { BrandService } from 'src/app/xgarage/common/service/brand.service';
import { ServiceTypesService } from 'src/app/xgarage/common/service/servicetype.service';
import { PartTypesService } from '../../../common/service/parttype.service';
// import { SupplierDto } from '../../dto/supplierdto';
import { Supplier } from '../../model/supplier';
import { SupplierService } from '../../service/supplier.service';

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

    selectedPartTypesList: PartType[];
    selectedServiceTypesList: ServiceType[];
    selectedBrandsList: Brand[];

    ngOnInit(): void {
        this.getSuppliers();
        this.getPartTypes();
        this.getServiceTypes();
        this.getBrands();

        this.breadcrumbService.setItems([{'label': 'Suppliers', 'routerLink': ['suppliers']}]);
    }

    getSuppliers() {
        this.supplierService.getSuppliers().subscribe({
            next: (masters) => {
                this.masterDtos = masters;
                console.log(this.masterDtos)
                this.loading = false;
                this.cols = [
                    { field: 'id', header: 'ID' },
                    { field: 'name', header: 'Supplier Name' },
                    { field: 'cr', header: 'CR Number' },
                    { field: 'phone', header: 'Phone Number' },
                ];
            },
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
        });
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
        this.master.serviceTypes = this.selectedServiceTypesList;
        this.master.brand = this.selectedBrandsList;
        this.master.partTypes = this.selectedPartTypesList;

        if (this.master.id) {
            console.log(this.master)
            this.supplierService.update(this.master).subscribe(res => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier updated!' })
            }, err => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err })
            })
        } else {
            this.submitted = true;
            if (this.master.serviceTypes.length > 0 && this.master.brand.length > 0 && this.master.partTypes.length > 0 && this.master.name && this.master.phoneNumber && this.master.cr) {
                this.submitted = false;
                console.log(this.master)
                this.supplierService.signupSupplier(this.master).subscribe(res => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier successfully added!' });
                }, err => {
                    if (err.status == 200) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier successfully added!' })
                    } else {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: err })
                    }
                });
            }

        }


        this.masterDialog = false;
        this.master = {};
    }

    changeStatus(id: number, status: boolean) {
        //console.log(id ,status)
        this.supplierService.changeSupplierStatus(id, status).subscribe(res => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `${status ? 'enabled' : 'disabled'} supplier` });
        }, err => {
            if (err.status == 200) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `${status ? 'enabled' : 'disabled'} supplier` });
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'faield to update supplier status' });
            }
        })
    }

    open() {
        this.selectedPartTypesList = [];
        this.selectedServiceTypesList = [];
        this.selectedBrandsList = [];
        this.openNew();
    }

    edit(supplierId: number) {
        this.supplierService.getSupplierById(supplierId).subscribe((res: Supplier) => {
            this.selectedBrandsList = res.brand;
            this.selectedPartTypesList = res.partTypes;
            this.selectedServiceTypesList = res.serviceTypes;
            this.editMaster(res);
        }, err => {
            console.log('err:', err)
        })
    }
}
