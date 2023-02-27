import { SupplierLocation } from './supplierlocation';
import { MasterEntity } from "../../common/generic/masterentity";
import { Brand } from "../../common/model/brand";
import { PartType } from "../../common/model/parttype";
import { ServiceType } from "../../common/model/servicetype";

export interface Supplier {
    id?: number;
    createdAt?: Date;
    createdBy?: number;
    updatedAt?: Date;
    updatedBy?: number;
    name?: string;
    cr?: string;
    contactName?: string;
    phoneNumber?: string;
    email?: string;
    locations?: SupplierLocation[];
    speciality?: string;
    manufacturer?: string;
    vehicleType?: string;
    registeredYear?: number;
    registeredDate?: string;
    enabled?: boolean;
    user?: number;
    tenant?: number;
    bestSeller?: number;
    region?: string;
    status?: string;
    bankName?: string;
    branch?: string;
    accountNo?: string;
    holderName?: string;
    image?: string;
    salesCommissionPercentage?: number;
    submittedBids?: number;
    serviceTypes?:  ServiceType[];
    partTypes?: PartType[];
    brand?: Brand[];
}

