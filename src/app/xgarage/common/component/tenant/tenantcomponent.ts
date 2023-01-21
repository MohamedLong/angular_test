import { DatePipe } from '@angular/common';
import { GenericComponent } from './../../../common/generic/genericcomponent';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { TenantService } from '../../service/tenant.service';
import { Tenant } from '../../model/tenant';

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

    constructor(public route: ActivatedRoute, private router: Router, private tenantService: TenantService,
        public messageService: MessageService, public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService) {
        super(route, datePipe, breadcrumbService);
    }

    valid: boolean = false;

    ngOnInit(): void {
        this.getAll();
        super.callInsideOnInit();
    }

    getAll() {
        this.tenantService.getAll().subscribe({
            next: (masters) => {
                this.masters = masters;
                //console.log(this.masters)
                this.loading = false;
                this.cols = [
                    { field: 'id', header: 'ID' },
                    { field: 'name', header: 'Tenant Name' },
                    { field: 'cr', header: 'CR' },
                    { field: 'location', header: 'Location' },
                ];
            },
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
        });
    }

    save() {
        this.submitted = true;

        if (this.master.name && this.master.cr) {
            if (this.master.id) {
                // @ts-ignore
                this.tenantService.update(this.master).subscribe(
                    {
                        next: (data) => {
                            console.log(data)
                            this.master = data;
                            this.masters[this.findIndexById(this.master.id, this.masters)] = this.master;
                            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tenant Updated'});
                            this.getAll();
                        },
                        error: (e) => alert(e)
                    }
                );
            } else {
                // this.culture.id = this.createId();
                // @ts-ignore
                delete this.master.createdAt
                delete this.master.createdBy

                this.tenantService.add(this.master).subscribe(
                    {
                        next: (data) => {
                            //console.log(data)
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

            //this.ngOnInit();
        }
    }

    confirmDelete() {
        this.tenantService.delete(this.master.id).subscribe(res => {
            console.log(res)

            this.messageService.add({ severity: 'success', summary: 'Tenant deleted successfully' });
            this.deleteSingleDialog = false;
            this.getAll();
        }, err => {
            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: err, life: 3000 });
        })
    }

}
