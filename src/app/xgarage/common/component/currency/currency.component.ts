import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Currency } from '../../model/currency';
import { CurrencyService } from '../../service/currency.service';
import { Table } from 'primeng/table';
import { ConfirmationService } from 'primeng/api'
import { Message, MessageService } from 'primeng/api';
import {AppBreadcrumbService} from '../../../../app.breadcrumb.service';

@Component({
  templateUrl: './currency.component.html',
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
export class CurrencyComponent implements OnInit {

    currencies : Currency[];

    currency : Currency;

    selectedEntries: Currency[];

    currencyDialog: boolean;

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

    constructor(private currencyService: CurrencyService, private messageService: MessageService, private confirmService: ConfirmationService, private cd: ChangeDetectorRef,
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
    this.currencyService.getAll().subscribe({
      next: (currencies) => {
        // currencies.forEach(currency => this.currencyService.savecurrency(currency).subscribe());
        this.currencies = currencies;
        this.loading = false;

        this.cols = [
          {field: 'id', header: 'Id'},
          {field: 'currencyName', header: 'Currency Name'},
          {field: 'curencyCode', header: 'Currency Code'},
          {field: 'cuRate', header: 'Currency Rate'}
        ];
      },
      error: (e) => alert(e)
        // @ts-ignore
        //this.accents.forEach(accent => accent.date = new Date(customer.date));
    });
  }

openNew() {
  this.currency = {};
  this.submitted = false;
  this.currencyDialog = true;
}

deleteSelectedEntries() {
  this.deleteMultipleDialog = true;
}

editAction(currency: Currency) {
  this.currency = {...currency};
  this.currencyDialog = true;
}

deleteAction(currency: Currency) {
  this.deleteSingleDialog = true;
  this.currency = {...currency};
}

confirmDeleteSelected(){
  this.deleteMultipleDialog = false;
  this.currencies = this.currencies.filter(val => !this.selectedEntries.includes(val));
  this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Currencies Deleted', life: 3000});
  this.selectedEntries = null;
}

confirmDelete(){
  this.deleteSingleDialog = false;
  this.currencyService.delete(this.currency.id).subscribe(
    {
      next: (data) => {
        //this.currencies = this.currencies.filter(val => val.id !== this.currency.id);
        // this.messageService.add({severity: 'success', summary: 'Successful', detail: 'currency Deleted', life: 3000});
        if(data.messageCode === 200) {
          this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Currency Deleted', life: 3000});
          this.getAll();
          this.currency = {};
        }
      },
      error: (e) => alert(e)
    });
}

hideDialog() {
  this.currencyDialog = false;
  this.submitted = false;
}

save() {
  this.submitted = true;

  if (this.currency.currencyName.trim()) {
      if (this.currency.id) {
          // @ts-ignore
          this.currencyService.update(this.currency).subscribe(
            {
              next: (data) => {
                this.currency = data;
                this.currencies[this.findIndexById(this.currency.id)] = this.currency;
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Currency Updated', life: 3000});
              },
              error: (e) => alert(e)
            }
          );
      } else {
          // this.accent.id = this.createId();
          // @ts-ignore
          this.currencyService.add(this.currency).subscribe(
            {
              next: (data) => {
                this.currency = data;
                this.currencies.push(this.currency);
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Currency Created', life: 3000});
              },
              error: (e) => alert(e)
            }
          );
      }

      this.currencies = [...this.currencies];
      this.currencyDialog = false;
      this.currency = {};
  }
}

findIndexById(id: Number): number {
  let index = -1;
  for (let i = 0; i < this.currencies.length; i++) {
      if (this.currencies[i].id === id) {
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
