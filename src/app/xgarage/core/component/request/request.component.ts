import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Brand } from 'src/app/xgarage/common/model/brand';
import { CarModel } from 'src/app/xgarage/common/model/carmodel';
import { CarModelType } from 'src/app/xgarage/common/model/carmodeltype';
import { CarModelYear } from 'src/app/xgarage/common/model/carmodelyear';
import { BrandService } from 'src/app/xgarage/common/service/brand.service';
import { CarModelTypeService } from 'src/app/xgarage/common/service/carmodeltypes.service';
import { CarModelYearService } from 'src/app/xgarage/common/service/carmodelyear.service';
import { RequestService } from '../../service/request.service';

@Component({
    selector: 'app-request',
    templateUrl: './request.component.html',
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
export class RequestComponent implements OnInit {

    activeTab = 'car-info';
    isTyping: boolean = false;
    notFound: boolean;
    found: boolean;
    submitted: boolean = false;

    requestForm: FormGroup = this.formBuilder.group({
        chn: ['', [Validators.minLength(13), Validators.required]],
        brand: [''],
        model: [''],
        year: [''],
        spec: [''],
        plate: ['', Validators.required],
    });

    typingTimer;  //timer identifier
    brands: Brand[];
    carModels: CarModel[];
    carModelYears: CarModelYear[];
    carModelTypes: CarModelType[];

    constructor(private formBuilder: FormBuilder,
        private requestService: RequestService,
        private brandService: BrandService,
        private carModelYearService: CarModelYearService,
        private carSpecService: CarModelTypeService) { }

    ngOnInit(): void {
        this.getBrands();
        this.getCarModelYear();
        this.getCarModelType();
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
            if (!this.requestForm.get('chn').errors) {
                this.requestService.getCarByChn(this.requestForm.get('chn').value).subscribe(res => {
                    //console.log('res:', res)
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
        //set car brand
        let brandVal = this.setCarModel(carInfo.brandId);
        this.requestForm.get('brand').setValue(brandVal.id);
        this.requestForm.get('brand').disable();

        //set car brand model
        let selectedCarModel = this.carModels.filter(model => {
            return model.id == carInfo.carModelId;
        });

        this.requestForm.get('model').setValue(selectedCarModel[0].id);
        this.requestForm.get('model').disable();

        //set car model year
        this.getCarModelYear(carInfo.carModelYearId);

        //set car spec
        this.getCarModelType(carInfo.carModelTypeId);

        //set car plate number
        if (carInfo.plateNumber) {
            //console.log('not null')
            this.requestForm.get('plate').setValue(carInfo.plateNumber);
            this.requestForm.get('plate').disable();
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

        this.requestForm.get('year').setValue(selectedCarModelYear[0].id);
        this.requestForm.get('year').disable();
    }

    setCarModeltype(id: number) {
        let selectedCarModelType = this.carModelTypes.filter(type => {
            return type.id == id;
        });

        this.requestForm.get('spec').setValue(selectedCarModelType[0].id);
        this.requestForm.get('spec').disable();
    }

    getBrandCarModels(id: number) {
        this.setCarModel(id);
    }

    onCarFormSubmit() {
        this.submitted = true;
        if(this.requestForm.valid) {
            this.submitted = false;
            this.clickNext('request');
            console.log(this.requestForm.value)
        }

    }

    resetCarForm() {
        this.requestForm.reset({
            chn: this.requestForm.get('chn').value,
            brand: '',
            model: '',
            year: '',
            spec: '',
            plate: this.requestForm.get('plate').value,
        });

        this.requestForm.get('brand').enable();
        this.requestForm.get('model').enable();
        this.requestForm.get('year').enable();
        this.requestForm.get('spec').enable();
    }
}
