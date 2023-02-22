import { MasterEntity } from "../../common/generic/masterentity";
import { Brand } from "../../common/model/brand";
import { PartType } from "../../common/model/parttype";
import { ServiceType } from "../../common/model/servicetype";

export interface Supplier extends MasterEntity{
    name?: string;
    cr?: string;
    phoneNumber?: string;
    partTypes?: PartType[];
    serviceTypes?:  ServiceType[];
    brand?: Brand[];
    user?: number;
    tenant?: number;

    registratedDate?: Date;
    submittedBids?: number;
    speciality?: string;
    enabled?: boolean;
}
