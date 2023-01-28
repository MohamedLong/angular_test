import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Privacy } from 'src/app/xgarage/common/model/privacy';
import { InsuranceType } from '../../../model/insurancetype';
import { Supplier } from '../../../model/supplier';
import { ClaimService } from '../../../service/claimservice';
import { JobService } from '../../../service/job.service';
import { RequestService } from '../../../service/request.service';
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
    .add-part-img {
        left: -8px;
        bottom: 8px;
        cursor: pointer;
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
        insuranceFrom: [''],
        claim: [''],
        job: [''],
        jobId: [''],
        location: [''],
        privacy: ['Public'],
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
    jobs: any[] = [];
    claimId: number;
    displayPrivateSuppliers: boolean = false;
    numberOfrequests: number = 1;
    @Input() type: string = 'new job';

    constructor(private formBuilder: FormBuilder,
        private jobService: JobService,
        private requestService: RequestService,
        private authService: AuthService,
        private calimService: ClaimService,
        private supplierService: SupplierService,
        private messageService: MessageService) { }

    ngOnInit(): void {
        //set location
        let location = JSON.parse(this.authService.getStoredUser()).tenant.location;
        this.jobForm.patchValue({ location });
        this.jobForm.get('location').disable();
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
        this.clickToNavigate('request');
    }

    onClaimNumberKeyUp() {

        this.isTypingClaim = true;
        clearTimeout(this.ClaimTypingTimer);

        this.ClaimTypingTimer = setTimeout(() => {
            if (this.jobForm.get('claim').value !== "") {
                this.jobService.getJobByClaimNumber(this.jobForm.get('claim').value).subscribe(res => {
                    console.log(res)
                    this.claimId = res.claimId;
                    if (res.jobs.length > 0) {
                        if (res.jobs.length == 1) {

                            this.jobForm.patchValue({ 'job': res.jobs[0].jobNo, 'jobId': res.jobs[0].id });

                        } else if (res.jobs.length > 1) {
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
                }, err => {
                    this.jobFound.multiple = false;
                    this.messageService.add({ severity: 'erorr', summary: 'Error', detail: err.error });
                    //console.log('err:', err.error)
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

    onjobFormSubmit() {
        if (this.jobForm.get('jobId').value && this.jobForm.get('jobId').value !== 0) {
            console.log('initiate req')
            // this.request.emit(this.jobForm.value);
            this.requestService.info.next(this.jobForm.getRawValue());
        } else {
            console.log('add new job then initiate req')
            this.addNewJob();
        }
    }

    addNewJob() {
        //prepare job body for request
        console.log(this.claimId)
        let jobBody = {
            jobNo: this.jobForm.get('job').value,
            claim: this.claimId,
            insuranceType: this.jobForm.get('insuranceFrom').value,
            car: { 'id': this.jobForm.get('car').value.id },
        }

        this.jobService.add(jobBody).subscribe(res => {

            this.jobForm.patchValue({ 'jobId': res.id });

            if (this.type == 'new req' && this.jobForm.get('jobId').value !== '') {
                // this.request.emit(this.jobForm.value);
                this.requestService.info.next(this.jobForm.getRawValue());
            }

        }, err => {
            console.log('err', err)
        })
    }

    onPrivacyChange(value) {
        // console.log(value)
        if (value == 'Private') {
            this.getSupplierByBrandId();
            this.displayPrivateSuppliers = true;
        } else {
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
        console.log(this.numberOfrequests)
    }

    selectSupplier(value: Supplier[]) {
        //check if at least 1 supplier is slected
        if(value.length > 0) {
            this.supplierSelected = true;
        } else {
            this.supplierSelected = false;
        }
    }

}
