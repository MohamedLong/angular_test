import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MessageResponse } from 'src/app/xgarage/common/dto/messageresponse';
import { PartType } from 'src/app/xgarage/common/model/parttype';
import { StatusConstants } from 'src/app/xgarage/common/model/statusconstatnts';
import { BidService } from '../../../service/bidservice.service';
import { RequestService } from '../../../service/request.service';
import { ClaimService } from '../../../service/claim.service';
import { Bid } from '../../../model/bid';
import { BidDto } from '../../../dto/biddto';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-bid',
    templateUrl: './new-bid.component.html',
    styles: [`:host ::ng-deep .row-disabled {background-color: rgba(0,0,0,.15) !important;}
    .car-image:not(:last-of-type) {margin-right: .5rem}
    .prices:not(:last-of-type) {
        display: none;
    }
    `],
    providers: [MessageService, ConfirmationService]
})
export class NewBidComponent implements OnInit, OnChanges {

    constructor(private router: Router, private claimService: ClaimService, private confirmationService: ConfirmationService, private authService: AuthService, private messageService: MessageService, private bidService: BidService, private reqService: RequestService) { }
    checked: boolean = false;
    @Input() requests: any[] = [];
    @Input() type: string = 'new bid';
    partTypes: PartType[] = [
        {
            "id": 2,
            "partType": "Aftermarket"
        },
        {
            "id": 1,
            "partType": "Genuine-OEM"
        },
        {
            "id": 3,
            "partType": "Used"
        }
    ];
    preferredTypes: string = '';
    bids: any[] = [];
    total: number = 0.0;
    note: string = '';
    imagesLoaded: boolean = false;
    images: Document[] = [];
    modalPart: any = [];
    displayModal: boolean = false;
    displayNotesModal: boolean = false;
    bidTotalOriginalPrice: number = 0;
    bidTotalPrice: number = 0;
    bidTotalDiscount: number = 0;
    isSavingBid: boolean = false;
    discountType = ['OMR', '%'];
    isSubmittingBids: boolean = false;
    totalBidsPrices: number = 0;
    totalServicePrice: number = 0;
    bidDto: any[] = [];
    claimBidId: number;
    isRowValid: boolean = false;

    ngOnInit(): void {
        if (this.type == 'new bid') {
            //console.log(this.requests)
            this.requests = this.requests.filter(req => req.status.id !== StatusConstants.CANCELED_STATUS && req.status.id !== StatusConstants.COMPLETED_STATUS);
            this.requests.forEach((req) => {
                req.images = [];
                this.resetBid(req);
                req.notInterestedSuppliers.forEach(supplier => {
                    if (supplier.user == JSON.parse(this.authService.getStoredUser()).id) {
                        req.saved = true;
                    }
                });
            });

        } else if (this.type == 'new claimBid') {
            //console.log(this.type)
            this.requests.forEach(req => {
                this.setClaimBid(req);
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        // changes.prop contains the old and the new value...
        this.bidTotalPrice = 0;
        this.bidTotalOriginalPrice = 0;
        this.bidTotalDiscount = 0;
        //console.log(changes)
        if (this.type == 'job bid' || this.type == 'claim bid') {
            // console.log('value changed')
            this.requests.forEach(req => {
                // console.log(req.discountType)
                req.qty2 = req.qty
                this.bidTotalPrice = this.bidTotalPrice + req.price;
                this.bidTotalOriginalPrice = this.bidTotalOriginalPrice + req.originalPrice;
                //this.bidTotalDiscount = this.bidTotalDiscount + req.discount;


                if (req.discountType == 'fixed' || req.discountType == null) {
                    console.log('dis is fixed')
                    this.bidTotalDiscount = this.bidTotalDiscount + req.discount;
                } else if (req.discountType == 'flat') {
                    this.bidTotalDiscount = this.bidTotalDiscount + (req.discount * (req.originalPrice * req.qty)) / 100;
                }
            })
        }
    }

    onRowEditSave(part) {
        console.log(part)
        let date = new Date();
        let getYear = date.toLocaleString("default", { year: "numeric" });
        let getMonth = date.toLocaleString("default", { month: "2-digit" });
        let getDay = date.toLocaleString("default", { day: "2-digit" });

        this.updatePrice(part);

        //prepare bid request body
        let bidBody = {
            partName: part.part.name,
            part: part.part,
            voiceNote: null,
            images: [],
            order: this.type == 'new bid' ? null : part.id,
            cu: null,
            cuRate: 0,
            partType: this.type == 'new bid' ? { id: part.preferred.id } : { id: part.partType.id },
            bidDate: getYear + "-" + getMonth + "-" + getDay,
            price: part.totalPrice,
            request: this.type == 'new bid' ? { id: part.id } : { id: JSON.parse(localStorage.getItem('claim')).request },
            servicePrice: this.type == 'new bid' ? 0 : part.servicePrice,
            supplier: JSON.parse(this.authService.getStoredUser()).id,
            comments: this.note,
            deliverDays: part.availability,
            warranty: part.warranty,
            location: this.type == 'new bid' ? part.locationName : JSON.parse(this.authService.getStoredUser()).tenant.location,
            discount: part.discount,
            discountType: part.discountType == 'OMR' || part.discountType == 'fixed' ? 'fixed' : 'flat',
            vat: part.vat,
            originalPrice: part.originalPrice,
            reviseVoiceNote: null,
            reviseComments: "",
            actionComments: "",
            qty: part.qty2
        };

        if (this.type == 'new bid') {
            //set supplier as not interested or else save bid
            if (part.preferred.id == 4) {
                this.reqService.setSupplierNotInterested(part.id).subscribe(res => {
                    part.saved = true;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'part added as not interested / not available' });
                }, err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message }))

            } else {
                part.isSending = true;
                delete bidBody.part;
                this.saveBid(part, bidBody);
            }

        } else if (this.type == 'new claimBid') {
            this.totalBidsPrices = 0;
            this.totalServicePrice = 0;
            delete bidBody.partName;

            var isFound = this.bidDto.find(bid => {
                return bid.order == part.id;
            })

            if (isFound) {
                this.bidDto.forEach((bid, i) => {
                    if (bid.order == part.id) this.bidDto[i] = bidBody;
                });
            } else {
                this.bidDto.push(bidBody);
            }

            console.log(part, this.bidDto)

            //calc total price for claim bids
            //calc total service price for claim bids
            this.bidDto.forEach(bid => {
                this.totalBidsPrices = this.totalBidsPrices + bid.price;
                this.totalServicePrice = this.totalServicePrice + bid.servicePrice;
            });
        };
    }

    onDiscount($event) {
        let price = $event.originalPrice * $event.qty2;
        let discount = $event.discountType == 'OMR' ? $event.discount : (price * $event.discount) / 100;

        if ($event.originalPrice > 0 && discount >= 0) {
            this.updatePrice($event);
            this.isRowValid = true;
        }

        if (discount < 0 || discount == null) {
            this.messageService.add({ severity: 'error', summary: 'Discount is Not Valid', detail: 'Discount Can Not be Less Than 0' });
            this.isRowValid = false;
            discount = 0;
        }

        if (discount >= $event.originalPrice) {
            this.messageService.add({ severity: 'error', summary: 'Discount is Not Valid', detail: 'Discount Can Not be More Than Original Price' });
            this.isRowValid = false;
            $event.discount = 0;
        }
    }

    onDiscountTypeChange(event) {
        //console.log(event.value)
        this.updatePrice(event);
    }

    onOriginalPrice($event) {
        //console.log($event)
        if ($event.originalPrice == null || $event.originalPrice <= 0) {
            this.messageService.add({ severity: 'error', summary: 'Original Price is Not Valid', detail: 'Original Price Can Not be Less Than 1' });
            $event.price = 1;
            $event.originalPrice = 1;
            this.isRowValid = false;
        } else {
            this.updatePrice($event);
            this.isRowValid = true;
        }
    }

    onVat($event) {
        if ($event.vat == null || $event.vat < 0) {
            this.messageService.add({ severity: 'error', summary: 'Vat is Not Valid', detail: 'Vat Can Not be Less Than 0' });
            this.isRowValid = false;
            $event.vat = 0;
        } else {
            this.updatePrice($event);
            this.isRowValid = true;
        }
    }

    onQty(part) {
        if (part.qty2 <= 0) {
            this.messageService.add({ severity: 'error', summary: 'Quantity is Not Valid', detail: 'Quantity Can Not be Less Than 0' });
            this.isRowValid = false;
            part.qty2 = part.qty;
        } else if (part.qty2 > part.qty) {
            this.messageService.add({ severity: 'error', summary: 'Quantity is Not Valid', detail: `Quantity Can Not be More Than ${part.qty}` });
            this.isRowValid = false;
            part.qty2 = part.qty;
        } else {
            this.updatePrice(part);
            this.isRowValid = true;
        }
        console.log(part.qty2, part.qty)
    }

    resetBid(bid) {
        //console.log(bid)
        bid.partTypes.forEach(type => {
            type.disabled = true;
        });

        bid.preferred = bid.partTypes[0],
            bid.warranty = 0,
            bid.availability = 0,
            bid.originalPrice = 1,
            bid.discount = 0.0,
            bid.price = 0.0,
            bid.vat = 5.0,
            bid.totalPrice = 0.0,
            bid.statuses = [
                {
                    partType: 'Proposed',
                    items: [...this.partTypes, { "id": 4, "partType": "Not Interested/Not Available" }]
                },
                {
                    partType: 'Preferred',
                    items: bid.partTypes
                }
            ],
            bid.saved = false,
            bid.isNotInterested = false,
            bid.isSending = false,
            bid.qty2 = bid.qty,
            bid.comments = ''
    }

    updatePrice(part) {
        let price = part.originalPrice * part.qty2;
        let discount = part.discountType == 'OMR' ? part.discount : (price * part.discount) / 100;
        let priceAfterDiscount = price - discount;
        let vat = (priceAfterDiscount * part.vat) / 100;
        let totalPrice = priceAfterDiscount + vat;

        part.price = price;
        part.totalPrice = totalPrice;

        // this.part = part;
    }

    onCancelBid(id: number) {
        this.bidService.cancelBid(id).subscribe({
            next: (data) => {
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Bids Cancelled Successfully', life: 3000 });
            },
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.message, life: 3000 })
        });
    }

    confirmCancel(id: number) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to cancel this bid?',
            accept: () => {
                this.onCancelBid(id);
            }
        });
    }

    getStatusName(statusId: number) {
        switch (statusId) {
            case StatusConstants.OPEN_STATUS:
                return 'Open';
            case StatusConstants.INPROGRESS_STATUS:
                return 'Initial Approval';
            case StatusConstants.ONHOLD_STATUS:
                return 'On Hold';
            case StatusConstants.COMPLETED_STATUS:
                return 'Completed';
            case StatusConstants.REJECTED_STATUS:
                return 'Rejected';
            case StatusConstants.APPROVED_STATUS:
                return 'Approved';
            case StatusConstants.CANCELED_STATUS:
                return 'Canceled';
            case StatusConstants.REVISION_STATUS:
                return 'Revision';
            case StatusConstants.LOST_STATUS:
                return 'Lost';
            case StatusConstants.REVISED_STATUS:
                return 'Revised';
            default:
                return 'Unknown';
        }
    }

    showModal(part) {
        //console.log(part)
        this.modalPart = part;
        this.displayModal = true;
    }

    showNotes(notes: string) {
        this.note = notes;
        this.displayNotesModal = true
    }

    onProposedChange(part) {
        // console.log('val changed')
        // console.log(part)
        if (part.preferred.id == 4) {
            part.isNotInterested = true;
        } else {
            part.isNotInterested = false;
        }

    }

    saveBid(part: any, bidBody: any) {
        let bid = { bidBody: JSON.stringify(bidBody), voiceNote: '' }
        let bidFormData = new FormData();

        for (var key in bid) {
            bidFormData.append(key, bid[key]);
        }

        if (this.type == 'new bid') {
            for (let i = 0; i < part.images.length; i++) {
                bidFormData.append('bidImages', part.images[i]);
            }
        }
        //calc total bid price for job bid
        this.total = this.total + part.totalPrice;

        console.log('saving bid>>>', bidBody)

        if ((part.originalPrice > 0) && (part.discount >= 0) && (part.vat >= 0) && (part.discount < part.originalPrice)) {
            this.bidService.add(bidFormData).subscribe((res: any) => {
                console.log('success saving single bid>>>')
                if (this.type == 'new claimBid') {
                    this.claimBidId = res;
                    this.addBid();
                    this.isSubmittingBids = false;
                } else {
                    part.saved = true;
                    part.isSending = false;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: res.message });
                }
            }, err => {
                part.isSending = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
                this.isSubmittingBids = false;
            })
        } else {
            part.isSending = false;
            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'some fileds are not valid, please try again.' });
        }
    }

    setClaimBid(part) {
        part.partType = { id: 1, partType: 'Genuine-OEM' },
            part.requestFor = part.partOption,
            part.partOption = part.partOption,
            part.qty = 1,
            part.price = 0,
            part.servicePrice = 0,
            part.discount = 0,
            part.discountType = 'OMR',
            part.vat = 5,
            part.originalPrice = 0,
            part.warranty = 0,
            part.availability = 0,
            part.originalPrice = 0,
            part.qty2 = part.qty,
            part.totalPrice = 0,
            part.req = JSON.parse(localStorage.getItem('claim')).request
    }

    addBid() {
        this.bidDto.forEach(bid => {
            let part = {
                bid: this.claimBidId,
                part: bid.part,
                partType: bid.partType.id,
                requestFor: 'Replace',
                partOption: 'Replace',
                qty: bid.qty,
                price: bid.price,
                servicePrice: bid.servicePrice,
                discount: bid.discount,
                discountType: bid.discountType == 'OMR' || bid.discountType == 'fixed' ? 'fixed' : 'flat',
                vat: bid.vat,
                originalPrice: bid.originalPrice,
                warranty: bid.warranty,
                availability: bid.deliverDays
            };

            this.bids.push(part);
        });

        if (this.bids.length > 0) {
            this.claimService.saveClaimBid(this.bids).subscribe(res => {
                console.log(res)
                this.isSubmittingBids = false;
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Bids Submitted Successfully' });
                setTimeout(() => {
                    this.router.navigateByUrl('/bids');
                }, 500)
            }, err => {
                //console.log(err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'failed to submit bid, please try again.' });
                this.isSubmittingBids = false
            })
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'please modify bid before submitting' });
            this.isSubmittingBids = false;
        }
    }

    onSubmitBid() {
        if (this.requests.length !== this.bidDto.length) {
            this.messageService.add({ severity: 'info', summary: 'error', detail: 'you must submit a bid for all parts.' });
        } else {
            this.isSubmittingBids = true;
            this.prepareBidMaster();
        }
    }

    prepareBidMaster() {
        console.log('preparing bid>>>')
        var part: Bid = {
            cuRate: 0,
            deliverDays: 0,
            discount: 0,
            originalPrice: 0,
            price: 0,
            qty: 0,
            vat: 0,
            warranty: 0,
            partType: null,
            servicePrice: 0
        };

        this.bidDto.forEach(bid => {
            part.voiceNote = null,
                part.images = [],
                part.order = null,
                part.cu = null,
                part.cuRate = 0,
                part.deliverDays = part.deliverDays + bid.deliverDays,
                part.discount = part.discount + bid.discount,
                part.location = bid.location,
                part.originalPrice = part.originalPrice + bid.originalPrice,
                part.partName = '',
                part.price = part.price + bid.price,
                part.qty = part.qty + bid.qty,
                part.request = bid.request,
                part.supplier = bid.supplier,
                part.vat = part.vat + bid.vat,
                part.warranty = part.warranty + bid.warranty,
                part.reviseVoiceNote = null,
                part.reviseComments = "",
                part.actionComments = "",
                part.comments = this.note,
                part.bidDate = bid.bidDate,
                part.servicePrice = bid.servicePrice + part.servicePrice
        });

        //console.log(part)
        this.saveBid(part, part);
    }
}
