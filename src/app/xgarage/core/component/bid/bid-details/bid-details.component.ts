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
    bids: BidDto[] = [];
    cols: any[];
  constructor(private bidService: BidService, private jobService: JobService) { }

  ngOnInit(): void {
    this.getBids()
  }

  getBids() {
    this.jobService.getBidsByJob().subscribe((res: MessageResponse)=> {
        console.log(res)
    });

    this.cols = [
        { field: 'code', header: 'Vehicle Info' },
        { field: 'name', header: 'Client' },
        { field: 'category', header: 'Parts' },
        { field: 'quantity', header: 'Bid Closing Date' },
        { field: 'quantity', header: 'Status' },
        { field: 'quantity', header: 'Total Price' },
        { field: 'quantity', header: 'Action' }
    ];
  }

}
