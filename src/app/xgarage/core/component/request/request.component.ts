import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PartType } from 'src/app/xgarage/common/model/parttype';
import { PartService } from '../../service/part.service';
import { RequestService } from '../../service/request.service';
import { NewPartComponent } from '../part/new-part/new-part.component';

@Component({
    selector: 'app-request',
    templateUrl: './request.component.html',
    styles: [`:host {
        margin-bottom: 1rem;
        display: block;
      }`]
})
export class RequestComponent implements OnInit, OnChanges {

    constructor(
        private requestService: RequestService,
        private partService: PartService,
        private authService: AuthService) {
        this.responseBody = {};
        this.subCategoryId = "";
    }

    partTypes: PartType[];
    selectedPartTypes: PartType[];
    description: string;
    responseBody: any = {};
    partImages: File[] = [];
    subCategoryId: any;
    // partElmodel: any = [];
    req: any = {};
    @Input() part: string = 'PART 1';
    @Input() numberOfReq: number;

    @Output() request = new EventEmitter<{}>();

    ngOnInit(): void {
        this.getPartTypes();
        let usrId = JSON.parse(this.authService.getStoredUser()).id;

        // this.requestService.newRequest.subscribe(data => {
        //     if(data) {
        //         console.log(data);
        //         this.sendRequest();
        //     }

        //     // if (JSON.stringify(data) !== '{}') {
        //     //     console.log(data)
        //     //     // this.responseBody.jobId = data.jobId;
        //     //     // this.responseBody.description = this.description;
        //     //     // this.responseBody.privacy = data.privacy;
        //     //     // this.responseBody.car = { 'id': data.car.id };
        //     //     // this.responseBody.user = usrId;
        //     //     // this.responseBody.locationName = data.location;
        //     //     // this.responseBody.suppliers = data.suppliers;
        //     //     // this.responseBody.partTypes = this.selectedPartTypes;

        //     //     // this.sendRequest();
        //     // }

        // })

        // this.requestService.part.subscribe(part => {
        //     this.subCategoryId = "";

        //     if (JSON.stringify(part) !== '{}') {
        //         this.responseBody.part = {
        //             'id': part.id,
        //             'name': part.name,
        //             'status': part.status
        //         };

        //         this.subCategoryId = part.subCategoryId;
        //         // console.log(this.responseBody)
        //     }
        // });

        // this.requestService.newRequest.subscribe(res => {
        //     if(res) {
        //         this.request.emit({ 'part': this.responseBody ,"subCategoryId": this.subCategoryId, "partImages": this.partImages, 'description': this.description });
        //     }
        // });


    }

    disbaleData() {
        this.requestService.newRequest.next(false);
    }

    ngOnChanges(changes: SimpleChanges) {
        // console.log(changes.numberOfReq.currentValue)
        if (changes.numberOfReq.currentValue) {
            console.log(changes.numberOfReq.currentValue)
        }
    }

    getPartTypes() {
        this.partService.getPartTypes().subscribe(res => {
            this.partTypes = res;
            //console.log(this.partTypes)
        }, err => {
            console.log(err)
        })
    }

    uploadPartImages(e) {
        //console.log(e.files)
        this.partImages = e.files;
    }

    sendRequest() {
         this.requestService.part.subscribe(part => {
            this.subCategoryId = "";

            if (JSON.stringify(part) !== '{}') {
                this.responseBody.part = {
                    'id': part.id,
                    'name': part.name,
                    'status': part.status
                };

                this.subCategoryId = part.subCategoryId;
                // console.log(this.responseBody)
            }
        });
        let stringRequestBody = JSON.stringify(this.responseBody);
        let req = { "requestBody": this.responseBody, "subCategoryId": this.subCategoryId, "partImages": this.partImages, 'description': this.description }

        //console.log(req)
        this.request.emit(req);
        this.disbaleData();
        // let RequestFormData = new FormData();
        // for (var key in req) {
        //     RequestFormData.append(key, req[key]);
        // }

        //call req service
    }
}

