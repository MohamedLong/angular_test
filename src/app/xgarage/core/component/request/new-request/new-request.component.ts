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

                        this.getPart();
                        // console.log('req form is not valid')

                        if (this.subCategoryId && this.responseBody.part && this.responseBody.partTypes && this.responseBody.partTypes.length != 0) {
                            //console.log('req form is valid')
                            console.log('request body inside requets component: ', this.responseBody, this.subCategoryId);
                            this.partErrorMsg = '';

                            this.formatThenSaveRequest();
                        }

                        if (!this.responseBody.part) {
                            this.partErrorMsg = 'please select or enter a part';
                        }

                    }
                }
            }).unsubscribe();
        }, 1000);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.edit && !changes.edit.firstChange) {
            if (this.type == 'edit req') {
                console.log('edit request')
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
            } else {
                console.log('new request')
                this.dataService.name.subscribe(res => {
                    //console.log(res)
                    this.responseBody.job = res.id;
                    this.responseBody.description = this.description;
                    this.responseBody.car = { 'id': res.car.id };
                    this.responseBody.locationName = JSON.parse(this.authService.getStoredUser()).tenant.location;
                    this.responseBody.suppliers = res.suppliers;
                    this.responseBody.privacy = res.privacy;
                    this.responseBody.requestTitle = res.jobTitle;
                    this.responseBody.user = this.user;
                    this.responseBody.partTypes = this.selectedPartTypes;
                })
            }

            this.getPart();
            console.log(this.responseBody)
            this.formatThenSaveRequest();
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
        console.log('formatting req')
        let stringRequestBody = JSON.stringify(this.responseBody);
        let req = { "requestBody": stringRequestBody, "subCategoryId": this.subCategoryId, "partImages": this.partImages }

        //console.log(req)

        let reqFormData = new FormData();
        for (var key in req) {
            reqFormData.append(key, req[key]);
        }
        console.log(this.responseBody)
        if (this.responseBody.hasOwnProperty('id')) {
            console.log('editing')
            this.requestService.update(reqFormData).subscribe((res: MessageResponse) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
            }, err => {
                console.log(err.error)
                this.messageService.add({ severity: 'erorr', summary: 'Error', detail: err.error.message });
            });

            this.hideDialog();

        } else {
            this.isSending = true;

            this.requestService.add(reqFormData).subscribe((res: MessageResponse) => {
                if (this.type == 'new req') {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
                } else {
                    this.blocked = true;
                    this.isSending = false;
                    this.buttonTxt = 'Request Sent Successfully';
                }
                this.detailDialog = false;
            }, err => {
                console.log(err)
                if (this.type == 'new req') {
                    this.messageService.add({ severity: 'erorr', summary: 'Error', detail: err.error.message });
                    this.detailDialog = false;
                }
                this.isSending = false;
                this.blocked = false;
            });
        }

    }

}
