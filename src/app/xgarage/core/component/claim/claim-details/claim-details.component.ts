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

@Component({
    selector: 'app-claim-details',
    templateUrl: './claim-details.component.html',
    providers: [MessageService, ConfirmationService, DatePipe]
})
export class ClaimDetailsComponent extends GenericDetailsComponent implements OnInit {
    supplierName: any;
    originalBidList: BidDto[];

    constructor(private bidService: BidService, public messageService: MessageService, public route: ActivatedRoute, public router: Router, public datePipe: DatePipe, public statusService: StatusService, private claimServie: ClaimService, public breadcrumbService: AppBreadcrumbService) {
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
    rejectMultipleBidDialog: boolean = false;
    approveMultipleBidDialog: boolean = false;
    currentBid: any[] = [];

    ngOnInit(): void {
        this.breadcrumbService.setItems([{ 'label': 'Claims', routerLink: ['claims'] }, { 'label': 'Claim Details', routerLink: ['claim-details'] }]);

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
            // console.log(this.master)
            this.initActionMenu();
            this.isFetching = false;
        }, err => console.log(err))
    }

    onGetClaimParts() {
        this.claimServie.getClaimParts(this.claimId).subscribe(res => {
            console.log('parts', res);
            this.details = res;

        }, err => console.log(err))
    }

    getClaimBids() {
        this.bidService.getBidsByClaim(this.claimId).subscribe(res => {
            this.bidDto = res;
            console.log('claim bids',this.bidDto)
            this.getBidsBySuppliers()
        }, err => console.log(err))
    }

    initActionMenu() {
        this.menuItems = [
            {
                label: 'Confirm', icon: 'pi pi-check', visible: (this.master.status.id == 1), command: () => {
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
                label: 'Cancel', icon: 'pi pi-times', visible: (this.master.status.id == 1), command: () => {
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


    getBidsBySuppliers() {
        this.supplierBids = this.bidDto.filter((a, i) => this.bidDto.findIndex((s) => a.supplierId === s.supplierId) === i);
        console.log(this.supplierBids)
    }


    getTotalPriceForSupplier(id: number) {
        let bidList = this.bidDto.filter(s => s.supplierId == id);
        return this.calculateDetailsSum(bidList);
    }

    getTotalSubmittedBidsForSupplier(id: number) {
        let bidList = this.bidDto.filter(s => s.supplierId == id);
        return bidList.length;
    }

    viewBidsBySupplier(bid: any) {
        console.log(bid)
        this.originalBidList = this.bidDto;
        this.selection = 'multiple';
        this.bidDetailsDialog = true;
        this.bidDto = this.bidDto.filter(b => b.supplierId == bid.supplierId);
        this.supplierName = bid.supplierName? bid.supplierName : bid.userFirstName;
    }


    viewBid(bid: any) {
        console.log(bid)
        this.currentBid = [];
        this.bidService.getBidByBidId(bid.bidId).subscribe(res => {
            console.log(res)
            this.currentBid.push(res);
            this.bidDetailsDialog = true;
        }, err => console.log(err))
    }

}
