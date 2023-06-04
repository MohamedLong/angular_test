import { TenantService } from 'src/app/xgarage/common/service/tenant.service';
import { ServiceType } from './../../model/servicetype';
import { BrandService } from '../../../core/service/brand.service';
import { Supplier } from './../../../core/model/supplier';
import { SupplierService } from './../../../core/service/supplier.service';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Brand } from 'src/app/xgarage/common/model/brand';
import { PartType } from '../../model/parttype';
import { ServiceTypesService } from '../../service/servicetype.service';
import { PartTypesService } from '../../service/parttype.service';
import { MapsAPILoader } from '@agm/core';


@Component({
    selector: 'app-supplierprofile',
    templateUrl: './supplierprofile.component.html',
    styleUrls: ['../../../../demo/view/tabledemo.scss', './supplierprofile.component.scss'],
    styles: [`
  :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }

  .active {border-bottom: 2px solid #6366F1 !important;border-radius: 0;}

  @media screen and (max-width: 960px) {
      :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:last-child {
          text-align: center;
      }

      :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:nth-child(6) {
          display: flex;
      }
  }

`],
    providers: [MessageService, ConfirmationService, DialogService]

})
export class SupplierprofileComponent implements OnInit {
    constructor(private fb: FormBuilder, public route: ActivatedRoute, public router: Router,
        public messageService: MessageService,
        public confirmService: ConfirmationService, private supplierService: SupplierService,
        private brandService: BrandService, private serviceTypesService: ServiceTypesService,
        private partTypesService: PartTypesService, private tenantService: TenantService,
        public breadcrumbService: AppBreadcrumbService,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone) { }

    lat = 23.588072;
    lng = 58.382691;
    zoom = 6.5;

    supplierForm: FormGroup;
    supplier: Supplier = {};
    brands: Brand[] = [];
    selectedBrands: Brand[] = [];
    serviceTypes: ServiceType[] = [];
    selectedServiceTypes: ServiceType[] = [];
    partTypes: PartType[] = [];
    selectedPartTypes: PartType[] = [];
    id: number = 52;
    @ViewChild('search')
    public searchElementRef: ElementRef;
    geoCoder;
    address: string;


    ngOnInit(): void {

        this.mapsAPILoader.load().then(() => {
            this.setCurrentLocation();
            this.geoCoder = new google.maps.Geocoder;

            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    //set latitude, longitude and zoom
                    this.lat = place.geometry.location.lat();
                    this.lng = place.geometry.location.lng();
                    this.zoom = 15;
                });
            });
        });

        const supplierId = parseInt(localStorage.getItem('supplierId'), 10);
        if (supplierId) {
            this.id = supplierId
        } else {
            this.id = this.tenantService.selectedTenantId;
            localStorage.setItem('supplierId', this.id.toString());
        }

        this.supplierForm = this.fb.group({
            name: ['', Validators.required],
            cr: ['', Validators.required],
            phoneNumber: ['', [Validators.required, Validators.pattern(/^[279]\d{7}$/)]],
            email: ['', [Validators.required, Validators.email]],
            serviceTypes: ['', Validators.required],
            partTypes: ['', Validators.required],
            brand: [[], Validators.required],
            submittedBids: [{ value: '', disabled: true }],
            speciality: [''],
            enabled: [''],
        });
        this.getSupplierByIdNumber(this.id);
    }


    getAllBrands() {
        this.brandService.getAll().subscribe(res => {
            this.brands = res;
            this.selectedBrands = this.brands.filter(brand =>
                this.supplier.brand.some(selectedBrand => selectedBrand.id === brand.id));
        })
    }

    getAllServiceTypes() {
        this.serviceTypesService.getAll().subscribe(res => {
            this.serviceTypes = res;
            this.selectedServiceTypes = this.serviceTypes.filter(st =>
                this.supplier.serviceTypes.some(selectedServiceTypes => selectedServiceTypes.id === st.id));
        })
    }

    getAllPartTypes() {
        this.partTypesService.getAll().subscribe(res => {
            this.partTypes = res;
            this.selectedPartTypes = this.partTypes.filter(pt =>
                this.supplier.partTypes.some(selectedPartTypes => selectedPartTypes.id === pt.id));
        })
    }

    getSupplierByIdNumber(supplierId: number) {
        this.supplierService.getSupplierById(supplierId).subscribe((res: Supplier) => {
            this.supplier = res;
            this.getAllBrands();
            this.getAllServiceTypes();
            this.getAllPartTypes();
            this.supplierForm.setValue({
                name: res.name,
                cr: res.cr,
                phoneNumber: res.phoneNumber,
                email: res.email,
                serviceTypes: res.serviceTypes,
                partTypes: res.partTypes,
                brand: res.brand,
                submittedBids: res.submittedBids,
                speciality: res.speciality,
                enabled: res.enabled,
            });
        })
    }

    submitForm() {
        if (this.supplierForm.invalid) {
            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Please fill the form correctly' });
            Object.keys(this.supplierForm.controls).forEach(key => {
                this.supplierForm.controls[key].markAsTouched();
            });

            return;
        }

        this.supplierForm.addControl('id', new FormControl(this.supplier.id));
        this.supplierService.update(this.supplierForm.value).subscribe(res => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Profile Updated' });
        }, err => {
            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: err.error.message, life: 3000 });
        })
    }


    setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.zoom = 15;
                this.getAddress(this.lat, this.lng);
                // console.log(this.lat, this.lng)
            });
        }
    }

    markerDragEnd($event: any) {
        //console.log($event);
        this.lat = $event.latLng.lat();
        this.lng = $event.latLng.lng();
        this.getAddress(this.lat, this.lng);
      }

      getAddress(latitude, longitude) {
        this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
        //   console.log(results);
        //   console.log(status);
          if (status === 'OK') {
            if (results[0]) {
              this.zoom = 15;
              this.address = results[0].formatted_address;
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }

        });
      }

}
