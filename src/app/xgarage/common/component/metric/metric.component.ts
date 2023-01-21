import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { Message, MessageService } from 'primeng/api';
import {AppBreadcrumbService} from '../../../../app.breadcrumb.service';
import { Metrics } from '../../model/metrics';
import { MetricService } from '../../service/metric.service';

@Component({
  templateUrl: './metric.component.html',
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
export class MetricComponent implements OnInit {

    metrics: Metrics[];

    metric: Metrics;

    selectedEntries: Metrics[];

    metricDialog: boolean;

    msgs: Message[] = [];

    deleteSingleDialog = false;

    deleteMultipleDialog = false;

    submitted: boolean;

    cols: any[];

    rowsPerPageOptions = [5, 10, 20];

    loading = true;

    @ViewChild('dt') table: Table;

    @ViewChild('filter') filter: ElementRef;

    confirmationService: any;

    constructor(private metricService: MetricService, private messageService: MessageService,
                private confirmService: ConfirmationService, private cd: ChangeDetectorRef,
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
    this.metricService.getAll().subscribe({
      next: (metrics) => {
        // currencies.forEach(currency => this.currencyService.savecurrency(currency).subscribe());
        this.metrics = metrics;
        this.loading = false;

        this.cols = [
          {field: 'id', header: 'Id'},
          {field: 'metricCode', header: 'Metric Code'},
          {field: 'metricName', header: 'Metric Name'}
        ];
      },
      error: (e) => alert(e)
        // @ts-ignore
        // this.accents.forEach(accent => accent.date = new Date(customer.date));
    });
  }

openNew() {
  this.metric = {};
  this.submitted = false;
  this.metricDialog = true;
}

deleteSelectedEntries() {
  this.deleteMultipleDialog = true;
}

editAction(metric: Metrics) {
  this.metric = {...metric};
  this.metricDialog = true;
}

deleteAction(metric: Metrics) {
  this.deleteSingleDialog = true;
  this.metric = {...metric};
}

confirmDeleteSelected(){
  this.deleteMultipleDialog = false;
  this.metrics = this.metrics.filter(val => !this.selectedEntries.includes(val));
  this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Metrics Deleted', life: 3000});
  this.selectedEntries = null;
}

confirmDelete(){
  this.deleteSingleDialog = false;
  this.metricService.delete(this.metric.id).subscribe(
    {
      next: (data) => {
        // this.currencies = this.currencies.filter(val => val.id !== this.currency.id);
        // this.messageService.add({severity: 'success', summary: 'Successful', detail: 'currency Deleted', life: 3000});
        if (data.messageCode === 200) {
          this.metrics = this.metrics.filter(val => val.id !== this.metric.id);
          this.metric = {};
          this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Metric Deleted', life: 3000});
        }else{
          this.messageService.add({severity: 'success', summary: 'Failure', detail: 'Could Not Delete Metric', life: 3000});
        }
      },
      error: (e) => alert(e)
    });
}

hideDialog() {
  this.metricDialog = false;
  this.submitted = false;
}

save() {
  this.submitted = true;

  if (this.metric.metricName.trim()) {
      if (this.metric.id) {
          // @ts-ignore
          this.metricService.update(this.metric).subscribe(
            {
              next: (data) => {
                this.metric = data;
                this.metrics[this.findIndexById(this.metric.id)] = this.metric;
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Metric Updated', life: 3000});
              },
              error: (e) => alert(e)
            }
          );
      } else {
          // this.accent.id = this.createId();
          // @ts-ignore
          this.metricService.add(this.metric).subscribe(
            {
              next: (data) => {
                this.metric = data;
                this.metrics.push(this.metric);
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Metric Created', life: 3000});
              },
              error: (e) => alert(e)
            }
          );
      }

      this.metrics = [...this.metrics];
      this.metricDialog = false;
      this.metric = {};
  }
}

findIndexById(id: number): number {
  let index = -1;
  for (let i = 0; i < this.metrics.length; i++) {
      if (this.metrics[i].id === id) {
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
