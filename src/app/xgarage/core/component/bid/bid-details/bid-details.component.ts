import { Component, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { BidDto } from '../../../dto/biddto';
import { BidService } from '../../../service/bidservice.service';
import { JobService } from '../../../service/job.service';
import { ClaimService } from '../../../service/claim.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
    selector: 'app-bid-details',
    templateUrl: './bid-details.component.html',
    styles: ['.active {border-bottom: 2px solid #6366F1 !important;border-radius: 0;}'],
    providers: [MessageService, ConfirmationService]
})
export class BidDetailsComponent implements OnInit {
    bids: any[] = [];
    fillteredBids: any[] = [];
    displayModal: boolean = false;
    displaylumpsumModal: boolean = false;
    bidDetails: BidDto[] = [];
    loading: boolean = false;
    status: any[] = ["All"];
    selectedState = 'All';
    pageNo: number = 0;
    user: number = JSON.parse(this.authService.getStoredUser()).roles[0].id;
    typeOfBid: string = this.user == 1 ? 'claim bid' : 'job bid';
    lumpsumTotal: number;

    constructor(private authService: AuthService, private breadcrumbService: AppBreadcrumbService, private bidService: BidService, private jobService: JobService, private msgService: MessageService, private claimService: ClaimService, private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        if (this.user == 1) {
            this.getClaimBids();
        } else {
            this.getJobBids(this.pageNo);
        }

        this.breadcrumbService.setItems([{ 'label': 'My Bids', 'routerLink': ['bids'] }]);
    }

    getJobBids(page: number) {
        this.loading = true;
        this.jobService.getBidsByJob(page).subscribe({
            next: (res) => {
                console.log(res)
                res.reverse();
                this.bids = res;
                this.fillteredBids = res

                this.loading = false;
                this.setStatusNames(this.bids);
            },
            error: (e) => {
                this.msgService.add({ severity: 'error', summary: 'Server Information', detail: e.error.message, life: 3000 });
                this.loading = false;
            }
        });
    }

    getClaimBids() {
        this.loading = true;
        this.claimService.getClaimBids().subscribe({
            next: (res) => {
                //console.log(res)
                res.reverse();
                this.bids = res;
                this.fillteredBids = res;

                this.loading = false;
                this.setStatusNames(this.bids);
            },
            error: (e) => {
                this.msgService.add({ severity: 'error', summary: 'Server Information', detail: e.error.message, life: 3000 });
                this.loading = false;
            }
        });
    }

    onBidView(bid) {
        console.log(bid)
        if (this.user == 1) {
            this.claimService.getClaimBidByBidId(bid.bidId).subscribe(res => {
                if (res.length > 0) {
                    this.bidDetails = res;
                    this.bidDetails[0].requestTitle = bid.claimTitle;
                    this.bidDetails[0].statusId = bid.status == "Open"? 1 : 2;
                    if (this.bidDetails[0].originalPrice == 0) {

                        this.bidDetails[0].partName = bid.partNames;
                        this.bidDetails[0].statusId = bid.status;
                        this.displaylumpsumModal = true;
                        this.lumpsumTotal = bid.lumpSumPrice;
                        console.log('this is lump sum', this.bidDetails[0].statusId)
                    } else {
                        console.log('this is regular bid')
                        this.displayModal = true;
                    }

                } else {
                    this.msgService.add({ severity: 'info', summary: 'This claim has no bids', life: 3000 });
                }

            }, err => {
                console.log(err)
            })
        } else {
            this.bidService.getByJob(bid.id).subscribe(res => {
                if (res.length > 0) {
                    this.bidDetails = res;
                    this.displayModal = true;
                } else {
                    this.msgService.add({ severity: 'info', summary: 'This job has no bids', life: 3000 });
                }

            }, err => {
                console.log(err)
            })
        }
    }

    setStatusNames(arr) {
        let names = [];
        arr.forEach(element => {
            names.push(element.jobStatus);
        });

        if (names.length > 0) {
            names.forEach(name => {
                if (!this.status.includes(name)) {
                    this.status.push(name);
                }
            });
        }
    }

    filterByStatus(state: any) {
        this.selectedState = state;
        if (state == 'All') {
            this.fillteredBids = this.bids;
        } else {
            this.fillteredBids = this.bids.filter(bid => {
                return bid.jobStatus == state;
            });
        }
    }

    loadBids(e) {
        //console.log(e);
        if (this.fillteredBids.length == 100) {
            if ((this.fillteredBids.length - e.first) <= 10) {
                this.pageNo++;
                this.getJobBids(this.pageNo);
            }
        }
    }

    onCancelBid(id: number) {
        this.bidService.cancelBid(id).subscribe({
            next: (data) => {
                this.msgService.add({ severity: 'success', summary: 'Successful', detail: 'Bids Cancelled Successfully', life: 3000 });
                this.displaylumpsumModal = false;
            },
            error: (e) => {
                this.msgService.add({ severity: 'error', summary: 'Server Error', detail: e.error.message, life: 3000 })
                this.displaylumpsumModal = false;
            }
        });
    }

    confirmCancel(id: number) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to cancel this bid?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.onCancelBid(id);
            },
            reject: (type) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.msgService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                        this.displaylumpsumModal = false;
                        break;
                    case ConfirmEventType.CANCEL:
                        this.msgService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
                        this.displaylumpsumModal = false;
                        break;
                }
            }
        });
    }

}
