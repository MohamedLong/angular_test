import { DatePipe } from '@angular/common';
import { GenericComponent } from './../../../common/generic/genericcomponent';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { TenantTypeService } from '../../service/tenanttype.service';

@Component({
    selector: 'app-tenant-type',
    templateUrl: './tenanttype.component.html', styleUrls: ['../../../../demo/view/tabledemo.scss'],
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
export class TenantTypeComponent extends GenericComponent implements OnInit {

    constructor(public route: ActivatedRoute, private router: Router, private tenantTypeService: TenantTypeService,
        public messageService: MessageService, public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService) {
        super(route, datePipe, breadcrumbService);
    }

    valid: boolean = false;

    ngOnInit(): void {
        this.getAll();
        super.callInsideOnInit();

        this.breadcrumbService.setItems([{'label': 'Tenant Types', 'routerLink': ['tenanttype']}]);
    }

    getAll() {
        this.tenantTypeService.getAll().subscribe({
            next: (masters) => {
                this.masters = masters;
                //console.log(this.masters)
                this.loading = false;
                this.cols = [
                    { field: 'id', header: 'ID' },
                    { field: 'name', header: 'Type Name' }
                ];
            },
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
        });
    }

    save() {
        this.submitted = true;

        if (this.master.name) {
            if (this.master.id) {
                // @ts-ignore
                this.tenantTypeService.update(this.master).subscribe(
                    {
                        next: (data) => {
                            this.master = data;
                            this.masters[this.findIndexById(this.master.id, this.masters)] = this.master;
                            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tenant Type Updated'});
                            this.getAll();
                        },
                        error: (e) => alert(e)
                    }
                );
            } else {
                this.tenantTypeService.add(this.master).subscribe(
                    {
                        next: (data) => {
                            this.master = data;
                            this.masters.push(this.master);
                            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tenant Type created successfully' });
                        },
                        error: (e) => alert(e)
                    }
                );
            }
            this.masters = [...this.masters];
            this.masterDialog = false;
            this.master = {};

            //this.ngOnInit();
        }
    }

    confirmDelete() {
        this.tenantTypeService.delete(this.master.id).subscribe(res => {
            this.masters = this.masters.filter(val => val.id != this.master.id);
            this.messageService.add({ severity: 'success', summary: 'Tenant Type deleted successfully' });
            this.deleteSingleDialog = false;
        }, err => {
            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: err, life: 3000 });
        })
    }

}
