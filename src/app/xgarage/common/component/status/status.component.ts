import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService } from 'primeng/api'
import { Message, MessageService } from 'primeng/api';
import {AppBreadcrumbService} from '../../../../app.breadcrumb.service';
import { Status } from '../../model/status';
import { StatusService } from '../../service/status.service';

@Component({
  templateUrl: './status.component.html',
    styleUrls: ['../../../../demo/view/tabledemo.scss'],
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
    providers: [MessageService, ConfirmationService]
})
export class StatusComponent implements OnInit {

    statuses : Status[];

    status : Status;

    selectedEntries: Status[];

    statusDialog: boolean;

    msgs: Message[] = [];

    deleteSingleDialog: boolean = false;

    deleteMultipleDialog: boolean = false;

    submitted: boolean;

    cols: any[];

    rowsPerPageOptions = [5, 10, 20];

    loading:boolean = true;

    @ViewChild('dt') table: Table;

    @ViewChild('filter') filter: ElementRef;
    confirmationService: any;

    constructor(private statusService: StatusService, private messageService: MessageService, private confirmService: ConfirmationService, private cd: ChangeDetectorRef,
      private breadcrumbService: AppBreadcrumbService) {
        this.breadcrumbService.setItems([
          { label: 'Pages' },
          { label: 'Crud', routerLink: ['/pages/crud'] }
      ]);
      }


  ngOnInit() {
    this.getAll();

  }

getAll() {
    this.statusService.getAll().subscribe({
      next: (statuses) => {
        // currencies.forEach(currency => this.currencyService.savecurrency(currency).subscribe());
        this.statuses = statuses;
        this.loading = false;

        this.cols = [
          {field: 'id', header: 'Id'},
          {field: 'name', header: 'Name'}
        ];
      },
      error: (e) => alert(e)
        // @ts-ignore
        //this.accents.forEach(accent => accent.date = new Date(customer.date));
    });
  }

openNew() {
  this.status = {};
  this.submitted = false;
  this.statusDialog = true;
}

deleteSelectedEntries() {
  this.deleteMultipleDialog = true;
}

editAction(status: Status) {
  this.status = {...status};
  this.statusDialog = true;
}

deleteAction(status: Status) {
  this.deleteSingleDialog = true;
  this.status = {...status};
}

confirmDeleteSelected(){
  this.deleteMultipleDialog = false;
  this.statuses = this.statuses.filter(val => !this.selectedEntries.includes(val));
  this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Status Deleted', life: 3000});
  this.selectedEntries = null;
}

confirmDelete(){
  this.deleteSingleDialog = false;
  this.statusService.delete(this.status.id).subscribe(
    {
      next: (data) => {
        //this.currencies = this.currencies.filter(val => val.id !== this.currency.id);
        // this.messageService.add({severity: 'success', summary: 'Successful', detail: 'currency Deleted', life: 3000});
        if(data.messageCode === 200) {
          this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Status Deleted', life: 3000});
          this.getAll();
          this.status = {};
        }else{
          this.messageService.add({severity: 'success', summary: 'Failure', detail: 'Could Not Delete Status', life: 3000});
        }
      },
      error: (e) => alert(e)
    });
}

hideDialog() {
  this.statusDialog = false;
  this.submitted = false;
}

save() {
  this.submitted = true;

  if (this.status.nameEn.trim() && this.status.nameAr.trim()) {
      if (this.status.id) {
          // @ts-ignore
          this.statusService.update(this.status).subscribe(
            {
              next: (data) => {
                this.status = data;
                this.statuses[this.findIndexById(this.status.id)] = this.status;
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Status Updated', life: 3000});
              },
              error: (e) => alert(e)
            }
          );
      } else {
          // this.accent.id = this.createId();
          // @ts-ignore
          this.statusService.add(this.status).subscribe(
            {
              next: (data) => {
                this.status = data;
                this.statuses.push(this.status);
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Status Created', life: 3000});
              },
              error: (e) => alert(e)
            }
          );
      }

      this.statuses = [...this.statuses];
      this.statusDialog = false;
      this.status = {};
  }
}

findIndexById(id: Number): number {
  let index = -1;
  for (let i = 0; i < this.statuses.length; i++) {
      if (this.statuses[i].id === id) {
          index = i;
          break;
      }
  }

  return index;
}

createId(): number {
  return Math.floor(Math.random() * 1000);
}

clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
}

}
