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
    styles: [':host ::ng-deep .row-disabled {background-color: rgba(0,0,0,.15) !important;} .car-image:not(:last-of-type) {margin-right: .5rem}'],
    providers: [MessageService]
})
export class NewBidComponent implements OnInit {

    constructor(private authService: AuthService, private messageService: MessageService, private bidService: BidService, private reqService: RequestService) { }
    checked: boolean = false;
    @Input() requests: any[] = [];
    @Input() type: string = 'new bid';
    statuses: PartType[] = [{ "id": 4, "partType": "Not Interested" }, { "id": 5, "partType": "Not Available" }];
    preferredTypes: string = '';
    bids: any[] = [];
    total: number = 0.0;
    note: string = '';
    imagesLoaded: boolean = false;
    images: Document[] = [];

    ngOnInit(): void {

        if (this.type == 'new bid') {
            this.requests.forEach((req, index) => {
                req.images = [],
                    this.resetBid(req);
                let notInterestedSupplier = req.notInterestedSuppliers.filter(supplier => {
                    return supplier.user = JSON.parse(this.authService.getStoredUser()).id;
                });

                if (notInterestedSupplier.length > 0) {
                    this.requests[index].saved = true
                }
            });
        } else {
            console.log(this.requests)
            this.requests.forEach(req => {
                req.qty2 = req.qty
            })
        }

    }

    onSelect(e) {
        console.log(e)
    }

    onRowEditInit(part) {
        // console.log('edit')
        part.partTypes.forEach(type => {
            if (!part.statuses.includes(type)) {
                part.statuses.unshift(type);
                part.preferred = type;
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
        this.updatePrice(part);

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
            supplier: JSON.parse(this.authService.getStoredUser()).id,
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
            qty: part.qty2
        }


        console.log(bidBody)
        if (part.preferred.id == 5) {
            this.messageService.add({ severity: 'warn', summary: 'Error', detail: "you can't submit a bid for unvailable part" });
        } else if (part.preferred.id == 4) {
            this.reqService.setSupplierNotInterested(part.id).subscribe(res => {
                part.saved = true;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'part add as not interested' });
            }, err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message }))

        } else {
            let bid = { bidBody: JSON.stringify(bidBody), voiceNote: '' }
            let bidFormData = new FormData();
            for (var key in bid) {
                bidFormData.append(key, bid[key]);
            }
            for (let i = 0; i < part.images.length; i++) {
                bidFormData.append('bidImages', part.images[i]);
            }

            this.total = this.total + part.totalPrice;

            if ((part.originalPrice > 0) && (part.discount >= 0) && (part.vat >= 0) && (part.discount < part.originalPrice)) {
                this.bidService.add(bidFormData).subscribe((res: MessageResponse) => {
                    part.saved = true;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message });
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
        if ($event.originalPrice > 0 && $event.discount >= 0) {
            this.updatePrice($event);
        }

        if ($event.discount < 0 || $event.discount == null) {
            this.messageService.add({ severity: 'error', summary: 'Discount is Not Valid', detail: 'Discount Can Not be Less Than 0' });
            $event.discount = 0;
        }

        if ($event.discount >= $event.originalPrice) {
            this.messageService.add({ severity: 'error', summary: 'Discount is Not Valid', detail: 'Discount Can Not be More Than Original Price' });
            $event.discount = 0;
        }
    }

    onOriginalPrice($event) {
        if ($event.originalPrice == null || $event.originalPrice <= 0) {
            this.messageService.add({ severity: 'error', summary: 'Original Price is Not Valid', detail: 'Original Price Can Not be Less Than 1' });
            $event.price = 1;
            $event.originalPrice = 1;
        } else {
            this.updatePrice($event);
        }
    }

    onVat($event) {
        if ($event.vat == null || $event.vat < 0) {
            this.messageService.add({ severity: 'error', summary: 'Vat is Not Valid', detail: 'Vat Can Not be Less Than 0' });
            $event.vat = 0;
        } else {
            this.updatePrice($event);
        }
    }

    onQty(part) {
        if (part.qty2 <= 0) {
            this.messageService.add({ severity: 'error', summary: 'Quantity is Not Valid', detail: 'Quantity Can Not be Less Than 0' });
            part.qty2 = part.qty;
        } else if (part.qty2 > part.qty) {
            this.messageService.add({ severity: 'error', summary: 'Quantity is Not Valid', detail: `Quantity Can Not be More Than ${part.qty}` });
            part.qty2 = part.qty;
        } else {
            this.updatePrice(part)
        }
        console.log(part.qty2, part.qty)
    }

    resetBid(bid) {
        bid.preferred = { "id": 4, "partType": "Not Interested" },
            bid.warranty = 0,
            bid.availability = 0,
            bid.originalPrice = 1,
            bid.discount = 0.0,
            bid.price = 0.0,
            bid.vat = 5.0,
            bid.totalPrice = 0.0,
            bid.statuses = this.statuses,
            bid.saved = false,
            bid.qty2 = bid.qty
    }

    updatePrice(part) {
        let price = part.originalPrice * part.qty2;
        let priceAfterDiscount = price - part.discount;
        let vat = (priceAfterDiscount * part.vat) / 100;
        let totalPrice = priceAfterDiscount + vat;

        part.price = price;
        part.totalPrice = totalPrice;
    }
}
