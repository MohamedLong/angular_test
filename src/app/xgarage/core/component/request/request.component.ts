import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Brand } from 'src/app/xgarage/common/model/brand';
import { CarModel } from 'src/app/xgarage/common/model/carmodel';
import { CarModelType } from 'src/app/xgarage/common/model/carmodeltype';
import { CarModelYear } from 'src/app/xgarage/common/model/carmodelyear';
import { BrandService } from 'src/app/xgarage/common/service/brand.service';
import { CarModelTypeService } from 'src/app/xgarage/common/service/carmodeltypes.service';
import { CarModelYearService } from 'src/app/xgarage/common/service/carmodelyear.service';
import { Job } from '../../model/job';
import { Supplier } from '../../model/supplier';
import { JobService } from '../../service/job.service';
import { RequestService } from '../../service/request.service';
import { SupplierService } from '../../service/supplier.service';

@Component({
    selector: 'app-request',
    templateUrl: './request.component.html',
    styles: [``]
})
export class RequestComponent implements OnInit {

    constructor(private formBuilder: FormBuilder,
        private requestService: RequestService,
        private brandService: BrandService,
        private carModelYearService: CarModelYearService,
        private carSpecService: CarModelTypeService,
        private supplierService: SupplierService,
        private jobService: JobService) { }

    ngOnInit(): void { }

    uploadPartImages() {

    }
}
