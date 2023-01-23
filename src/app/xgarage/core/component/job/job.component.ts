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
import { InsuranceType } from '../../model/insurancetype';
import { Job } from '../../model/job';
import { StatusConstants } from '../../model/statusconstatnts';
import { JobService } from '../../service/job.service';
import { RequestService } from '../../service/request.service';
import { SupplierService } from '../../service/supplier.service';

@Component({
    selector: 'app-job',
    templateUrl: './job.component.html',
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
export class JobComponent implements OnInit {

    activeTab = 'car-info';
    isTyping: boolean = false;
    isTypingClaim: boolean = false;
    notFound: boolean;
    found: boolean;
    submitted: boolean = false;
    gearType = Object.keys(GearType);
    insuranceFrom = Object.keys(InsuranceType);
    privacy = Object.keys(Privacy);
    carForm: FormGroup = this.formBuilder.group({
       // id: [null],
        chassisNumber: ['', [Validators.minLength(13), Validators.required]],
        brandId: [''],
        carModelId: [''],
        carModelYearId: [''],
        carModelTypeId: [''],
        plateNumber: ['', Validators.required],
        gearType: [''],
        //document: ['']
    });

    claimForm: FormGroup = this.formBuilder.group({
        insuranceFrom: [''],
        claim: [''],
        job: [''],
        location: [''],
        closingDate: [''],
        privacy: [''],
        carImages: ['']
    });

    selectedPrivateSyppliers = [];

    typingTimer;  //timer identifier
    ClaimTypingTimer;  //timer identifier
    brands: Brand[];
    carModels: CarModel[];
    carModelYears: CarModelYear[];
    carModelTypes: CarModelType[];
    InsuranceType = Object.keys(InsuranceType);
    jobFound: { found: boolean, multiple: boolean } = {
        found: false,
        multiple: false
    };

    jobs: string[];
    claimId: number;

    constructor(private formBuilder: FormBuilder,
        private requestService: RequestService,
        private brandService: BrandService,
        private carModelYearService: CarModelYearService,
        private carSpecService: CarModelTypeService,
        private supplierService: SupplierService,
        private jobService: JobService,
        private authService: AuthService) { }

    ngOnInit(): void {

        this.getBrands();
        this.getCarModelYear();
        this.getCarModelType();

        //set location
        let location = JSON.parse(this.authService.getStoredUser()).tenant.location;
        this.claimForm.patchValue({ location });
    }

    clickNext(step: string) {
        this.activeTab = step;
    }

    clickPrev(step: string) {
        this.activeTab = step;
    }

    onChnKeyup() {
        this.isTyping = true;
        clearTimeout(this.typingTimer);
        this.typingTimer = setTimeout(() => {
            if (!this.carForm.get('chassisNumber').errors) {
                this.requestService.getCarByChn(this.carForm.get('chassisNumber').value).subscribe(res => {
                    console.log('res:', res)
                    this.found = true;
                    this.notFound = false;
                    this.setSelectedCar(res);
                }, err => {
                    this.notFound = true;
                    this.found = false;
                    this.resetCarForm();
                    //console.log('err:', err.error)
                })
            };

            this.isTyping = false;
        }, 2000);
    }

    onChnKeydown() {
        clearTimeout(this.typingTimer);
    }

    getBrands() {
        this.brandService.getAll().subscribe(res => {
            this.brands = res;
        })
    }

    getCarModelYear(carModelYearId?: number) {
        this.carModelYearService.getAll().subscribe(res => {
            this.carModelYears = res;

            if (carModelYearId) {
                this.setCarModelYear(carModelYearId);
            };

        }, err => console.log(err));
    }

    getCarModelType(carModelTypeId?: number) {
        this.carSpecService.getAll().subscribe(res => {
            this.carModelTypes = res;
            if (carModelTypeId) {
                this.setCarModeltype(carModelTypeId)
            };
        }, err => console.log(err));
    }

    setSelectedCar(carInfo) {
        // set car id
        this.carForm.addControl('id', new FormControl(carInfo.id));
        //this.carForm.patchValue({ 'id': carInfo.id });

        //set car brand
        let brandVal = this.setCarModel(carInfo.brandId);
        this.carForm.patchValue({ 'brandId': brandVal });
        this.carForm.get('brandId').disable();

        //set car brand model
        let selectedCarModel = this.carModels.filter(model => {
            return model.id == carInfo.carModelId;
        });

        this.carForm.patchValue({ 'carModelId': selectedCarModel[0] });
        this.carForm.get('carModelId').disable();

        //set car model year
        this.getCarModelYear(carInfo.carModelYearId);

        //set car spec
        this.getCarModelType(carInfo.carModelTypeId);

        //set car plate number
        if (carInfo.plateNumber) {
            //console.log('not null')
            this.carForm.patchValue({ 'plateNumber': carInfo.plateNumber });
            this.carForm.get('plateNumber').disable();
        }
    }

    setCarModel(id: number) {
        //set selected car brand
        let selectedBrand = this.brands.filter(brand => {
            return brand.id == id;
        });

        //set car model
        this.carModels = selectedBrand[0].carModels;
        return selectedBrand[0];
    }

    setCarModelYear(id: number) {
        let selectedCarModelYear = this.carModelYears.filter(year => {
            return year.id == id;
        });

        this.carForm.patchValue({ 'carModelYearId': selectedCarModelYear[0] });
        this.carForm.get('carModelYearId').disable();
    }

    setCarModeltype(id: number) {
        let selectedCarModelType = this.carModelTypes.filter(type => {
            return type.id == id;
        });

        this.carForm.patchValue({ 'carModelTypeId': selectedCarModelType[0] });
        this.carForm.get('carModelTypeId').disable();
    }

    getBrandCarModels(brand: Brand) {
        //console.log(id)
        this.setCarModel(brand.id);
    }

    //upload car images
    onBasicUpload(e) {
        //console.log(e)
        let files: Document[] = [];

        e.files.forEach((el: any) => {
            files.push({ name: el.name, extention: el.objectURL.changingThisBreaksApplicationSecurity })
        });

        console.log(files)

        // this.carForm.patchValue({
        //     document: files,
        // })

        // console.log(this.carForm.getRawValue())
    }

    //car form submit
    onCarFormSubmit() {
        this.submitted = true;
        if (this.carForm.valid) {
            this.submitted = false;
            this.clickNext('request');
            this.getSupplierByBrandId();

            console.log(this.carForm.getRawValue())
        }

    }

    resetCarForm() {
        this.carForm.reset({
            chassisNumber: this.carForm.get('chassisNumber').value,
            brandId: '',
            carModelId: '',
            carModelYearId: '',
            carModelTypeId: '',
            plateNumber: this.carForm.get('plateNumber').value,
        });

        this.carForm.get('brandId').enable();
        this.carForm.get('carModelId').enable();
        this.carForm.get('carModelYearId').enable();
        this.carForm.get('carModelTypeId').enable();
    }

    onClaimKeyup() {
        this.isTypingClaim = true;
        clearTimeout(this.ClaimTypingTimer);
        this.ClaimTypingTimer = setTimeout(() => {
            this.jobService.getJobByClaimNumber(this.claimForm.get('claim').value).subscribe(res => {
                console.log('res:', res)
                // this.found = true;
                //this.notFound = false;
                this.claimId = res[0].claimId;

                if (res.length > 1) {
                    this.jobFound.multiple = true;
                    this.jobFound.found = true;

                    res.forEach(job => {
                        this.jobs.push(job.jobNo)
                    })

                } else {
                    this.claimForm.patchValue({ 'job': res[0].jobNo });
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

    onClaimKeydown() {
        clearTimeout(this.ClaimTypingTimer);
    }

    getSupplierByBrandId() {
        //console.log(this.carForm.get('brand').value)
        this.supplierService.getSupplierByBrandId(this.carForm.get('brandId').value.id).subscribe(res => {
            //console.log(res)
            this.selectedPrivateSyppliers = res;
        })
    }

    onClaimFormSubmit() {
        //console.log(this.selectedPrivateSyppliers)

        this.carForm.patchValue({
            brandId: this.carForm.get('brandId').value.id,
            carModelId: this.carForm.get('carModelId').value.id,
            carModelYearId: this.carForm.get('carModelYearId').value.id,
            carModelTypeId: this.carForm.get('carModelTypeId').value.id,
        })


        let jobBody = {
            jobNo: this.claimForm.get('job').value,
            claim: this.claimId,
            insuranceType: this.claimForm.get('insuranceFrom').value,
            car: this.carForm.getRawValue(),
        }

        let stringJobBody = JSON.stringify(jobBody);
        let updatedJobBody = {'jobBody': stringJobBody};

        let jobBodyFormData = new FormData();
        for ( var key in updatedJobBody ) {
            jobBodyFormData.append(key, updatedJobBody[key]);
        }
        //console.log(updatedJobBody)

        this.jobService.saveJob(jobBodyFormData).subscribe(res => {
            console.log('res', res)
        }, err => {
            console.log('err', err)
        })

        //this.clickNext('requests');
    }

}
