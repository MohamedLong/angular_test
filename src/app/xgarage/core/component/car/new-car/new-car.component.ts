import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Brand } from 'src/app/xgarage/common/model/brand';
import { CarModel } from 'src/app/xgarage/common/model/carmodel';
import { CarModelType } from 'src/app/xgarage/common/model/carmodeltype';
import { CarModelYear } from 'src/app/xgarage/common/model/carmodelyear';
import { BrandService } from 'src/app/xgarage/common/service/brand.service';
import { CarModelTypeService } from 'src/app/xgarage/common/service/carmodeltypes.service';
import { CarModelYearService } from 'src/app/xgarage/common/service/carmodelyear.service';
import { Car } from '../../../model/car';
import { GearType } from '../../../model/geartype';
import { CarService } from '../../../service/car.service';
import { config } from "src/app/config";

@Component({
    selector: 'app-new-car',
    templateUrl: './new-car.component.html',
    styles: [''],
    providers: [MessageService]
})
export class NewCarComponent implements OnInit {

    constructor(private formBuilder: FormBuilder,
        private brandService: BrandService,
        private carModelYearService: CarModelYearService,
        private carSpecService: CarModelTypeService,
        private carService: CarService,
        private messageService: MessageService,) { }

    brands: Brand[];
    carModels: CarModel[];
    carModelYears: CarModelYear[];
    carModelTypes: CarModelType[];
    carFile: File;
    gearType = Object.keys(GearType);
    submitted: boolean = false;
    isTyping: boolean = false;
    typingTimer;
    found: boolean = false;
    notFound: boolean = false;
    image: string = '';
    saving: boolean = false;
    carForm: FormGroup = this.formBuilder.group({
        chassisNumber: ['', [Validators.minLength(13), Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        brandId: ['', Validators.required],
        carModelId: ['', Validators.required],
        carModelYearId: ['', Validators.required],
        carModelTypeId: ['', Validators.required],
        plateNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        gearType: ['Automatic', Validators.required],
    });

    customerName: string = '';
    contactNO: number = null;
    excess: string = '';
    //preparedBy: string = '';

    @Input() type: string = 'new car';
    @Output() carEvent = new EventEmitter<{ car: Car }>();
    @Output() close = new EventEmitter<void>();


    ngOnInit(): void {
        this.getCarBrands();
        this.getCarModelYear();
        this.getCarModelType();

        if (this.type == 'new claim') {
            this.carForm.addControl('claimData', new FormControl(null, Validators.required));
        };
    }

    onCarFormSubmit() {

        if (this.type == 'new claim' && this.customerName && this.contactNO && this.excess) {
            this.carForm.patchValue({
                'claimData': {
                    customerName: this.customerName,
                    contactNo: this.contactNO,
                    excessRo: this.excess,
                }
            })
        };

        this.submitted = true;
        if (this.carForm.valid) {
            if (this.found && (this.type == 'new job' || this.type == 'new claim')) {
                this.carEvent.emit(this.carForm.getRawValue());
            } else {
                //add new/update car
                this.saving = true;
                let carBody = {
                    "brandId": this.carForm.value.brandId.id,
                    "carModelId": this.carForm.value.carModelId.id,
                    "carModelTypeId": this.carForm.value.carModelTypeId.id,
                    "carModelYearId": this.carForm.value.carModelYearId.id,
                    "chassisNumber": this.carForm.value.chassisNumber,
                    "plateNumber": this.carForm.value.plateNumber,
                    "gearType": this.carForm.value.gearType
                }

                let stringCarBody = JSON.stringify(carBody);
                let carFormData = new FormData();

                carFormData.append('carBody', stringCarBody);
                carFormData.append('carDocument', this.carFile ? this.carFile : null);

                //console.log('carDocument: ', carFormData.get('carDocument'));
                this.carService.add(carFormData).subscribe(res => {
                    if (this.type == "new job" || this.type == 'new claim') {
                        this.setSelectedCar(res);
                        this.carEvent.emit(this.carForm.getRawValue());
                    }

                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Car Added Susccessfully!' });
                    this.resetCarForm();
                    this.saving = false;
                    this.close.emit();
                }, err => {
                    this.messageService.add({ severity: 'erorr', summary: 'Error', detail: 'Erorr Saving Car' });
                })
            }
        }
    }

    onChnKeyUp() {
        this.isTyping = true;
        clearTimeout(this.typingTimer);
        this.typingTimer = setTimeout(() => {
            if (!this.carForm.get('chassisNumber').errors) {
                this.carService.getCarByChn(this.carForm.get('chassisNumber').value).subscribe(res => {
                    //console.log('res:', res.document.name)
                    this.image = res.document ? config.apiUrl + '/v1/document/' + res.document.name : '';
                    this.found = true;
                    this.notFound = !this.found;
                    this.setSelectedCar(res);
                }, err => {
                    this.found = false;
                    this.notFound = !this.found;
                    this.resetCarForm();
                    //console.log('err:', err.error)
                })
            };

            this.isTyping = false;
        }, 2000);
    }

    onChnKeyDown() {
        clearTimeout(this.typingTimer);
    }

    onCarImageUpload(e) {
        this.carFile = e.files ? e.files[0] : null;
    }

    getBrandCarModels(brand: Brand) {
        //console.log(id)
        this.setCarModel(brand.id);
    }

    //get all car brands
    getCarBrands() {
        this.brandService.getAll().subscribe(res => {
            this.brands = res;
        })
    }

    getCarModelYear(carModelYearId?: number) {
        if (carModelYearId) {
            this.setCarModelYear(carModelYearId);
        } else {
            this.carModelYearService.getAll().subscribe(res => {
                this.carModelYears = res.reverse();
            }, err => console.log(err));
        }

    }

    getCarModelType(carModelTypeId?: number) {
        if (carModelTypeId) {
            this.setCarModelType(carModelTypeId)
        } else {
            this.carSpecService.getAll().subscribe(res => {
                this.carModelTypes = res;
            }, err => console.log(err));
        }

    }

    setSelectedCar(carInfo) {
        // set car id
        this.carForm.addControl('id', new FormControl(carInfo.id));

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

        //set car gear type
        if (carInfo.gearType) {
            this.carForm.patchValue({ 'gearType': carInfo.gearType });
            this.carForm.get('gearType').disable();
        }
    }

    setCarModel(id: number) {
        //set selected car brand
        let selectedBrand = this.brands.filter(brand => {
            return brand.id == id;
        });

        //set car model
        if (selectedBrand.length > 0) {
            this.carModels = selectedBrand[0].carModels;
            return selectedBrand[0];
        }

        return selectedBrand;
    }

    setCarModelYear(id: number) {
        let selectedCarModelYear = this.carModelYears.filter(year => {
            return year.id == id;
        });

        if (selectedCarModelYear.length > 0) {
            this.carForm.patchValue({ 'carModelYearId': selectedCarModelYear[0] });
            this.carForm.get('carModelYearId').disable();
        }
    }

    setCarModelType(id: number) {
        let selectedCarModelType = this.carModelTypes.filter(type => {
            return type.id == id;
        });

        if (selectedCarModelType.length > 0) {
            this.carForm.patchValue({ 'carModelTypeId': selectedCarModelType[0] });
            this.carForm.get('carModelTypeId').disable();
        }

    }

    resetCarForm() {
        this.submitted = false;
        this.carForm.removeControl('id');

        this.carForm.patchValue({
            chassisNumber: this.type == 'new car' ? "" : this.carForm.get('chassisNumber').value,
            brandId: '',
            carModelId: '',
            carModelYearId: '',
            carModelTypeId: '',
            plateNumber: '',
            gearType: '',
        });

        this.carForm.get('brandId').enable();
        this.carForm.get('carModelId').enable();
        this.carForm.get('carModelYearId').enable();
        this.carForm.get('carModelTypeId').enable();
        this.carForm.get('chassisNumber').enable();
        this.carForm.get('plateNumber').enable();
        this.carForm.get('gearType').enable();
    }
}
