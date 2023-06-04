import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-details-card',
    templateUrl: './details-card.component.html',
})
export class DetailsCardComponent implements OnInit {

    @Input() master;
    @Input() role;
    @Input()type: string = '';
    @Output() editJobNumber: EventEmitter<null> = new EventEmitter();
    imageLoaded:  boolean = false;


    constructor() { }

    ngOnInit(): void {
        //console.log(this.master)
    }

    editJob() {
        this.editJobNumber.emit();
    }

}
