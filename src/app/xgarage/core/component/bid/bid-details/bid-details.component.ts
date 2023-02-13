import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
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
    status: any[] = [{state: "All", count: 0}];
    selectedState = 'All';
    constructor(private bidService: BidService, private jobService: JobService, private msgService: MessageService) { }

    ngOnInit(): void {
        this.getBids()
    }

    getBids() {
        this.loading = true;
        this.jobService.getBidsByJob().subscribe(res => {
            console.log(res)
            this.bids = res;
            this.fillteredBids = res;
            this.loading = false;
            this.status[0].count = this.bids.length;
            this.setStatusNames(this.bids)
        });
    }

    onBidView(event) {
        // console.log(event)
        this.bidService.getByJob(event.id).subscribe(res => {
            if(res.length > 0) {
                this.jobBids = res;
                this.displayModal = true;
            } else {
                this.msgService.add({ severity: 'erorr', summary: 'this job has no bids', detail: ''})
            }

        }, err => {
            console.log(err)
        })
    }

    setStatusNames(arr) {
        let names = [];
        arr.forEach(element => {
            names.push({state: element.jobStatus, count: 1});
        });

        if (names.length > 0) {
            names.forEach((name, index) => {
                if (this.status[index].state !== name.state) {
                    this.status.push(name);
                } else {
                    this.status[index].count = this.status[index].count + 1;
                }
            });
        }
    }

    filterByStatus(state: any) {
        this.selectedState = state.state;
        if (state.state == 'All') {
            this.fillteredBids = this.bids;
        } else {
            this.fillteredBids = this.bids.filter(bid => {
                return bid.jobStatus == state.state;
            });
        }
    }

}
