import { Component, Input, OnInit } from '@angular/core';
import { PartService } from '../../../service/part.service';
import { PartType } from 'src/app/xgarage/common/model/parttype';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClaimService } from '../../../service/claim.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BidService } from '../../../service/bidservice.service';
import { MessageResponse } from 'src/app/xgarage/common/dto/messageresponse';

@Component({
    selector: 'app-new-claim-bid',
    templateUrl: './new-claim-bid.component.html',
    styles: [`.prices:not(:last-of-type) {
        display: none;
    }`],
    providers: [MessageService]
})
export class NewClaimBidComponent implements OnInit {

    constructor(private bidService: BidService ,private authService: AuthService,private partService: PartService, private claimService: ClaimService, private messageService: MessageService) { }

    @Input() requests: any[] = [];
    @Input() type: string = 'new bid';
    partTypes: PartType[] = [];
    bids: any[] = [];
    totalPrice: number = 0;
    totalServicePrice: number = 0;
    saving: boolean = false;

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
        this.totalServicePrice = 0;

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

        // console.log(this.bids)

        let date = new Date();
        let getYear = date.toLocaleString("default", { year: "numeric" });
        let getMonth = date.toLocaleString("default", { month: "2-digit" });
        let getDay = date.toLocaleString("default", { day: "2-digit" });

        console.log(part)
        let bidBody = {
            partName: part.part.name,
            voiceNote: null,
            images: [],
            order: null,
            cu: null,
            cuRate: 0,
            partType: { id: part.partType.id },
            bidDate: getYear + "-" + getMonth + "-" + getDay,
            price: part.price,
            request: { id: 258 },
            servicePrice: part.servicePrice,
            supplier: JSON.parse(this.authService.getStoredUser()).id,
            comments: '',
            deliverDays: part.availability,
            warranty: part.warranty,
            location: '',
            discount: 0,
            discountType: 'fixed',
            vat: 0,
            originalPrice: 0,
            reviseVoiceNote: null,
            reviseComments: "",
            actionComments: "",
            qty: 1
        }

        let bid = { bidBody: JSON.stringify(bidBody), voiceNote: '' }
        let bidFormData = new FormData();
        for (var key in bid) {
            bidFormData.append(key, bid[key]);
        }

        this.bidService.add(bidFormData).subscribe((res: MessageResponse) => {
            // part.saved = true;
            // part.isSending = false;
            console.log(res)
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message });
        }, err => {
            // part.isSending = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
        })
    }

    onSubmitBid() {





        // this.saving = true;
        // //console.log(this.bids);
        // this.bids.forEach(bid => {
        //     bid.partType = bid.partType.id
        // })

        // if (this.bids.length > 0) {
        //     this.claimService.saveClaimBid(this.bids).subscribe(res => {
        //         console.log(res)
        //         this.saving = false;
        //     }, err => {
        //         console.log(err);
        //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'failed to submit bid, please try again.' });
        //         this.saving = false
        //     })
        // } else {
        //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'please modify bid before submitting' });
        //     this.saving = false;
        // }

    }

    setBid(part) {
        part.bid = 0,
            part.partType = { id: 1, partType: 'Genuine-OEM' },
            part.requestFor = part.partOption,
            part.partOption = part.partOption,
            part.qty = 1,
            part.price = 0,
            part.servicePrice = 0,
            part.discount = 0,
            part.discountType = '',
            part.vat = 0,
            part.originalPrice = 0,
            part.warranty = 0,
            part.availability = 0
    }

}
