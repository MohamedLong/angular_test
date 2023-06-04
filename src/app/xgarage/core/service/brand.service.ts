import { MessageResponse } from '../../common/dto/messageresponse';
// import { Brand } from '../model/brand';

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { config } from "src/app/config";
import { GenericService } from '../../common/generic/genericservice';
import { BrandDto } from '../dto/branddto';
import { Brand } from '../../common/model/brand';


@Injectable({
    providedIn: 'root'
})
export class BrandService extends GenericService<Brand>{

    constructor(http: HttpClient) {
        super(http, config.coreApiUrl + '/brand');
    }


    public getByTenant(tenantId: number) {
        return this.http.get<BrandDto[]>(config.coreApiUrl + '/brand/tenant/' + tenantId);
    }

}
