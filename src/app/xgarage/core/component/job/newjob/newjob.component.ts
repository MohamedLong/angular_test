import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MessageResponse } from 'src/app/xgarage/common/dto/messageresponse';
import { DataService } from 'src/app/xgarage/common/generic/dataservice';
import { Privacy } from 'src/app/xgarage/common/model/privacy';
import { InsuranceType } from '../../../model/insurancetype';
import { Supplier } from '../../../model/supplier';
import { ClaimService } from '../../../service/claimservice';
import { JobService } from '../../../service/job.service';
import { SupplierService } from '../../../service/supplier.service';

@Component({
    selector: 'app-newjob',
    templateUrl: './newjob.component.html',
    styles: [`
    .wizard-card {width: 100% !important}
    .wizard-body {background: none; height: unset;}
    .wizard-card, .wizard-card-header {border-radius: 5px;}
    .tab:first-of-type {
        border-top-left-radius: 5px
    }
    .tab:last-of-type {
        border-top-right-radius: 5px
    }
    .wizard-body .wizard-wrapper .wizard-content {
        height: auto;
        min-height: auto;
    }

    .wizard-body .wizard-wrapper .wizard-content .wizard-card {
        height: 100%;
    }
    .add-part-img {
        left: -14px;
        bottom: 8px;
        border: none;
        background-color: transparent;
        }

        .add-part-img:disabled {
            cursor: not-allowed;
        }

        .add-part-img {
            cursor: pointer;
        }

        .p-chips .p-chips-multiple-container .p-chips-token {
            margin-bottom: 0.25rem;
        }
    `],
    providers: [MessageService]
})
export class NewJobComponent implements OnInit {

    activeTab = 'car-info';

    isTypingClaim: boolean = false;
    notFound: boolean;
    found: boolean;
    submitted: boolean = false;
    privacyList = Object.keys(Privacy);
    selectedPrivateSuppliers: Observable<any>;
    supplierSelected: boolean = false;
    insuranceFrom = Object.keys(InsuranceType);
    jobForm: FormGroup = this.formBuilder.group({
        insuranceFrom: ['', Validators.required],
        claim: ['', Validators.required],
        job: [''],
        jobId: ['', Validators.required],
        location: [''],
        privacy: ['Public', Validators.required],
        suppliers: [],
        car: [''],
        carDocument: [''],
    });

    ClaimTypingTimer;  //timer identifier
    InsuranceType = Object.keys(InsuranceType);
    jobFound: { found: boolean, multiple: boolean } = {
        found: false,
        multiple: false
    };
    privateSuppliersList = [];
    jobs: any[] = [];
    claimId: number;
    requests: any[] = [];
    displayPrivateSuppliers: boolean = false;
    addOneMoreRequest: boolean = false;
    numberOfrequests: number = 1;
    newJob: boolean = false;
    @Input() type: string = 'new job';

    constructor(private formBuilder: FormBuilder,
        private jobService: JobService,
        private authService: AuthService,
        private calimService: ClaimService,
        private supplierService: SupplierService,
        private dataService: DataService<any>,
        private messageService: MessageService) { }

    ngOnInit(): void {
        //set location
        let location = JSON.parse(this.authService.getStoredUser()).tenant?.location ? JSON.parse(this.authService.getStoredUser()).tenant.location : '';
        this.jobForm.patchValue({ location });
        //this.jobForm.get('location').disable();
    }

    clickToNavigate(step: string) {
        this.activeTab = step;
    }

    //car form event
    onCarFormEvent(event) {

        this.jobForm.patchValue({
            'car': event
        });

        //console.log(this.jobForm.get('car').value);
        this.jobForm.addControl('requestTitle', new FormControl);
        this.jobForm.patchValue({
            'requestTitle': `${event.brandId.brandName} ${event.carModelId.name} ${event.carModelYearId.year},  ${event.carModelTypeId.type}`
        })
        this.clickToNavigate('request');
    }

    onClaimNumberKeyUp() {

        this.isTypingClaim = true;
        clearTimeout(this.ClaimTypingTimer);

        this.ClaimTypingTimer = setTimeout(() => {
            if (this.jobForm.get('claim').value !== "") {
                this.jobService.getJobByClaimNumber(this.jobForm.get('claim').value).subscribe(res => {
                    // console.log(res)
                    this.claimId = res.claimId;
                    if (res.jobs.length > 0) {
                        let updatedJobs = res.jobs.filter(job => {
                            return job.userId == JSON.parse(this.authService.getStoredUser()).id;
                        });

                        // console.log(updatedJobs)
                        if (updatedJobs.length == 0) {
                            this.jobs = [];
                            this.jobForm.patchValue({ 'job': "", 'jobId': 0 });
                            this.jobFound.multiple = false;
                            this.jobFound.found = false;

                            //console.log(this.jobs, this.jobForm.get('jobId').value)
                        }
                        else if (updatedJobs.length == 1) {
                            this.jobFound.found = true;
                            this.jobForm.patchValue({ 'job': updatedJobs[0].jobNo, 'jobId': updatedJobs[0].id });
                            this.jobForm.get('job').disable();
                        }
                        else if (updatedJobs.length > 1) {
                            this.jobFound.multiple = true;
                            this.jobFound.found = true;

                            res.jobs.forEach(job => {
                                this.jobs.push(job);
                            })
                        }
                    } else {
                        this.jobs = [];
                        this.jobForm.patchValue({ 'job': "", 'jobId': 0 });
                        this.jobFound.multiple = false;
                        this.jobFound.found = false;

                        console.log(this.jobs, this.jobForm.get('jobId').value)
                    }
                }, (err) => {
                    this.jobFound.multiple = false;
                    if(err.status == 0) {
                        this.messageService.add({severity:'error', summary: 'Error', detail: 'something went wrong, please try again'});
                    } else {
                        this.messageService.add({severity:'error', summary: 'Error', detail: 'Claim Not Found'});
                    }
                })
            }

            this.isTypingClaim = false;
        }, 2000);
    }

    addNewClaim() {
        let tenantId = null;
        if (JSON.parse(this.authService.getStoredUser()).tenant) {
            tenantId = JSON.parse(this.authService.getStoredUser()).tenant.id;
        }
        let claimBody = {
            claimNo: this.jobForm.get('claim').value,
            tenant: tenantId
        }
        this.calimService.add(claimBody).subscribe(res => {
            this.claimId = res.id;
            //console.log(res)
        }, err => {
            console.log(err)
        })
    }

    onClaimNumberKeyDown() {
        clearTimeout(this.ClaimTypingTimer);
    }

    onJobFormSubmit() {
        //console.log(this.jobForm.value)
        this.submitted = true;
        if (this.jobForm.get('jobId').value && this.jobForm.get('jobId').value !== 0) {
            this.sendRequest();
        } else {
            this.addNewJob();
        }
    }

    onNewJob() {
        this.jobFound.multiple = false;
        this.jobForm.get('job').enable();
        this.jobForm.patchValue({
            job: "",
            jobId: ""
        });
    }

    addNewJob() {
        //prepare job body for request
        let jobBody = {
            jobNo: this.jobForm.get('job').value,
            claim: this.claimId,
            insuranceType: this.jobForm.get('insuranceFrom').value,
            car: { 'id': this.jobForm.get('car').value.id },
            privacy: this.jobForm.get('privacy').value,
            suppliers: this.jobForm.get('suppliers').value,
            jobTitle: `${this.jobForm.get('car').value.brandId.brandName} ${this.jobForm.get('car').value.carModelId.name} ${this.jobForm.get('car').value.carModelYearId.year},  ${this.jobForm.get('car').value.carModelTypeId.type}`
        }
        this.jobService.add(jobBody).subscribe(res => {
            this.jobForm.patchValue({ 'jobId': res.id });
            console.log(res)
            if (this.jobForm.get('jobId').value !== '') {
                this.sendRequest();
            }
        }, err => {
            console.log('err', err)
        })
    }

    sendRequest() {
        if (this.jobForm.valid) {
            this.dataService.changeObject(this.jobForm.getRawValue());
            this.addOneMoreRequest = true;
            this.submitted = false;
        } else {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'some fields are not valid'});
            console.log('form is not valid');
            console.log(this.jobForm.errors);
            console.log(this.jobForm.value);
        }
    }

    onPrivacyChange(value) {
        // console.log(value)
        if (value == 'Private') {
            this.getSupplierByBrandId();
            this.displayPrivateSuppliers = true;
        } else {
            this.privateSuppliersList = [];
            this.jobForm.patchValue({
                'suppliers': []
            });
            this.displayPrivateSuppliers = false;
        }
    }

    getSupplierByBrandId() {
        if (this.jobForm.get('car')) {
            this.selectedPrivateSuppliers = this.supplierService.getSupplierByBrandId(this.jobForm.get('car').value.brandId.id);
        }
    }

    addRequest() {
        this.numberOfrequests++;
        this.addOneMoreRequest = false;
    }

    selectSupplier(value: Supplier[]) {
        //check if at least 1 supplier is slected
        console.log(value)
        if (value.length > 0) {
            this.supplierSelected = true;

        } else {
            this.supplierSelected = false;
        }

        this.privateSuppliersList = value;
    }

    removePrivateSupplier(value) {
        // console.log(value)
        let updatedPrivateSuplliers = this.jobForm.get('suppliers').value.filter(supplier => {
            return supplier.id !== value.id;
        });

        this.jobForm.patchValue({
            'suppliers': updatedPrivateSuplliers
        });

        this.privateSuppliersList = updatedPrivateSuplliers

        if (this.jobForm.get('suppliers').value.length == 0) {
            this.jobForm.patchValue({
                'privacy': 'Public'
            });

            this.supplierSelected = false;
        }
    }

    resetPrivacy() {
        //console.log(this.privateSuppliersList)
        if (this.privateSuppliersList.length == 0) {
            this.jobForm.patchValue({
                'suppliers': this.privateSuppliersList,
                'privacy': 'Public'
            });
        }
    }

}
