import { Component, OnInit } from '@angular/core';
import { MessageResponse } from 'src/app/xgarage/common/dto/messageresponse';
import { BidDto } from '../../../dto/biddto';
import { BidService } from '../../../service/bidservice.service';
import { JobService } from '../../../service/job.service';

@Component({
    selector: 'app-bid-details',
    templateUrl: './bid-details.component.html',
    styles: ['']
})
export class BidDetailsComponent implements OnInit {
    bids: any[] = [];
    cols: any[];
    displayModal: boolean = false;
    jobBids: BidDto[] = [];
    constructor(private bidService: BidService, private jobService: JobService) { }

    ngOnInit(): void {
        this.getBids()
    }

    getBids() {
        this.jobService.getBidsByJob().subscribe(res => {
            this.bids = res;
            this.cols = [
                { field: 'jobTitle', header: 'Vehicle Info' },
                { field: 'client', header: 'Client' },
                { field: 'partNames', header: 'Parts' },
                { field: 'status', header: 'Status' },
                { field: 'totalPrice', header: 'Total Price' }
            ];
        });
    }

    onBidSelect(event) {
        this.bidService.getByJob(event.data.id).subscribe(res => {
            // console.log(res)
            this.jobBids = res;
            this.displayModal = true;
        }, err => {
            console.log(err)
        })
    }

}
