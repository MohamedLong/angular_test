import { DatePipe } from '@angular/common';
import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MessageResponse } from 'src/app/xgarage/common/dto/messageresponse';
import { DataService } from 'src/app/xgarage/common/generic/dataservice';
import { GenericDetailsComponent } from 'src/app/xgarage/common/generic/genericdetailscomponent';
import { PartType } from 'src/app/xgarage/common/model/parttype';
import { StatusService } from 'src/app/xgarage/common/service/status.service';
import { PartService } from '../../../service/part.service';
import { PartTypeService } from '../../../service/parttype.service';
import { RequestService } from '../../../service/request.service';

@Component({
    selector: 'app-new-request',
    templateUrl: './new-request.component.html',
    styles: [`:host {
    margin-bottom: 1rem;
    display: block;
  }`],
    providers: [MessageService, DatePipe]
})
export class NewRequestComponent extends GenericDetailsComponent implements OnInit, OnChanges {

    constructor(
        private requestService: RequestService,
        private partTypeService: PartTypeService,
        private dataService: DataService<any>,
        public statusService: StatusService,
        public breadcrumbService: AppBreadcrumbService,
        public datePipe: DatePipe,
        public route: ActivatedRoute,
        public router: Router,
        public messageService: MessageService,
        private authService: AuthService) {
        super(route, router, requestService, datePipe, statusService, breadcrumbService);
        this.responseBody = {};
        this.subCategoryId = "";
    }
    qty: number = 1;
    checked: boolean = true;
    submitted: boolean = false;
    partTypes: PartType[];
    selectedPartTypes: PartType[] = [];
    description: string = "";
    responseBody: any = {};
    partImages: File[] = [];
    subCategoryId: any;
    partErrorMsg: string = "";
    @Input() part: string = 'PART 1';
    @Input() type: string = 'new req';
    @Input() requestDetails: any = '';
    @Input() edit: boolean = false;
    @Output() request = new EventEmitter<null>();
    blocked: boolean = false;
    isSending: boolean = false;
    buttonTxt = 'Send Request';
    user: any;
    ngOnInit(): void {
        // set user id
        this.user = JSON.parse(this.authService.getStoredUser()).id;
        this.getPartTypes();

        if (this.type == 'edit req') {
            console.log(this.requestDetails)
            this.setRequestInfo();
        }

    }

    getPartTypes() {
        this.partTypeService.getAll().subscribe(res => {
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
        this.isSending = true;
        setTimeout(() => {
            this.dataService.name.subscribe({
                next: (data) => {
                    if (data && JSON.stringify(data) !== '{}') {
                        console.log(data)

                        let updatedSuppliers = [];
                        if (data.suppliers && data.suppliers.length > 0) {
                            data.suppliers.forEach(element => {
                                updatedSuppliers.push({ 'id': element.id })
                            });
                        }

                        this.responseBody.job = data.jobId;
                        this.responseBody.description = this.description;
                        this.responseBody.car = { 'id': data.car.id };
                        this.responseBody.locationName = data.location;
                        this.responseBody.suppliers = updatedSuppliers;
                        this.responseBody.privacy = data.privacy;
                        this.responseBody.requestTitle = data.requestTitle;
                        this.responseBody.user = this.user;
                        this.responseBody.partTypes = this.selectedPartTypes;
                        this.responseBody.qty = this.qty;

                        this.getPart();

                        if (this.subCategoryId && this.responseBody.part && this.responseBody.partTypes && this.responseBody.partTypes.length != 0 && this.responseBody.qty >= 1) {
                            this.partErrorMsg = '';
                            //console.log(this.responseBody)
                            this.formatThenSaveRequest();
                        }

                        if (!this.responseBody.part) {
                            this.partErrorMsg = 'please select or enter a part';
                            this.isSending = false;
                        }

                    }
                }
            }).unsubscribe();
        }, 1000);
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.edit && !changes.edit.firstChange) {
            this.submitted = true;

            if (this.type == 'edit req') {
                this.responseBody.id = this.requestDetails.id;
                this.responseBody.job = this.requestDetails.job;
                this.responseBody.description = this.description;
                this.responseBody.car = { 'id': this.requestDetails.car.id };
                this.responseBody.locationName = this.requestDetails.locationName;
                this.responseBody.suppliers = this.requestDetails.suppliers;
                this.responseBody.privacy = this.requestDetails.privacy;
                this.responseBody.requestTitle = this.requestDetails.requestTitle;
                this.responseBody.user = this.requestDetails.user;
                this.responseBody.partTypes = this.selectedPartTypes;
                this.responseBody.qty = this.requestDetails.qty;

                //console.log('edit request', this.responseBody)
            } else {

                let job = JSON.parse(localStorage.getItem('job'));

                this.responseBody.job = job.id;
                this.responseBody.description = this.description;
                this.responseBody.qty = this.qty;
                this.responseBody.car = { 'id': job.car.id };
                this.responseBody.locationName = JSON.parse(this.authService.getStoredUser()).tenant.location;
                this.responseBody.suppliers = job.suppliers;
                this.responseBody.privacy = job.privacy;
                this.responseBody.requestTitle = job.jobTitle;
                this.responseBody.user = this.user;
                this.responseBody.partTypes = this.selectedPartTypes;

                //console.log('new request', this.responseBody)
            }

            this.getPart();
            if(this.selectedPartTypes.length > 0) {
               // console.log('save req')
                this.formatThenSaveRequest();
            }

        }
    }

    setRequestInfo() {
        console.log('setting req info')
        this.selectedPartTypes = this.requestDetails.partTypes; //set part types
        this.description = this.requestDetails.description; //set description
    }

    getPart() {
        console.log('getting part')
        this.requestService.part.subscribe(part => {
            if (JSON.stringify(part) !== '{}') {
                this.responseBody.part = {
                    'id': part.id,
                    'name': part.name,
                    'status': part.status
                };

                this.subCategoryId = part.subCategoryId;
            }
        });
    }

    formatThenSaveRequest() {
        let stringRequestBody = JSON.stringify(this.responseBody);
        let req = { "requestBody": stringRequestBody, "subCategoryId": this.subCategoryId }
        let reqFormData = new FormData();
        for (var key in req) {
            reqFormData.append(key, req[key]);
        }
        for (let i = 0; i < this.partImages.length; i++) {
            reqFormData.append('partImages', this.partImages[i]);
        }
        if (this.responseBody.hasOwnProperty('id')) {
            this.requestService.update(reqFormData).subscribe((res: MessageResponse) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
            }, err => {
                //console.log(err.error)
                this.messageService.add({ severity: 'erorr', summary: 'Error', detail: err.error.message });
            });

            super.hideDialog();
            this.submitted = false;

        } else {
            
            console.log(this.responseBody);
            console.log(reqFormData);
            this.requestService.add(reqFormData).subscribe((res: MessageResponse) => {
                if (this.type == 'new req') {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
                    this.hideDialog();
                } else {
                    this.blocked = true;
                    this.buttonTxt = 'Request Sent Successfully';
                }

                this.detailDialog = false;
                this.isSending = false;
                this.submitted = false;
            }, err => {
                console.log(err)
                if (this.type == 'new req') {
                    this.messageService.add({ severity: 'erorr', summary: 'Error', detail: err.error.message });
                    super.hideDialog();
                }
                this.isSending = false;
                this.blocked = false;
                this.submitted = false;
            });
        }

    }

}
