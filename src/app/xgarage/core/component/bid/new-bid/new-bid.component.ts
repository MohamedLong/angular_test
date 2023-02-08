import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MessageResponse } from 'src/app/xgarage/common/dto/messageresponse';
import { PartType } from 'src/app/xgarage/common/model/parttype';
import { BidService } from '../../../service/bidservice.service';
import { RequestService } from '../../../service/request.service';

@Component({
    selector: 'app-new-bid',
    templateUrl: './new-bid.component.html',
    styles: [':host ::ng-deep .row-disabled {background-color: rgba(0,0,0,.15) !important;}'],
    providers: [MessageService]
})
export class NewBidComponent implements OnInit {

    constructor(private messageService: MessageService, private bidService: BidService, private reqService: RequestService) { }
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
            req.images = [],
                this.resetBid(req);
        });


    }

    onSelect(e) {
        console.log(e)
    }

    onRowEditInit(part) {
        console.log('edit')
        part.partTypes.forEach(type => {
            if (!part.statuses.includes(type)) {
                part.statuses.push(type);
            }

        });

        this.requests.forEach(req => {
            req.statuses = part.statuses
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
            price: part.totalPrice,
            request: { id: part.id },
            servicePrice: 0,
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
        part.totalPrice = (bidBody.originalPrice - bidBody.discount) + vatValue;;
        this.total = this.total + part.totalPrice;

        if (part.preferred.id == 5) {
            this.messageService.add({ severity: 'warn', summary: 'Error', detail: "you can't submit a bid for unvailable part" });
        } else if (part.preferred.id == 4) {
            this.reqService.setSupplierNotInterested(part.id).subscribe(res => {
                part.saved = true;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'part add as not interested' });
            }, err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message }))

        } else {
            let bid = { bidBody: JSON.stringify(bidBody), bidImages: part.images, voiceNote: '' }
            let bidFormData = new FormData();
            for (var key in bid) {
                bidFormData.append(key, bid[key]);
            }

            if ((part.originalPrice >= 0) && (part.discount >= 0) && (part.vat >= 0) && (part.discount < part.originalPrice) && part.images.length > 0) {
                this.bidService.add(bidFormData).subscribe((res: MessageResponse) => {
                    //part.saved = true;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message });
                    this.resetBid(part);
                }, err => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
                })
            } else {
                this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'some fileds are not valid, please try again.' });
            }
        }
    }

    onRowEditCancel(data) {
        console.log('cancel')
    }


    onDiscount($event) {
        if ($event.originalPrice > 0 && $event.discount > 0) {
            $event.price = $event.originalPrice - $event.discount;
        } else if ($event.originalPrice > 0 && ($event.discount == 0 || $event.discount == null)) {
            $event.price = $event.originalPrice;
        }

        if ($event.discount < 0) {
            this.messageService.add({ severity: 'error', summary: 'Discount is Not Valid', detail: 'Discount Can Not be Less Than 0' });
            $event.discount = 0;
        }

        if ($event.discount >= $event.originalPrice) {
            this.messageService.add({ severity: 'error', summary: 'Discount is Not Valid', detail: 'Discount Can Not be More Than Original Price' });
            $event.discount = 0;
        }
    }

    onOriginalPrice($event) {
        if ($event.originalPrice == null || $event.originalPrice < 0) {
            this.messageService.add({ severity: 'error', summary: 'Original Price is Not Valid', detail: 'Original Price Can Not be Less Than 0' });
            $event.price = 0;
            $event.originalPrice = 0;
        } else {
            $event.price = $event.originalPrice;
        }
    }

    onVat($event) {
        if ($event.vat == null || $event.vat < 0) {
            this.messageService.add({ severity: 'error', summary: 'Vat is Not Valid', detail: 'Vat Can Not be Less Than 0' });
            $event.vat = 0;
        }
    }

    resetBid(bid) {
        bid.preferred = { "id": 4, "partType": "Not Interested" },
            bid.warranty = 0,
            bid.availability = 0,
            bid.originalPrice = 0.0,
            bid.discount = 0.0,
            bid.price = 0.0,
            bid.vat = 5.0,
            bid.totalPrice = 0.0,
            bid.statuses = this.statuses,
            bid.saved = false
    }
}
