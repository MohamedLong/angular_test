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

    billData: any[];

    billCols: any[];

    productData: any[];

    productCols: any[];
    pdfName: string = 'invoice';
    src: string = '';
    @ViewChild('invoice') invoice!: ElementRef;

    ngOnInit() {
        this.billData = [
            {
                slno: 1,
                productName: 'rear door rh assy',
                qty: 1,
                unit: 'no3',
                rate: '304.000',
                value: '304.000',
                disc: '5',
                tax: '15.200',
                amount: '319.200',
                lineVal: '319.23',
            },
            {
                slno: 2,
                productName: 'rh foot step assy',
                qty: 5,
                unit: 'no3',
                rate: '304.000',
                value: '304.000',
                disc: '5',
                tax: '3.610',
                amount: '90.2',
                lineVal: '75.610',
            }
        ];

        this.billCols = [
            { field: 'slno', header: 'SL.NO' },
            { field: 'productName', header: 'PRODUCT NAME' },
            { field: 'unit', header: 'PRODUCT UNIT' },
            { field: 'qty', header: 'PROD QTY' },
            { field: 'rate', header: 'UNIT RATE' },
            { field: 'value', header: 'UNIT VALUE' },
            { field: 'disc', header: 'DISC' },
            { field: 'tax', header: 'TAX' },
            { field: 'amount', header: 'TAX AMT' },
            { field: 'lineVal', header: 'LINE VALUE' }
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

