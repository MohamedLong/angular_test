import { JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PartType } from 'src/app/xgarage/common/model/parttype';
import { Part } from '../../model/parts';
import { PartService } from '../../service/part.service';
import { RequestService } from '../../service/request.service';

@Component({
    selector: 'app-request',
    templateUrl: './request.component.html',
    styles: [`:host {
        margin-bottom: 1rem;
        display: block;
      }`]
})
export class RequestComponent implements OnInit {

    constructor(
        private requestService: RequestService,
        private partService: PartService,
        private authService: AuthService) { }

    partTypes: PartType[];
    selectedPartTypes: PartType[];
    description: string;
    responseBody: any = {};
    partImages: File[] = [];
    @Input() part: string = 'PART 1';

    ngOnInit(): void {
        this.getPartTypes();
        let usrId = JSON.parse(this.authService.getStoredUser()).id;
        this.requestService.info.subscribe(data => {
            console.log(data)
            if (JSON.stringify(data) !== '{}') {
                this.responseBody = {
                    jobId: data.jobId,
                    description: this.description,
                    privacy: data.privacy,
                    car: {'id': data.car.id},
                    user: usrId,
                    locationName: data.location,
                    suppliers: data.suppliers,
                    partTypes: this.selectedPartTypes
                }

                console.log(this.responseBody)
            }

        })
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
        let stringRequestBody = JSON.stringify(this.responseBody);
        let req = {"requestBody": stringRequestBody, "subCategoryId": 1, "partImages": this.partImages}

        let RequestFormData = new FormData();
        for (var key in req) {
            RequestFormData.append(key, req[key]);
        }

        //call req service
    }
}
