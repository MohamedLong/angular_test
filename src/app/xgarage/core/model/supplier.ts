import { GenericEntity } from "../../common/generic/genericentity";
import { Brand } from "../../common/model/brand";
import { PartType } from "../../common/model/parttype";
import { ServiceType } from "../../common/model/servicetype";

export interface Supplier extends GenericEntity{
    name?: string;
    cr?: string;
    phoneNumber?: string;
    partTypes?: PartType[];
    serviceTypes?:  ServiceType[];
    brand?: Brand[];
    user?: number
}
