import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-bid',
  templateUrl: './new-bid.component.html',
  styles: ['']
})
export class NewBidComponent implements OnInit {

  constructor() { }
  checked: boolean = false;
  @Input() requests: any[] = [];
  statuses: string[] = ['New', 'Not Interested', 'Not Available'];
  preferredTypes: string = '';
  bids: any[] = [{preferred: 'new'}, {preferred: 'new'}, {preferred: 'new'},{preferred: 'new'}];
  ngOnInit(): void {
    console.log(this.requests)
    this.requests.forEach(req => {
        req.preferred = 'new';
        req.warranty = '6 month';
        req.availability = '2 days';
        req.originalPrice = 0;
        req.discount = 0;
        req.price = 0;
        req.vat = '5%';
        req.totalPrice = 0
    });
  }

  submitBid() {
    console.log(this.requests)
    let bids = [];
    this.requests.forEach(req => {
        let bid =  {
            preferred: req.preferred,
            warranty: req.warranty,
            availability: req.availability,
            originalPrice: req.originalPrice,
            discount: req.discount,
            price: req.price,
            vat: req.vat,
            totalPrice: req.totalPrice
        }

        bids.push(bid);
    });


    console.log(bids)
  }

}
