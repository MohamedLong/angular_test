import { Supplier } from './../../../core/model/supplier';
import { SupplierService } from './../../../core/service/supplier.service';
import { UserDto } from './../../dto/userdto';
import { UserService } from './../../../dashboard/service/user.service';
import { Tenant } from './../../model/tenant';
import { DatePipe } from '@angular/common';
import { GenericComponent } from './../../../common/generic/genericcomponent';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { TenantService } from '../../service/tenant.service';
import { TenantTypeService } from '../../service/tenanttype.service';
import { TenantType } from '../../model/tenanttype';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from '../../model/user';

@Component({
    selector: 'app-stock-order',
    templateUrl: './tenantcomponent.html', styleUrls: ['../../../../demo/view/tabledemo.scss'],
    styles: [`
      :host ::ng-deep .p-dialog .product-image {
          width: 150px;
          margin: 0 auto 2rem auto;
          display: block;
      }

      @media screen and (max-width: 960px) {
          :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:last-child {
              text-align: center;
          }

          :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:nth-child(6) {
              display: flex;
          }
      }

  `],
    providers: [MessageService, ConfirmationService, DatePipe]
})
export class TenantComponent extends GenericComponent implements OnInit {

    constructor(public route: ActivatedRoute, private authService: AuthService ,private router: Router, private tenantService: TenantService,
        public messageService: MessageService, private tenantTypeService: TenantTypeService, 
        public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService, private userService: UserService,
        private supplierService: SupplierService) {
        super(route, datePipe, breadcrumbService);
    }

    valid: boolean = false;

    tenantTypes: TenantType[];
    selectedTenantType: TenantType;
    selectedTenant: Tenant = {};
    users: UserDto[];
    selectedUser: User;
    selectedSupplier: Supplier = {};
    selectedId: number;

    ngOnInit(): void {
        this.getAll();
        this.getTenantTypes();
        super.callInsideOnInit();
        this.breadcrumbService.setItems([{'label': 'Tenants', 'routerLink': ['tenant']}]);
    }

    viewProfile(id: number){
        localStorage.removeItem('supplierId');
        this.tenantService.selectedTenantId = id;
        this.router.navigate(['/supplier-profile']);
    }

    new() {
        this.selectedTenantType = {};
        this.openNew();
    }

    edit(master: Tenant) {
        this.selectedTenantType = master.tenantType;
        this.editMaster(master);
    }

    getAll() {
        this.tenantService.getAll().subscribe({
            next: (masters) => {
                this.masters = masters;
                this.loading = false;
                this.cols = [
                    { field: 'id', header: 'ID' },
                    { field: 'name', header: 'Tenant Name' },
                    { field: 'cr', header: 'CR' },
                    { field: 'location', header: 'Location' },
                    { field: 'tenantType.name', header: 'Type Name' }
                ];
            },
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
        });
    }

    getTenantTypes() {
        this.tenantTypeService.getAll().subscribe({
            next: (data) => {
                this.tenantTypes = data;
            },
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
        });
    }

    save() {
        this.submitted = true;
        if (this.master.name && this.master.cr && this.selectedTenantType) {
            this.master.tenantType = this.selectedTenantType;
            this.master.updatedBy = JSON.parse(this.authService.getStoredUser()).id;
            this.master.updatedAt = new Date();
            if (this.master.id) {
                // @ts-ignore
                this.tenantService.update(this.master).subscribe(
                    {
                        next: (data) => {
                            this.master = data;
                            this.masters[this.findIndexById(this.master.id, this.masters)] = this.master;
                            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tenant Updated'});
                            this.getAll();
                        },
                        error: (e) => alert(e)
                    }
                );
            } else {
                this.tenantService.add(this.master).subscribe(
                    {
                        next: (data) => {
                            this.master = data;
                            this.masters.push(this.master);
                            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tenant created successfully' });
                        },
                        error: (e) => alert(e)
                    }
                );
            }
            this.masters = [...this.masters];
            this.masterDialog = false;
            this.master = {};
        }
    }

    confirmDelete() {
        this.tenantService.delete(this.master.id).subscribe(res => {
            this.messageService.add({ severity: 'success', summary: 'Tenant deleted successfully' });
            this.deleteSingleDialog = false;
            this.masters = this.masters.filter(val => val.id != this.master.id);
        }, err => {
            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: err, life: 3000 });
        })
    }

    checkSupplierByIdNumber(supplierId: number){
        this.supplierService.checkSupplierByIdNumber(supplierId).subscribe((res)=>{
            if(res == true){
                this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Supplier Profile Already Exist!' })
            } else{
                this.createNewSupplierProfile();
            }})
    }

    createNewSupplierProfile(){  
        this.selectedSupplier.name = this.selectedTenant.name;
        this.selectedSupplier.cr = this.selectedTenant.cr;
        this.selectedSupplier.tenant = this.selectedTenant.id;
        this.selectedSupplier.enabled = true;
        this.supplierService.createSupplier(this.selectedSupplier).subscribe((res)  => {

            if (res.messageCode == 200){
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New Supplier Profile Created!' });
            } else {
                this.messageService.add({ severity: 'warning', summary: 'Warning', detail: 'Unexpected response from server' });
            }
        });        
    }

    changeStatus(id: number, event) {
        this.selectedTenant = this.masters.find(val => val.id == id);
        if (id != null) {
            this.tenantService.changeEnableStatus(id, event.checked).subscribe(
                {
                    next: (data) => {
                        this.messageService.add({ severity: 'info', summary: 'Successful', detail: 'Tenant Status Changed', life: 3000});
                    }
                })
            if(this.selectedTenant.enabled == true && this.selectedTenant.tenantType.id == 3){  
                this.checkSupplierByIdNumber(id);
            }
        }
    }

}
