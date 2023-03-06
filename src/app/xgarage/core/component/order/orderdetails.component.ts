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
    order: any = '';
    totalVat: number = 0;
    sending: boolean = false;
    @ViewChild('invoice') invoice!: ElementRef;

    ngOnInit() {
        this.master = JSON.parse(localStorage.getItem('orderData'));
        this.order = JSON.parse(localStorage.getItem('order'));
        console.log('data:', this.master)
        console.log('order:', this.order)
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
            { field: 'vat', header: 'TAX AMT %' },
            { field: 'price', header: 'LINE VALUE' }
        ];

        this.initActionMenu();
        this.breadcrumbService.setItems([{ 'label': 'Orders', routerLink: ['orders'] }, { 'label': 'Order Details', routerLink: ['order-details'] }]);
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

                    let req = { "orderId": this.order.id, "lpo": blob };

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
                label: 'Send Email', icon: 'pi pi-email', command: () => {
                    this.downloadPDF()
                }
            }
        ];
    }

    printPage() {
        window.frames["print_frame"].window.focus();
        setTimeout(function() {
            window.frames["print_frame"].window.print();
        }, 0);
    }
}

