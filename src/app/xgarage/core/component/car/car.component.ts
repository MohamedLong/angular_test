import { CarModel } from './../../../common/model/carmodel';
import { AuthService } from './../../../../auth/services/auth.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { GenericComponent } from 'src/app/xgarage/common/generic/genericcomponent';
import { Car } from '../../model/car';
import { CarService } from '../../service/car.service';
import { CarModelYear } from 'src/app/xgarage/common/model/carmodelyear';
import { CarModelType } from 'src/app/xgarage/common/model/carmodeltype';
import { GearType } from '../../model/geartype';
import { CarModelService } from 'src/app/xgarage/common/service/carmodel.service';
import { BrandService } from '../../service/brand.service';
import { CarModelYearService } from 'src/app/xgarage/common/service/carmodelyear.service';
import { CarModelTypeService } from 'src/app/xgarage/common/service/carmodeltypes.service';
import { Brand } from 'src/app/xgarage/common/model/brand';

@Component({
    selector: 'app-car',
    templateUrl: './car.component.html',
    styles: [''],

    providers: [MessageService, ConfirmationService, DatePipe]

})
export class CarComponent extends GenericComponent implements OnInit {


    constructor(public route: ActivatedRoute, public messageService: MessageService, public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService,
      private carService: CarService, private brandService: BrandService, private carModelService: CarModelService,
      private carModelYearService: CarModelYearService,  private carModelTypeService: CarModelTypeService) {
      super(route, datePipe, breadcrumbService);
  }

  selectedModel: CarModel;
  carModels: CarModel[];
  selectedBrand: Brand;
  brands: Brand[];
  selectedYear: CarModelYear;
  carModelYears: CarModelYear[];
  selectedType: CarModelType;
  carModelTypes: CarModelType[];
  selectedGear: string;
  gearTypes= Object.keys(GearType);
  cars: Car[];
  valid: boolean = false;
  type: string;
  displayNewCarDialog = false;


    ngOnInit(): void {
      this.getAll();
      super.callInsideOnInit();
      this.getAllBrands();
      this.getAllModels();
      this.getAllYears();
      this.getAllModelTypes();

      this.breadcrumbService.setItems([{'label': 'Cars', routerLink: ['cars']}]);
    }

   getAll() {
    this.carService.getAll().subscribe({
      next: (masters) => {
        this.masterDtos = masters;
        this.cols = [
          { field: 'id', header: 'id' },
          { field: 'brandName', header: 'Brand Name' },
          { field: 'carModel', header: 'Car Model' },
          { field: 'carModelType', header: 'Model Type' },
          { field: 'carModelYear', header: 'Model Year' },
          { field: 'plateNumber', header: 'Plate #' },
          { field: 'chassisNumber', header: 'Chassis Number' },
          { field: 'gearType', header: 'Gear Type' }
      ];
        this.loading = false;
      },
      error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
    });
  }

  getAllBrands() {
    this.brandService.getAll().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (e) => alert(e)
    })
  }
  getAllModels() {
    this.carModelService.getAll().subscribe({
      next: (data) => {
        this.carModels = data;
      },
      error: (e) => alert(e)
    })
  }
  getAllYears() {
    this.carModelYearService.getAll().subscribe({
      next: (data) => {
        this.carModelYears = data;
      },
      error: (e) => alert(e)
    })
  }
  getAllModelTypes() {
    this.carModelTypeService.getAll().subscribe({
      next: (data) => {
        this.carModelTypes = data;
      },
      error: (e) => alert(e)
    })
  }

  edit(carDto: any){
    this.carService.getById(carDto.id).subscribe(
      {
        next: (data) => {
            this.master = data;
            this.selectedBrand = this.brands.find(val => val.id == this.master.brandId);
            this.onBrandChange();
            this.selectedModel = this.carModels.find(val => val.id == this.master.carModelId);
            this.selectedYear = this.carModelYears.find(val => val.id == this.master.carModelYearId);
            this.selectedType = this.carModelTypes.find(val => val.id == this.master.carModelTypeId);
            this.selectedGear = this.gearTypes.find(val => val == this.master.gearType);
            this.editMaster(this.master);
        },
        error: (e) => alert(e)
      }
    )
   }

   onBrandChange() {
    if (this.selectedBrand && this.selectedBrand.carModels) {
      this.carModels = this.selectedBrand.carModels;
    } else {
      this.carModels = [];
    }
    this.selectedModel = null;
  }

   save() {
    this.submitted = true;
    if (this.master.chassisNumber && this.master.plateNumber) {
      this.master.brandId = this.selectedBrand.id;
      this.master.carModelId = this.selectedModel.id;
      this.master.carModelTypeId = this.selectedType.id;
      this.master.carModelYearId = this.selectedYear.id;
      this.master.gearType = this.selectedGear;
      if (this.master.id) {
            this.carService.update(this.master).subscribe({
                next: (data) => {
                        this.master = data;
                        this.getAll();
                        this.messageService.add({ severity: 'success', summary: 'Successful',
                        detail: 'Car Updated'});
                },
                error: (e) => {
                  this.messageService.add({ severity: 'error', summary: 'Error',
                  detail: e.error.message })
                }
            });
      }
      this.masterDialog = false;
      this.master = {};
    }
}

carDialog() {
  this.displayNewCarDialog = true;
}

closeCarDialog() {
  this.displayNewCarDialog = false;
  this.getAll();
}

}


