import { DatePipe } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DataService } from 'src/app/xgarage/common/generic/dataservice';
import { GenericComponent } from 'src/app/xgarage/common/generic/genericcomponent';
import { BidService } from '../../service/bidservice.service';
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

    constructor(private bidService: BidService, private authService: AuthService, private orderService: OrderService, public route: ActivatedRoute, private router: Router, private dataService: DataService<any>, public confirmationService: ConfirmationService,
        public messageService: MessageService, public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService) {
            super(route, datePipe, breadcrumbService);
    }

    role: number = JSON.parse(this.authService.getStoredUser()).roles[0].id;
    pageNo: number = 0;

    ngOnInit(): void {
        this.getAll(this.pageNo);
        this.breadcrumbService.setItems([{'label': 'Orders', 'routerLink': ['orders']}]);
    }

    getAll(page: number) {
        this.orderService.getForTenant(page).subscribe(res => {
            //console.log(res)
            this.masterDtos = res;
            this.cols = [
                { field: 'id', header: 'id' },
                { field: 'createdAt', header: 'Brand Name' },
                { field: 'customerName', header: 'Car Model' },
                { field: 'supplierName', header: 'Model Type' },
                { field: 'jobNumber', header: 'Model Year' },
                { field: 'orderAmount', header: 'Order Amount' },
                { field: 'totalAmount', header: 'Total Amount' },
                { field: 'orderStatus', header: 'Order Status' },
                { field: 'deliveryFees', header: 'Delivery Fees' }
            ];
        }, err => {
            this.messageService.add({ severity: 'error', summary: 'Server Error', detail: err.error.statusMsg, life: 3000 })
        })
    }

    loadOrders(e) {
        //console.log(e);
        if (this.masterDtos.length == 50) {
            if ((this.masterDtos.length - e.first) <= 10) {
                this.pageNo++;
                this.getAll(this.pageNo);
            }
        }
    }


    goOrderDetails(order: any) {
        this.bidService.getByOrder(order.id).subscribe(
            {
                next: (data) => {
                    this.master = data;
                    localStorage.removeItem('orderData');
                    localStorage.removeItem('order');

                    localStorage.setItem('orderData', JSON.stringify(this.master));
                    localStorage.setItem('order', JSON.stringify(order));
                    this.router.navigate(['order-details']);
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
            });
    }

}

