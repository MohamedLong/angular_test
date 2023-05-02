import { Component, Input, OnInit } from '@angular/core';
import { PartService } from '../../../service/part.service';
import { PartType } from 'src/app/xgarage/common/model/parttype';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClaimService } from '../../../service/claim.service';

@Component({
    selector: 'app-new-claim-bid',
    templateUrl: './new-claim-bid.component.html',
    styles: [`.prices:not(:last-of-type) {
        display: none;
    }`]
})
export class NewClaimBidComponent implements OnInit {

    constructor(private partService: PartService, private claimService: ClaimService) { }

    @Input() requests: any[] = [];
    @Input() type: string = 'new bid';
    partTypes: PartType[] = [];
    bids: any[] = [];
    totalPrice: number = 0;
    totalServicePrice: number = 0;

    ngOnInit(): void {
        // console.log(this.requests)
        this.onGetPartTypes();
        this.requests.forEach(req => {
            this.setBid(req)
        });


        console.log(this.requests)
    }

    onGetPartTypes() {
        this.partService.getPartTypes().subscribe(res => {
            this.partTypes = res;
        }, err => console.log(err))
    }

    onRowEditSave(part: any) {
        this.totalPrice = 0;
        this.totalServicePrice =0;

        var isFound = this.bids.find(bid => {
            return bid.id == part.id;
        })

        if (isFound) {
            isFound = part;
        } else {
            this.bids.push(part);
        }

        this.bids.forEach(bid => {
            this.totalPrice = this.totalPrice + bid.price;
            this.totalServicePrice = this.totalServicePrice + bid.servicePrice;
        })

        console.log(this.bids)

    }

    onSubmitBid() {
        console.log(this.bids);
        this.bids.forEach(bid => {
            bid.partType = bid.partType.id
        })

        this.claimService.saveClaimBid(this.bids). subscribe(res => {
            console.log(res)
        }, err => console.log(err))
    }

    setBid(part) {
        part.bid = 0,
            part.partType = { id: 1, partType: 'Genuine-OEM' },
            part.requestFor = part.partOption,
            part.partOption = part.partOption,
            // part.qty = 0,
            part.price = 0,
            part.servicePrice = 0,
            // part.discount = 0,
            // part.discountType = '',
            // part.vat = 0,
            // part.originalPrice = 0,
            part.warranty = 0,
            part.availability = 0
    }

}
