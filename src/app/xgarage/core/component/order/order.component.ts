import { DatePipe } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DataService } from 'src/app/xgarage/common/generic/dataservice';
import { GenericComponent } from 'src/app/xgarage/common/generic/genericcomponent';
import { OrderService } from '../../service/order.service';

@Component({
    selector: 'order',
    templateUrl: './order.component.html',
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
export class OrderComponent extends GenericComponent implements OnInit {

    constructor(private authService: AuthService, private orderService: OrderService, public route: ActivatedRoute, private router: Router, private dataService: DataService<any>, public confirmationService: ConfirmationService,
        public messageService: MessageService, public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService) {
            super(route, datePipe, breadcrumbService);
    }

    role: number = JSON.parse(this.authService.getStoredUser()).roles[0].id;

    ngOnInit(): void {
        this.getAll();
    }

    getAll() {
        this.orderService.getForUser().subscribe(res => {
            console.log(res)
            this.masterDtos = res;
        }, err => {
            this.messageService.add({ severity: 'error', summary: 'Server Error', detail: err.error.statusMsg, life: 3000 })
        })
        // this.invoiceService.getAllSaleInvoices().subscribe({
        //     next: (invoices) => {
        //         // currencies.forEach(currency => this.currencyService.savecurrency(currency).subscribe());
        //         this.masterDtos = invoices;
        //         this.loading = false;
        //         this.masterDtos = this.updateCalculatedAmounts(this.masterDtos);
        //         this.cols = [
        //             { field: 'id', header: 'ID' },
        //             { field: 'orderId', header: 'performa No' },
        //             { field: 'orderDate', header: 'performa Date' },
        //             { field: 'insertDate', header: 'Insert Date' },
        //             { field: 'customerPartyName', header: 'Customer Name' },
        //             { field: 'netamount', header: 'Total' },
        //             { field: 'statusNameEn', header: 'Status' },
        //             { field: 'statusNameAr', header: 'Status' },
        //             { field: 'paymentStatus', header: 'Payment Status' },
        //             { field: 'deliveryStatus', header: 'Delivery Status' },
        //             { field: 'cuCurrencyCode', header: 'Cu' },
        //             { field: 'processId', header: 'Process Id' }

        //         ];
        //     },
        //     error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
        //     // @ts-ignore
        //     // this.accents.forEach(accent => accent.date = new Date(customer.date));
        // });
    }


    openNew() {
        super.openNew();
        //this.setOtherDefaultParameters();
    }

    save() {
        this.submitted = true;

    }


    goDetails(invoice: any) {
        // this.invoiceService.getById(invoice.id).subscribe(
        //     {
        //         next: (data) => {
        //             this.master = data;
        //             this.master.customerName = invoice.customerPartyName;
        //             this.master.cuCode = invoice.cuCurrencyCode;
        //             this.master.saleCostName = invoice.saleCostName;
        //             this.calculateNetAmount();
        //             this.dataService.changeObject(this.master);
        //             this.router.navigate(['pages/invoiceDetails']);
        //         },
        //         error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
        // });
    }

}

