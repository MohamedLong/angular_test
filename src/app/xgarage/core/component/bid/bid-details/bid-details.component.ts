import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MessageResponse } from 'src/app/xgarage/common/dto/messageresponse';
import { BidDto } from '../../../dto/biddto';
import { BidService } from '../../../service/bidservice.service';
import { JobService } from '../../../service/job.service';

@Component({
    selector: 'app-bid-details',
    templateUrl: './bid-details.component.html',
    styles: ['.active {border-bottom: 2px solid #6366F1 !important;border-radius: 0;}'],
    providers: [MessageService]
})
export class BidDetailsComponent implements OnInit {
    bids: any[] = [];
    fillteredBids: any[] = [];
    displayModal: boolean = false;
    jobBids: BidDto[] = [];
    loading: boolean = false;
    status: any[] = ["All"];
    selectedState = 'All';
    pageNo: number = 0;
    constructor(private breadcrumbService: AppBreadcrumbService, private bidService: BidService, private jobService: JobService, private msgService: MessageService) { }

    ngOnInit(): void {
        this.getBids(this.pageNo);
        this.breadcrumbService.setItems([{'label': 'My Bids', 'routerLink': ['bids']}]);
    }

    getBids(page: number) {
        this.loading = true;
        this.jobService.getBidsByJob(page).subscribe({
            next: (res) => {
                console.log(res)
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

    onBidView(job: any) {
        // console.log(event)
        this.bidService.getByJob(job.id).subscribe(res => {
            if(res.length > 0) {
                this.jobBids = res;
                this.displayModal = true;
            } else {
                this.msgService.add({ severity: 'info', summary: 'this job has no bids', life: 3000 });
            }

        }, err => {
            console.log(err)
        })
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
                this.getBids(this.pageNo);
            }
        }
    }

}
