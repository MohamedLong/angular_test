import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DataService } from 'src/app/xgarage/common/generic/dataservice';
import { PartType } from 'src/app/xgarage/common/model/parttype';
import { SharedJob } from '../../dto/sharedjob';
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
        private dataService: DataService<any>,
        private authService: AuthService) {
        this.responseBody = {};
        this.subCategoryId = "";
    }

    submitted: boolean = false;
    sharedJob: SharedJob;
    partTypes: PartType[];
    selectedPartTypes: PartType[] = [];
    description: string = "";
    responseBody: any = {};
    partImages: File[] = [];
    subCategoryId: any;
    partErrorMsg: string = "";
    @Input() part: string = 'PART 1';
    @Output() request = new EventEmitter<null>();

    ngOnInit(): void {
        this.getPartTypes();
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
        this.request.emit();
        this.submitted = true;
        setTimeout(() => {
            this.dataService.name.subscribe({
                next: (data) => {
                    //this.sharedJob = data;
                    if (data && JSON.stringify(data) !== '{}') {
                        let updatedSuppliers = [];
                        if(data.suppliers.length > 0) {
                            data.suppliers.forEach(element => {
                                updatedSuppliers.push({'id': element.id})
                            });
                        }


                        this.responseBody.job = data.jobId;
                        this.responseBody.description = this.description;
                        this.responseBody.car = { 'id': data.car.id };
                        this.responseBody.locationName = data.location;
                        this.responseBody.suppliers = updatedSuppliers;
                        this.responseBody.privacy = data.privacy;
                        this.responseBody.requestTitle = data.requestTitle;
                        this.responseBody.user = JSON.parse(this.authService.getStoredUser()).id;
                        this.responseBody.partTypes = this.selectedPartTypes;


                        this.requestService.part.subscribe(part => {
                            this.subCategoryId = "";

                            if (JSON.stringify(part) !== '{}') {
                                this.responseBody.part = {
                                    'id': part.id,
                                    'name': part.name,
                                    'status': part.status
                                };

                                this.subCategoryId = part.subCategoryId;
                            }
                        });

                        // console.log('req form is not valid')

                        if (this.subCategoryId && this.responseBody.part && this.responseBody.partTypes && this.responseBody.partTypes.length != 0) {
                            //console.log('req form is valid')
                            console.log('request body inside requets component: ', this.responseBody, this.subCategoryId);
                            this.partErrorMsg = '';

                            let stringRequestBody = JSON.stringify(this.responseBody);
                            let req = { "requestBody": stringRequestBody, "subCategoryId": this.subCategoryId, "partImages": this.partImages }


                            let reqFormData = new FormData();
                            for (var key in req) {
                                reqFormData.append(key, req[key]);
                            }


                            this.requestService.add(reqFormData).subscribe(res => {
                                console.log(res)
                            }, err => {
                                console.log(err)
                            })
                        }

                        if(!this.responseBody.part) {
                            this.partErrorMsg = 'please select or enter a part';
                        }

                    }
                }
            }).unsubscribe();
        }, 1000);
    }
}

