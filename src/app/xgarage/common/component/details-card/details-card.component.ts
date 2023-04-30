import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-details-card',
    templateUrl: './details-card.component.html',
})
export class DetailsCardComponent implements OnInit {

    @Input() master;
    @Input() role;
    @Output() editJobNumber: EventEmitter<null> = new EventEmitter();
    imageLoaded:  boolean = false;
    user: string = 'insurance';

    constructor() { }

    ngOnInit(): void {
        console.log(this.master)
    }

    editJob() {
        this.editJobNumber.emit();
    }

}
