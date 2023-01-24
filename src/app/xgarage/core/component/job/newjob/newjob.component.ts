import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Brand } from 'src/app/xgarage/common/model/brand';
import { CarModel } from 'src/app/xgarage/common/model/carmodel';
import { CarModelType } from 'src/app/xgarage/common/model/carmodeltype';
import { CarModelYear } from 'src/app/xgarage/common/model/carmodelyear';
import { Document } from 'src/app/xgarage/common/model/document';
import { GearType } from 'src/app/xgarage/common/model/geartype';
import { Privacy } from 'src/app/xgarage/common/model/privacy';
import { BrandService } from 'src/app/xgarage/common/service/brand.service';
import { CarModelTypeService } from 'src/app/xgarage/common/service/carmodeltypes.service';
import { CarModelYearService } from 'src/app/xgarage/common/service/carmodelyear.service';
import { Car } from '../../../model/car';
import { InsuranceType } from '../../../model/insurancetype';
import { Job } from '../../../model/job';
import { StatusConstants } from '../../../model/statusconstatnts';
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
    `]
})
export class NewJobComponent implements OnInit {

    activeTab = 'car-info';

    isTypingClaim: boolean = false;
    notFound: boolean;
    found: boolean;
    submitted: boolean = false;

    insuranceFrom = Object.keys(InsuranceType);
    privacy = Object.keys(Privacy);
    car: { carData: Car, file?: File };

    requestForm: FormGroup = this.formBuilder.group({
        insuranceFrom: [''],
        claim: [''],
        job: [''],
        location: [''],
        closingDate: [''],
        privacy: ['Public'],
        carImages: ['']
    });

    selectedPrivateSyppliers = [];
    ClaimTypingTimer;  //timer identifier
    InsuranceType = Object.keys(InsuranceType);
    jobFound: { found: boolean, multiple: boolean } = {
        found: false,
        multiple: false
    };

    jobs: string[];
    claimId: number;

    constructor(private formBuilder: FormBuilder,
        private supplierService: SupplierService,
        private jobService: JobService,
        private authService: AuthService,
        private calimService: ClaimService) { }

    ngOnInit(): void {
        //set location
        let location = JSON.parse(this.authService.getStoredUser()).tenant.location;
        this.requestForm.patchValue({ location });
    }

    clickNext(step: string) {
        this.activeTab = step;
    }

    clickPrev(step: string) {
        this.activeTab = step;
    }

    //car form event
    onCarFormEvent(event) {
        console.log(event)
        this.car = event;
        this.getSupplierByBrandId();
        this.clickNext('request');
    }


    onClaimKeyup() {
        this.isTypingClaim = true;
        clearTimeout(this.ClaimTypingTimer);
        this.ClaimTypingTimer = setTimeout(() => {
            this.jobService.getJobByClaimNumber(this.requestForm.get('claim').value).subscribe(res => {
                console.log('res:', res)
                // this.found = true;
                //this.notFound = false;
                if (res.length > 0) {
                    this.claimId = res[0].claimId;
                    if (res.length > 1) {
                        this.jobFound.multiple = true;
                        this.jobFound.found = true;

                        res.forEach(job => {
                            this.jobs.push(job.jobNo)
                        })

                    } else {
                        this.requestForm.patchValue({ 'job': res[0].jobNo });
                    }
                } else {
                    this.addNewClaim();
                }


            }, err => {
                // this.notFound = true;
                // this.found = false;
                // this.resetCarForm();
                this.jobFound.multiple = false;
                console.log('err:', err.error)
            })

            this.isTypingClaim = false;
        }, 2000);
    }

    addNewClaim() {
        let tenantId = JSON.parse(this.authService.getStoredUser()).tenant.id;
        let claimBody = {
            claimNo: this.requestForm.get('claim').value,
            tenant: tenantId
        }
        this.calimService.add(claimBody).subscribe(res => {
            this.claimId = res.id;
            //console.log(res)
        }, err => {
            console.log(err)
        })
    }

    onClaimKeydown() {
        clearTimeout(this.ClaimTypingTimer);
    }

    //need brand_id here
    getSupplierByBrandId() {
        //console.log(this.carForm.get('brand').value)
        this.supplierService.getSupplierByBrandId(this.car.carData.brandId.id).subscribe(res => {
            //console.log(res)
            this.selectedPrivateSyppliers = res;
        })
    }

    onrequestFormSubmit() {
        //console.log(this.selectedPrivateSyppliers)
        let updatedCarData = {
            brandId: this.car.carData.brandId.id,
            carModelId: this.car.carData.carModelId.id,
            carModelYearId: this.car.carData.carModelYearId.id,
            carModelTypeId: this.car.carData.carModelYearId.id,
            chassisNumber: this.car.carData.chassisNumber,
            plateNumber: this.car.carData.plateNumber,
            gearType: this.car.carData.gearType,
        }

        if(this.car.carData.id) {
            updatedCarData['id'] = this.car.carData.id;
        }

        let jobBody = {
            jobNo: this.requestForm.get('job').value,
            claim: this.claimId,
            insuranceType: this.requestForm.get('insuranceFrom').value,
            car: updatedCarData,
        }

        let stringJobBody = JSON.stringify(jobBody);
        let updatedJobBody = { 'jobBody': stringJobBody };

        if (this.car.file) {
            updatedJobBody['carDocument'] = this.car.file;
        }

        let jobBodyFormData = new FormData();
        for (var key in updatedJobBody) {
            jobBodyFormData.append(key, updatedJobBody[key]);
        }

        this.jobService.saveJob(jobBodyFormData).subscribe(res => {
            console.log('job created', res)
            //send req
        }, err => {
            console.log('err', err)
        })
    }

}
