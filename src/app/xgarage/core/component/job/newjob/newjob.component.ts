import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
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
    `],
    providers: [MessageService]
})
export class NewJobComponent implements OnInit {

    activeTab = 'car-info';

    isTypingClaim: boolean = false;
    notFound: boolean;
    found: boolean;
    submitted: boolean = false;

    insuranceFrom = Object.keys(InsuranceType);
    jobForm: FormGroup = this.formBuilder.group({
        insuranceFrom: [''],
        claim: [''],
        job: [''],
        jobId: [''],
        location: [''],
        // closingDate: [''],
        // privacy: ['Public'],
        // suppliers: [''],
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

    @Input() type: string = 'new job';
    @Output() request: EventEmitter<Supplier[]> = new EventEmitter();

    constructor(private formBuilder: FormBuilder,
        private jobService: JobService,
        private requestService: RequestService,
        private authService: AuthService,
        private calimService: ClaimService,
        private messageService: MessageService) { }

    ngOnInit(): void {
        //set location
        let location = JSON.parse(this.authService.getStoredUser()).tenant.location;
        this.jobForm.patchValue({ location });
    }

    clickNext(step: string) {
        this.activeTab = step;
    }

    clickPrev(step: string) {
        this.activeTab = step;
    }

    //car form event
    onCarFormEvent(event) {

        this.jobForm.patchValue({
            'car': event
        });

        //console.log(this.jobForm.get('car').value);
        this.clickNext('request');
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
           this.requestService.info.next(this.jobForm.value);
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

        this.jobService.saveJob(jobBody).subscribe(res => {

            this.jobForm.patchValue({ 'jobId': res });

            if (this.type == 'new req' && this.jobForm.get('jobId').value !== '') {
                // this.request.emit(this.jobForm.value);
                this.requestService.info.next(this.jobForm.value);
            }

        }, err => {
            console.log('err', err)
        })
    }

}
