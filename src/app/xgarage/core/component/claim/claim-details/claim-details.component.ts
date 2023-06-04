import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../../../service/claim.service';
import { GenericDetailsComponent } from 'src/app/xgarage/common/generic/genericdetailscomponent';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StatusService } from 'src/app/xgarage/common/service/status.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Status } from 'src/app/xgarage/common/model/status';
import { BidService } from '../../../service/bidservice.service';
import { BidDto } from '../../../dto/biddto';
import { BidOrderDto } from '../../../dto/bidorderdto';
import { OrderType } from '../../../dto/ordertype';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MessageResponse } from 'src/app/xgarage/common/dto/messageresponse';

@Component({
    selector: 'app-claim-details',
    templateUrl: './claim-details.component.html',
    providers: [MessageService, ConfirmationService, DatePipe]
})
export class ClaimDetailsComponent extends GenericDetailsComponent implements OnInit {
    supplierName: any;
    supplierId: number;
    originalBidList: BidDto[];

    constructor(private authService: AuthService, private bidService: BidService, public messageService: MessageService, public route: ActivatedRoute, public router: Router, public datePipe: DatePipe, public statusService: StatusService, private claimServie: ClaimService, public breadcrumbService: AppBreadcrumbService) {
        super(route, router, claimServie, datePipe, statusService, breadcrumbService);
    }

    claimId: number;
    isFetching: boolean = false;
    updateClaim: boolean = true;
    bidDetailsDialog: boolean = false;
    bidDto: BidDto[] = [];
    bidsByPart: any = [];
    selection: string = 'single';
    supplierBids: BidDto[] = []
    rejectBidDialog: boolean = false;
    approveBidDialog: boolean = false;
    currentBid: any = [];
    reqId: number;
    suppliersBidToCompare = [];
    displayCompareBids: boolean = false;
    modifiedBids = [];
    visible: boolean = true;
    deletePartDialog: boolean = false;
    partToBeDeleted: number;
    currentBidStatus: number;
    //id = JSON.parse(this.authService.getStoredUser()).id;

    ngOnInit(): void {
        //console.log(this.id)
        this.breadcrumbService.setItems([{ 'label': 'Claims', routerLink: ['claims'] }, { 'label': 'Claim Details', routerLink: ['claim-details'] }]);
        localStorage.removeItem('claimSelectedParts');
        this.claimId = JSON.parse(localStorage.getItem('claimId'));
        this.onGetClaimByClaimId();
        this.onGetClaimParts();
        this.getClaimBids();
    }

    onGetClaimByClaimId() {
        this.isFetching = true;
        this.claimServie.getById(this.claimId).subscribe(res => {
            this.master = res;
            localStorage.setItem('claim', JSON.stringify(this.master));
            this.reqId = JSON.parse(localStorage.getItem('claim')).request;
            // console.log(this.master)
            this.initActionMenu();
            this.isFetching = false;
        }, err => console.log(err))
    }

    onGetClaimParts() {
        this.claimServie.getClaimParts(this.claimId).subscribe(res => {

            this.details = res;
            console.log('parts', this.details);
        }, err => console.log(err))
    }

    getClaimBids() {
        this.bidService.getBidsByClaim(this.claimId).subscribe(res => {
            this.bidDto = res;
            console.log('claim bids', this.bidDto);
        }, err => console.log(err))
    }

    initActionMenu() {
        this.menuItems = [
            {
                label: 'Confirm', icon: 'pi pi-check', visible: ((this.master.status.id == 1 || this.master.status.id == 13 || this.master.status.id == 12)), command: () => {
                    const confirmStatus: Status = {
                        id: 11,
                        nameEn: 'Confirmed',
                        nameAr: 'مؤكد'
                    }
                    this.confirmStatus = confirmStatus;
                    this.confirmActionDialog = true;
                    console.log('confirmType: ', this.confirmType);
                }
            },
            {
                label: 'Cancel', icon: 'pi pi-times', visible: ((this.master.status.id == 1 || this.master.status.id == 13 || this.master.status.id == 12)), command: () => {
                    const cancelStatus: Status = {
                        id: 7,
                        nameEn: 'Canceled',
                        nameAr: 'ملغي'
                    }
                    this.confirmStatus = cancelStatus;
                    this.confirmActionDialog = true;
                }
            },
            {
                label: 'Print', icon: 'pi pi-print', command: () => {
                    this.print();
                }
            }

        ];
    }

    confirm() {
        if (this.confirmType === 'confirm') {
            this.claimServie.changeStatus(this.master.id, this.confirmStatus).subscribe({
                next: (data) => {
                    this.master.status = this.confirmStatus;
                    this.onGetClaimByClaimId();
                    this.updateCurrentObject(data);
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.statusMsg, life: 3000 })
            });
            this.confirmActionDialog = false;
        }
    }

    getStatus(id: number) {
        if (id == 1) {
            return 'Open';
        } else if (id == 2) {
            return 'Initial Approval';
        } else if (id == 3) {
            return 'OnHold';
        } else if (id == 4) {
            return 'Completed';
        } else if (id == 5) {
            return 'Rejected';
        } else {
            return '-';
        }
    }

    closeBidDialog() {
        this.bidDetailsDialog = false;
    }

    viewBid(bid: any) {
        // console.log(bid)
        this.supplierId = bid.supplierId;
        this.currentBidStatus = bid.statusId;
        this.currentBid = [];
        this.claimServie.getClaimBidByBidId(bid.bidId).subscribe(res => {
            console.log(res)
            this.currentBid = res;
            this.supplierName = this.bidDto[0].supplierName ? bid.supplierName : bid.userFirstName;
            if (this.supplierName && this.currentBid.length > 0) {
                this.bidDetailsDialog = true;
            }

        }, err => console.log(err))
    }

    approveBid() {
        let bidToApprove: BidOrderDto = this.prepareClaimBidToApprove();
        console.log(bidToApprove)
        this.bidService.approveBidByBidId(this.reqId, this.currentBid[0].bid).subscribe((res: MessageResponse) => {
            console.log(res)
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
            this.bidDetailsDialog = false;
            this.getClaimBids();
        }, err => {
            console.log(err)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message, life: 3000 });
        });

        // this.bidService.approveBid(bidToApprove).subscribe((res: MessageResponse) => {
        //     console.log(res)
        //     this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
        //     this.bidDetailsDialog = false;
        //     this.getClaimBids();
        // }, err => {
        //     console.log(err)
        //     this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message, life: 3000 });
        // });

        this.approveBidDialog = false;
    }

    rejectBid() {
        this.bidService.rejectBidByBidId(this.reqId, this.currentBid[0].bid).subscribe((res: MessageResponse) => {
            console.log(res)
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
            this.bidDetailsDialog = false;
            this.getClaimBids();
        }, err => {
            console.log(err)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message, life: 3000 });
        });

        this.rejectBidDialog = false;
    }

    prepareClaimBidToApprove() {
        let totalOrderAmount = 0;
        let totalVat = 0;
        let totalDiscount = 0;
        let totalTotalAmount = 0;
        let bids = [];

        this.currentBid.forEach(bid => {
            totalOrderAmount = totalOrderAmount + bid.originalPrice;
            totalVat = totalVat + bid.vat;
            totalDiscount = totalDiscount + bid.discount;
            totalTotalAmount = totalTotalAmount + bid.price;
            bids.push(bid.bid);
        });

        let bidToApprove = {
            bids: bids,
            shippingAddress: 1,
            shippingMethod: 1,
            paymentMethod: 1,
            orderType: OrderType.Bid,
            customer: JSON.parse(this.authService.getStoredUser()).id,
            phone: JSON.parse(this.authService.getStoredUser()).phone,
            supplier: this.supplierId,
            deliveryFees: 0,
            orderDate: new Date(),
            orderAmount: totalOrderAmount,
            vat: totalVat,
            discount: totalDiscount,
            totalAmount: totalTotalAmount
        };

        return bidToApprove;
    }

    onToggleBid(supplierBid) {
        this.claimServie.getClaimBidByBidId(supplierBid.bidId).subscribe(res => {
            //console.log(res)
            res.forEach(res => {
                if (res.added) {
                    if (res.added == true) {
                        res.added = false;
                        this.suppliersBidToCompare = this.suppliersBidToCompare.filter(bid => {
                            return bid.bidId !== res.bidId
                        });
                    } else {
                        this.suppliersBidToCompare.push(res);
                    }
                } else {
                    res.added = true;
                    res.supplierId = supplierBid.supplierId;
                    res.supplierName = supplierBid.supplierName;
                    this.suppliersBidToCompare.push(res);
                }


                //console.log(this.suppliersBidToCompare);

            })
        }, err => console.log(err));

    }

    onCompareBids() {
        this.modifiedBids = [];
        this.suppliersBidToCompare.forEach(bid => {
            let i = this.modifiedBids.find(modifieddBid => modifieddBid.part == bid.part.name);
            if (!i) {
                this.modifiedBids.push({ part: bid.part.name, bids: [] });
            }
        })


        this.modifiedBids.forEach(bid => {
            this.suppliersBidToCompare.forEach(sup => {
                if (sup.part.name == bid.part) {
                    bid.bids.push(sup)
                }
            })
        })

        // console.log(this.modifiedBids);
        if (this.modifiedBids.length !== 0 && this.modifiedBids[0].bids.length >= 2) {
            this.displayCompareBids = true;
        } else {
            this.messageService.add({ severity: 'error', summary: 'please select 2 or more bids to comapre' });
        }

    }

    onHideCompareBids() {
        this.suppliersBidToCompare.forEach(bid => {
            delete bid.added;
        });

        this.suppliersBidToCompare = [];
        this.modifiedBids = [];
        this.visible = false;
        setTimeout(() => this.visible = true, 0);
    }

    onEditClaim() {
        if (this.details.length !== 0) {
            localStorage.setItem('claimSelectedParts', JSON.stringify(this.details));
        }

        this.router.navigateByUrl('/edit-claim');
    }

    deletePart(id: number) {
        this.deletePartDialog = true;
        this.partToBeDeleted = id;
    }

    confirmDeletePart() {
        this.claimServie.deleteClaimPartByPartId(this.partToBeDeleted).subscribe(res => {
            console.log(res);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Claim Part deleted.', life: 3000 });
            this.onGetClaimParts();
            this.deletePartDialog = false;
        }, err => {
            console.log(err);
            if (err.status == 200) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Claim Part deleted.', life: 3000 });
                this.onGetClaimParts();
                this.deletePartDialog = false;
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete claim part', life: 3000 })
                this.deletePartDialog = false;
            }
        })
    }

}
