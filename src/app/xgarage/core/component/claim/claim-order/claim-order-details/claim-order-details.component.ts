import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { GenericDetailsComponent } from 'src/app/xgarage/common/generic/genericdetailscomponent';
import { Status } from 'src/app/xgarage/common/model/status';
import { BidService } from 'src/app/xgarage/core/service/bidservice.service';
import { ClaimService } from 'src/app/xgarage/core/service/claim.service';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { MessageResponse } from 'src/app/xgarage/common/dto/messageresponse';

@Component({
    selector: 'app-claim-order-details',
    templateUrl: './claim-order-details.component.html',
    styles: [''],
    providers: [MessageService, ConfirmationService, DatePipe]
})
export class ClaimOrderDetailsComponent extends GenericDetailsComponent implements OnInit {
    isLoading: boolean = false;

    constructor(public route: ActivatedRoute, public router: Router, private authService: AuthService,
        public breadcrumbService: AppBreadcrumbService, public datePipe: DatePipe,
        public messageService: MessageService, public confirmService: ConfirmationService,
        private bidService: BidService, private claimService: ClaimService) {
        super(route, router, null, datePipe, null, breadcrumbService)
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
    bidId: number;

    ngOnInit(): void {
        if (localStorage.getItem('claim-order')) {
            //masterDTO
            this.masterDto = JSON.parse(localStorage.getItem('claim-order'));
            this.getClaimOrder(this.masterDto.id);
            console.log(this.masterDto)
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
        this.breadcrumbService.setItems([{ 'label': 'Orders', routerLink: ['claim-orders'] }, { 'label': 'Order Details', routerLink: ['claim-order-details'] }]);
    }

    getClaimOrder(id: number) {
        this.bidService.getByOrder(id).subscribe(res => {
            //console.log(res)
            this.isLoading = true;
            this.bidId = res[0].bidId;
            this.getClaimBids(this.bidId);
            this.bidList.forEach(order => {
                order.taxAmount = (order.vat / 100) * (order.originalPrice * order.qty - order.discount);
                this.totalVat = this.totalVat + order.taxAmount;
            });
            // console.log('data:', this.bidList)
        }, err => {
            this.messageService.add({ severity: 'error', summary: 'Server Error', detail: err.error.statusMsg, life: 3000 });
            this.isLoading = false;
        });
    }

    getClaimBids(bidId: number) {
        //old implemnetaion
        this.claimService.getClaimBidByBidId(bidId).subscribe(res => {
            console.log('bid lists', res)
            // if (res.length == 1 && res[0].part == null) {
            //     this.claimService.getClaimParts(this.masterDto.id).subscribe(parts => {

            //         this.bidList = parts;
            //         console.log('parts', parts);

            //     }, err => console.log(err))
            // } else {
            //     this.bidList = res;
            // }

            this.bidList = res;

            this.bidList.forEach(order => {
                order.taxAmount = (order.vat / 100) * (order.originalPrice * order.qty - order.discount);
                this.totalVat = this.totalVat + order.taxAmount;
            });

            this.isLoading = false;
            // console.log('data:', this.bidList)
        }, err => {
            this.messageService.add({ severity: 'error', summary: 'Server Error', detail: err.error.statusMsg, life: 3000 });
            this.isLoading = false;
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
        console.log(this.confirmType)
        if (this.confirmType === 'email') {
            //this.getPdf();
        } else {
            let orderRequest: any = {
                sellerId: JSON.parse(this.authService.getStoredUser()).tenant.id,
                orderId: this.masterDto.id,
                multipleBid: true
            }
            this.bidService.changeClaimOrderStatus(this.bidId, this.confirmType).subscribe({
                next: (data) => {
                    if (data.messageCode == 200) {
                        this.messageService.add({ severity: 'info', summary: this.confirmStatus.nameEn, detail: data.message, life: 3000 });
                        // this.getClaimOrder(this.masterDto.id);
                    } else {
                        this.messageService.add({ severity: 'error', summary: this.confirmStatus.nameEn, detail: data.message, life: 3000 });
                    }
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.message.errorMsg, life: 3000 })
            });
        }
        this.confirmActionDialog = false;
    }

    // getPdf() {
    //     this.sending = true;
    //     this.isPdf = true;
    //     const width = this.invoice.nativeElement.clientWidth;
    //     const height = this.invoice.nativeElement.clientHeight + 40;

    //     domtoimage
    //         .toPng(this.invoice.nativeElement, {
    //             width: width,
    //             height: height
    //         })
    //         .then(result => {
    //             let pdf;
    //             if (width > height) {
    //                 pdf = new jsPDF('l', 'pt', [width + 50, height + 220]);
    //             } else {
    //                 pdf = new jsPDF('p', 'pt', [width + 50, height + 220]);
    //             }

    //             pdf.setFontSize(48);
    //             pdf.setTextColor('#2585fe');
    //             pdf.text('', 25, 75);
    //             pdf.setFontSize(24);
    //             pdf.setTextColor('#131523');
    //             // pdf.text('Report date: ' + moment().format('ll'), 25, 115);
    //             pdf.addImage(result, 'PNG', 25, 185, width, height);
    //             //pdf.save('lpo' + '.pdf');

    //             //send pdf to the server
    //             var blob = pdf.output('blob');
    //             var formData = new FormData();

    //             let orderInfo: OrderInfo = {
    //                 orderId: this.masterDto.id,
    //                 jobTitle: this.masterDto.jobTitle,
    //                 jobNumber: this.masterDto.jobNumber,
    //                 vinNumber: this.masterDto.chassisNumber,
    //                 supplierEmail: this.masterDto.supplierEmail,
    //                 customerName: this.masterDto.customerName,
    //                 netAmount: this.masterDto.totalAmount
    //             }

    //             let stringOrderInfo = JSON.stringify(orderInfo);

    //             let req = { "orderInfo": stringOrderInfo, "lpo": blob };

    //             for (var key in req) {
    //                 formData.append(key, req[key]);
    //             }

    //             console.log(formData)
    //             this.orderService.notify(formData).subscribe((res: MessageResponse) => {
    //                 console.log(res)
    //                 this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message });
    //                 this.sending = false;
    //                 this.isPdf = false;
    //             }, (err: MessageResponse) => {
    //                 this.messageService.add({ severity: 'error', summary: 'Server Error', detail: err.message });
    //                 this.sending = false;
    //                 this.isPdf = false;
    //             })
    //         })
    //         .catch(error => {
    //         });
    // }

}
