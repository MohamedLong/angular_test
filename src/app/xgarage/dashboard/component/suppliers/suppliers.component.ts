import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { GenericComponent } from 'src/app/xgarage/common/generic/genericcomponent';
import { BrandService } from 'src/app/xgarage/common/service/brandservice';
import { PartTypesService } from 'src/app/xgarage/common/service/parttypeservice';
import { ServiceTypesService } from 'src/app/xgarage/common/service/servicetypeservice';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
  providers: [MessageService, DatePipe]
})
export class SuppliersComponent extends GenericComponent implements OnInit {

  constructor(public route: ActivatedRoute, public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService,
    private partsService: PartTypesService,
    private serviceTypesService: ServiceTypesService,
    private brandService: BrandService) {
    super(route, datePipe, breadcrumbService);
  }

  partTypesList: {id: string, partType: string}[];
  serviceTypesList: {id: string, name: string}[];
  brandsList: any[];

  ngOnInit(): void {
    this.getPartTypes();
    this.getServiceTypes();
    this.getBrands();
  }

  getPartTypes() {
    this.partsService.getAll().subscribe(res => {
        //console.log(res)
        this.partTypesList = res;
    }, err => console.log(err))
  };

  getServiceTypes() {
    this.serviceTypesService.getAll().subscribe(res => {
        //console.log(res)
        this.serviceTypesList = res;
    }, err => console.log(err))
  };

  getBrands() {
    this.brandService.getAll().subscribe(res => {
        //console.log(res)
        this.brandsList = res;
    }, err => console.log(err))
  };

}
