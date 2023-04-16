import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-details-card',
    templateUrl: './details-card.component.html',
})
export class DetailsCardComponent implements OnInit {

    @Input() master;
    @Input() role;
    imageLoaded:  boolean = false;

    constructor() { }

    ngOnInit(): void {
    }

}
