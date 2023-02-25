import { Component, OnInit} from '@angular/core';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { PartiesService } from 'src/app/erp/common/service/partiesservice';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/erp/common/generic/dataservice';
import { CurrencyService } from 'src/app/erp/common/service/currencyservice';
import { StockService } from 'src/app/erp/common/service/stockservice';
import { DatePipe} from '@angular/common';
import { SaleInvoiceDto } from '../../dto/saleinvoicedto';
import { InvSaleInvoice } from '../../model/invoice';
import { InvoiceService} from '../../service/invoiceservice';
import { GenericComponent } from 'src/app/erp/common/generic/genericcomponent';
import { CompanyService } from 'src/app/erp/common/service/companyservice';
import { SaleCostService } from 'src/app/erp/common/service/salecostservice';
import { SaleCost } from 'src/app/erp/common/model/salecost';

@Component({
    templateUrl: './invoice.component.html',
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
    providers: [MessageService, ConfirmationService, DatePipe]
})
export class InvoiceComponent extends GenericComponent implements OnInit {

    
    saleAccounts: SaleCost[];
    selectedSaleAccount: SaleCost;

    constructor(public route: ActivatedRoute, private router: Router, private dataService: DataService<InvSaleInvoice>, private invoiceService: InvoiceService,
        public messageService: MessageService, public datePipe: DatePipe, public saleCostService: SaleCostService, breadcrumbService: AppBreadcrumbService, stockService: StockService, partiesService: PartiesService, currencyService: CurrencyService, companyService: CompanyService) {
            super(route, datePipe, null, breadcrumbService, stockService,  partiesService, currencyService, companyService);
    }

    ngOnInit(): void {
        this.getAll();
        this.getMinDate();
        super.callInsideOnInit();
        super.getAllParties(1);
        this.getAllSaleAccounts();
    }

    getAllSaleAccounts(){
        this.saleCostService.getAll().subscribe({
            next: (saleAccounts) => {
                this.saleAccounts = saleAccounts;
            }
        });
    }


    getAll() {
        this.invoiceService.getAllSaleInvoices().subscribe({
            next: (invoices) => {
                // currencies.forEach(currency => this.currencyService.savecurrency(currency).subscribe());
                this.masterDtos = invoices;
                this.loading = false;
                this.masterDtos = this.updateCalculatedAmounts(this.masterDtos);
                this.cols = [
                    { field: 'id', header: 'ID' },
                    { field: 'orderId', header: 'performa No' },
                    { field: 'orderDate', header: 'performa Date' },
                    { field: 'insertDate', header: 'Insert Date' },
                    { field: 'customerPartyName', header: 'Customer Name' },
                    { field: 'netamount', header: 'Total' },
                    { field: 'statusNameEn', header: 'Status' },
                    { field: 'statusNameAr', header: 'Status' },
                    { field: 'paymentStatus', header: 'Payment Status' },
                    { field: 'deliveryStatus', header: 'Delivery Status' },
                    { field: 'cuCurrencyCode', header: 'Cu' },
                    { field: 'processId', header: 'Process Id' }

                ];
            },
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
            // @ts-ignore
            // this.accents.forEach(accent => accent.date = new Date(customer.date));
        });
    }

   
    openNew() {
        super.openNew();
        this.setOtherDefaultParameters();
    }

    save() {
        this.submitted = true;
        if (this.master.cuRate && this.master.orderDate && this.master.dueDate && this.master.cuRate > 0) {
            this.master.customer = this.selectedParty.id;
            this.master.cu = this.selectedCurrency.id;
            this.master.saleCost = this.selectedSaleAccount.id;
            this.setDefaultParameters();
            if(!this.master.famount) {
                this.master.famount = 0;
                this.master.amount = 0;
            }
            this.master.discountType = 1;
            this.master.paymentStatus = 0;
            this.master.deliveryStatus = 0;
            this.invoiceService.add(this.master).subscribe({
                next: (data) => {
                    this.master = data;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Invoice Saved', life: 3000 });
                    if(this.master.id > 0) {
                        setTimeout(() => {
                            this.dataService.changeObject(this.master);
                            this.router.navigate(['pages/invoiceDetails']);
                        }, 1000);
                    }
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
            });
        }
    }


    goDetails(invoice: SaleInvoiceDto) {
        this.invoiceService.getById(invoice.id).subscribe(
            {
                next: (data) => {
                    this.master = data;
                    this.master.customerName = invoice.customerPartyName;
                    this.master.cuCode = invoice.cuCurrencyCode;
                    this.master.saleCostName = invoice.saleCostName;
                    this.calculateNetAmount();
                    this.dataService.changeObject(this.master);
                    this.router.navigate(['pages/invoiceDetails']);
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
        });
    }

}

