import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { GenericDetailsComponent } from 'src/app/xgarage/common/generic/genericdetailscomponent';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/xgarage/common/generic/dataservice';
import { DatePipe } from '@angular/common';
import domtoimage from 'dom-to-image';
@Component({
    selector: 'order-details',
    templateUrl: './orderdetails.component.html',
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
    providers: [MessageService, ConfirmationService, DialogService, DatePipe]
})
export class OrderDetailsComponent extends GenericDetailsComponent implements OnInit {

    constructor(public route: ActivatedRoute, private dialogService: DialogService, public router: Router, private dataService: DataService<any>, public messageService: MessageService, public confirmService: ConfirmationService,
        public breadcrumbService: AppBreadcrumbService, public datePipe: DatePipe) {
        super(route, router, null, datePipe, null, breadcrumbService);
    }
    dataCols: any[];
    pdfName: string = 'invoice';
    src: string = '';
    order: any = '';
    totalVat: number = 0;
    @ViewChild('invoice') invoice!: ElementRef;

    ngOnInit() {
        this.master = JSON.parse(localStorage.getItem('orderData'));
        this.order = JSON.parse(localStorage.getItem('order'));

        console.log(this.master, this.order)

        this.master.forEach(element => {
            this.totalVat = this.totalVat + element.vat;
        });

        this.dataCols = [
            { field: 'bidId', header: 'SL.NO' },
            { field: 'partName', header: 'PRODUCT NAME' },
            { field: 'unit', header: 'PRODUCT UNIT' },
            { field: 'qty', header: 'PROD QTY' },
            { field: 'price', header: 'UNIT RATE' },
            { field: 'price', header: 'UNIT VALUE' },
            { field: 'discount', header: 'DISC' },
            // { field: 'vat', header: 'TAX' },
            { field: 'vat', header: 'TAX AMT' },
            { field: 'price', header: 'LINE VALUE' }
        ];

    }

    getPdf() {
        domtoimage.toPng(this.invoice.nativeElement)
            .then((dataUrl) => {
                this.src = dataUrl;
                console.log(dataUrl)
                let a = document.createElement('a');
                document.body.appendChild(a);
                a.download = 'invoice';
                a.href = dataUrl;
                a.click();
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    }

}

