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
import jsPDF from 'jspdf';
import { OrderService } from '../../service/order.service';
import { MessageResponse } from 'src/app/xgarage/common/dto/messageresponse';
import { Status } from 'src/app/xgarage/common/model/status';
@Component({
    selector: 'order-details',
    templateUrl: './orderdetails.component.html',
    styleUrls: ['../../../../demo/view/tabledemo.scss'],
    styles: [`
        .layout-invoice-page {
            width: auto;
    display: block!important;
        }
    `],
    providers: [MessageService, ConfirmationService, DialogService, DatePipe]
})
export class OrderDetailsComponent extends GenericDetailsComponent implements OnInit {

    constructor(private orderService: OrderService, public route: ActivatedRoute, private dialogService: DialogService, public router: Router, private dataService: DataService<any>, public messageService: MessageService, public confirmService: ConfirmationService,
        public breadcrumbService: AppBreadcrumbService, public datePipe: DatePipe) {
        super(route, router, null, datePipe, null, breadcrumbService);
    }
    dataCols: any[];
    pdfName: string = 'invoice';
    src: string = '';
    masterDto: any = '';
    bidList: any = [];
    totalVat: number = 0;
    sending: boolean = false;
    taxAmount: number = 0;
    @ViewChild('invoice') invoice!: ElementRef;

    ngOnInit() {
        this.bidList = JSON.parse(localStorage.getItem('orderData'));

        //masterDTO
        this.masterDto = JSON.parse(localStorage.getItem('order'));

        console.log('order:', this.masterDto)
        this.bidList.forEach(order => {
            order.taxAmount = (order.vat / 100) * (order.originalPrice * order.qty - order.discount);
            this.totalVat = this.totalVat + order.taxAmount;
        });

        console.log('data:', this.bidList)

        this.dataCols = [
            { field: 'bidId', header: 'SL.NO' },
            { field: 'partName', header: 'PRODUCT NAME' },
            { field: 'unit', header: 'PRODUCT UNIT' },
            { field: 'qty', header: 'PROD QTY' },
            { field: 'price', header: 'UNIT RATE' },
            { field: 'price', header: 'UNIT VALUE' },
            { field: 'discount', header: 'DISC' },
            { field: 'vat', header: 'TAX%' },
            { field: 'taxAmount', header: 'TAX AMT' },
            { field: 'price', header: 'LINE VALUE' }
        ];

        this.initActionMenu();
        this.breadcrumbService.setItems([{ 'label': 'Orders', routerLink: ['orders'] }, { 'label': 'Order Details', routerLink: ['order-details'] }]);
    }

    downloadPDF() {
        this.sending = true;
        var node = this.invoice.nativeElement;

        var img;
        var filename;
        var newImage;


        domtoimage.toPng(node, { bgcolor: '#fff' })

            .then((dataUrl) => {

                img = new Image();
                img.src = dataUrl;
                newImage = img.src;

                img.onload = () => {

                    var pdfWidth = img.width;
                    var pdfHeight = img.height;

                    // FileSaver.saveAs(dataUrl, 'my-pdfimage.png'); // Save as Image

                    var doc;

                    if (pdfWidth > pdfHeight) {
                        doc = new jsPDF('l', 'px', [pdfWidth, pdfHeight]);
                    }
                    else {
                        doc = new jsPDF('p', 'px', [pdfWidth, pdfHeight]);
                    }


                    var width = doc.internal.pageSize.getWidth();
                    var height = doc.internal.pageSize.getHeight();

                    //download pdf
                    doc.addImage(newImage, 'PNG', 10, 10, width, height);
                    filename = 'order _' + '.pdf';
                    //doc.save(filename);

                    //send pdf to the server
                    var blob = doc.output('blob');
                    var formData = new FormData();

                    let req = { "orderId": this.masterDto.id, "lpo": blob };

                    for (var key in req) {
                        formData.append(key, req[key]);
                    }

                    this.orderService.notify(formData).subscribe((res: MessageResponse) => {
                        //console.log(res)
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message });
                        this.sending = false;
                    }, (err: MessageResponse) => {
                        this.messageService.add({ severity: 'error', summary: 'Server Error', detail: err.message });
                        this.sending = false;
                    })
                };


            })
            .catch(function (error) {
                // Error Handling
            });
    }

    initActionMenu() {
        this.menuItems = [
            {
                label: 'Send Order', icon: 'pi pi-envelope', command: () => {
                    this.confirmType = 'email';
                    this.confirmActionDialog = true;
                }
            },
            {
                label: 'Accept Order', icon: 'pi pi-check', visible: (this.masterDto.orderStatus == 'ACTIVE'), command: () => {
                    const confirmStatus: Status = {
                        id: 6,
                        nameEn: 'Accept',
                        nameAr: 'مؤكد'
                    }
                    this.confirmType = 'accept';
                    this.confirmStatus = confirmStatus;
                    this.confirmActionDialog = true;
                }
            },
            {
                label: 'Cancel Order', icon: 'pi pi-times', visible: (this.masterDto.orderStatus == 'ACTIVE'), command: () => {
                    const cancelStatus: Status = {
                        id: 7,
                        nameEn: 'Canceled',
                        nameAr: 'ملغي'
                    }
                    this.confirmType = 'cancel';
                    this.confirmStatus = cancelStatus;
                    this.confirmActionDialog = true;
                }
            },
        ];
    }

    confirm() {
        if (this.confirmType === 'accept') {
            this.orderService.changeStatus(this.masterDto.id, this.confirmStatus).subscribe({
                next: (data) => {
                    this.updateCurrentObject(data);
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
            });
        }else if(this.confirmType === 'cancel') {
            this.orderService.changeStatus(this.masterDto.id, this.confirmStatus).subscribe({
                next: (data) => {
                    this.updateCurrentObject(data);
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
            });
        }else if(this.confirmType === 'email') {
            this.downloadPDF();
        }
        this.confirmActionDialog = false;
    }
}

