import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MessageResponse } from 'src/app/xgarage/common/dto/messageresponse';
import { PartType } from 'src/app/xgarage/common/model/parttype';
import { BidService } from '../../../service/bidservice.service';

@Component({
    selector: 'app-new-bid',
    templateUrl: './new-bid.component.html',
    styles: [''],
    providers: [MessageService]
})
export class NewBidComponent implements OnInit {

    constructor(private authService: AuthService, private messageService: MessageService, private bidService: BidService) { }
    checked: boolean = false;
    @Input() requests: any[] = [];
    statuses: PartType[] = [{ "id": 4, "partType": "Not Interested" }, { "id": 5, "partType": "Not Available" }];
    preferredTypes: string = '';
    bids: any[] = [];
    total: number = 0.0;
    note: string = '';
    images: Document[] = [];
    ngOnInit(): void {
        console.log(this.requests)
        this.requests.forEach(req => {
            req.images = [];
            req.preferred = { "id": 4, "partType": "Not Interested" };
            req.warranty = 0;
            req.availability = 0;
            req.originalPrice = 0.0;
            req.discount = 0.0;
            req.price = 0.0;
            req.vat = 5.0;
            req.totalPrice = 0.0
        });
    }

    onSelect(e) {
        console.log(e)
    }

    onRowEditInit(part) {
        console.log('edit')
        part.partTypes.forEach(type => {
            if (!this.statuses.includes(type)) {
                this.statuses.push(type)
            }

        });
    }

    onRowEditSave(part) {
        let date = new Date();
        let getYear = date.toLocaleString("default", { year: "numeric" });
        let getMonth = date.toLocaleString("default", { month: "2-digit" });
        let getDay = date.toLocaleString("default", { day: "2-digit" });

        let bidBody = {
            partName: part.part.name,
            voiceNote: null,
            images: [],
            order: null,
            cu: null,
            cuRate: 0,
            partType: { id: part.preferred.id },
            bidDate: getYear + "-" + getMonth + "-" + getDay,
            price: part.price,
            request: { id: part.id },
            servicePrice:0,
            // supplier: { id: JSON.parse(this.authService.getStoredUser()).id },
            supplier: { id: 37 },
            comments: this.note,
            deliverDays: part.availability,
            warranty: part.warranty,
            location: part.locationName,
            discount: part.discount,
            vat: part.vat,
            originalPrice: part.originalPrice,
            reviseVoiceNote: null,
            reviseComments: "",
            actionComments: "",
        }


        let vatValue = ((bidBody.originalPrice - bidBody.discount) * bidBody.vat) / 100;
        bidBody.price = (bidBody.originalPrice - bidBody.discount) + vatValue;
        part.totalPrice = bidBody.price;
        this.total = this.total + bidBody.price;
        part.price = bidBody.price;

        if (part.preferred.id !== 5) {
            //this.bids.push(bidBody);
            let bid = { bidBody: JSON.stringify(bidBody), bidImages: part.images, voiceNote: '' }
            let bidFormData = new FormData();
            for (var key in bid) {
                bidFormData.append(key, bid[key]);
            }

            this.bidService.add(bidFormData).subscribe((res: MessageResponse) => {
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message });
            }, err => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
            })
        } else if(part.preferred.id == 5) {

            this.messageService.add({ severity: 'warn', summary: 'Error', detail: "you can't submit a bid for unvailable part" });
        } else {
            //not interested in bid api
        }
    }

    onRowEditCancel(data) {
        console.log('cancel')
    }


}
