import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { OrderService } from '../../../service/order.service';
import { MessageResponse } from 'src/app/xgarage/common/dto/messageresponse';
import { Status } from 'src/app/xgarage/common/model/status';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BidService } from '../../../service/bidservice.service';
import { OrderInfo } from '../../../dto/orderinfo';

@Component({
    selector: 'order-details',
    templateUrl: './orderdetails.component.html',
    styleUrls: ['../../../../../demo/view/tabledemo.scss'],
    styles: [`
        .layout-invoice-page {
            width: auto;
    display: block!important;
        }
    `],
    providers: [MessageService, ConfirmationService, DialogService, DatePipe]
})
export class OrderDetailsComponent extends GenericDetailsComponent implements OnInit {

    constructor(private orderService: OrderService, public authService: AuthService, public route: ActivatedRoute, private dialogService: DialogService, public router: Router, private dataService: DataService<any>, public messageService: MessageService, public confirmService: ConfirmationService,
        public breadcrumbService: AppBreadcrumbService, public datePipe: DatePipe, private bidService: BidService) {
        super(route, router, null, datePipe, null, breadcrumbService);
    }
    dataCols: any[];
    pdfName: string = 'invoice';
    src: string = '';
    bidList: any = [];
    totalVat: number = 0;
    sending: boolean = false;
    taxAmount: number = 0;
    role: number = JSON.parse(this.authService.getStoredUser()).roles[0].id;
    @ViewChild('invoice') invoice!: ElementRef;
    isPdf: boolean = false;
    ngOnInit() {
        if (localStorage.getItem('order')) {
            console.log('last condition')
            //masterDTO
            this.masterDto = JSON.parse(localStorage.getItem('order'));
            this.getOrder(this.masterDto.id);
        }

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

    getOrder(id: number) {
        this.bidService.getByOrder(id).subscribe(res => {
            this.bidList = res;

            this.bidList.forEach(order => {
                order.taxAmount = (order.vat / 100) * (order.originalPrice * order.qty - order.discount);
                this.totalVat = this.totalVat + order.taxAmount;
            });

            //console.log('data:', this.bidList)
        }, err => {
            this.messageService.add({ severity: 'error', summary: 'Server Error', detail: err.error.statusMsg, life: 3000 })
        });
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


                    doc.addImage(newImage, 'PNG', 10, 10, width, height);
                    filename = 'order _' + '.pdf';

                    //download pdf
                    //doc.save(filename);

                    //send pdf to the server
                    var blob = doc.output('blob');
                    var formData = new FormData();

                    let orderInfo: OrderInfo = {
                        orderId: this.masterDto.id,
                        jobTitle: this.masterDto.jobTitle,
                        jobNumber: this.masterDto.jobNumber,
                        vinNumber: this.masterDto.chassisNumber,
                        supplierEmail: this.masterDto.supplierEmail,
                        customerName: this.masterDto.customerName,
                        netAmount: this.masterDto.totalAmount
                    }

                    let stringOrderInfo = JSON.stringify(orderInfo);

                    let req = { "orderInfo": stringOrderInfo, "lpo": blob };

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
                label: 'Send Order', icon: 'pi pi-envelope', visible: (this.masterDto.orderStatus == 'ACTIVE' && this.printAuth == true), command: () => {
                    this.confirmType = 'email';
                    this.confirmActionDialog = true;
                }
            },
            {
                label: 'Accept Order', icon: 'pi pi-check', visible: (this.masterDto.orderStatus == 'ACTIVE' && this.acceptAuth == true), command: () => {
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
                label: 'Cancel Order', icon: 'pi pi-times', visible: (this.masterDto.orderStatus == 'ACTIVE' && this.cancelAuth == true), command: () => {
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
            {
                label: 'Complete Order', icon: 'pi pi-check-circle', visible: (this.masterDto.orderStatus == 'Accepted' && this.completeAuth == true), command: () => {
                    const cancelStatus: Status = {
                        id: 7,
                        nameEn: 'Completed',
                        nameAr: 'مكتمل'
                    }
                    this.confirmType = 'complete';
                    this.confirmStatus = cancelStatus;
                    this.confirmActionDialog = true;
                }
            }
        ];
    }

    confirm() {
        if (this.confirmType === 'email') {
            // this.downloadPDF();
            this.getPdf();
        }else{
            let orderRequest: any = {
                sellerId: JSON.parse(this.authService.getStoredUser()).id,
                orderId: this.masterDto.id,
                multipleBid: true
            }
            this.orderService.changeOrderStatus(orderRequest, this.confirmType).subscribe({
                next: (data) => {
                    if (data.messageCode == 200) {
                        this.messageService.add({ severity: 'info', summary: this.confirmStatus.nameEn, detail: data.message, life: 3000 });
                    } else {
                        this.messageService.add({ severity: 'error', summary: this.confirmStatus.nameEn, detail: data.message, life: 3000 });
                    }
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.message.errorMsg, life: 3000 })
            });
        }
        this.confirmActionDialog = false;
    }

    getPdf() {
        this.sending = true;
        this.isPdf = true;
        const width = this.invoice.nativeElement.clientWidth;
        const height = this.invoice.nativeElement.clientHeight + 40;

        domtoimage
            .toPng(this.invoice.nativeElement, {
                width: width,
                height: height
            })
            .then(result => {
                let pdf;
                if (width > height) {
                    pdf = new jsPDF('l', 'pt', [width + 50, height + 220]);
                } else {
                    pdf = new jsPDF('p', 'pt', [width + 50, height + 220]);
                }

                pdf.setFontSize(48);
                pdf.setTextColor('#2585fe');
                pdf.text('', 25, 75);
                pdf.setFontSize(24);
                pdf.setTextColor('#131523');
                // pdf.text('Report date: ' + moment().format('ll'), 25, 115);
                pdf.addImage(result, 'PNG', 25, 185, width, height);
                //pdf.save('lpo' + '.pdf');

                //send pdf to the server
                var blob = pdf.output('blob');
                var formData = new FormData();

                let orderInfo: OrderInfo = {
                    orderId: this.masterDto.id,
                    jobTitle: this.masterDto.jobTitle,
                    jobNumber: this.masterDto.jobNumber,
                    vinNumber: this.masterDto.chassisNumber,
                    supplierEmail: this.masterDto.supplierEmail,
                    customerName: this.masterDto.customerName,
                    netAmount: this.masterDto.totalAmount
                }

                let stringOrderInfo = JSON.stringify(orderInfo);

                let req = { "orderInfo": stringOrderInfo, "lpo": blob };

                for (var key in req) {
                    formData.append(key, req[key]);
                }

                console.log(formData)
                this.orderService.notify(formData).subscribe((res: MessageResponse) => {
                    console.log(res)
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message });
                    this.sending = false;
                    this.isPdf = false;
                }, (err: MessageResponse) => {
                    this.messageService.add({ severity: 'error', summary: 'Server Error', detail: err.message });
                    this.sending = false;
                    this.isPdf = false;
                })
            })
            .catch(error => {
            });
    }

}

