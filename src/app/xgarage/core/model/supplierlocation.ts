import { MasterEntity } from "../../common/generic/masterentity";

export interface SupplierLocation extends MasterEntity{
    location?: string;
    branchName?: string;
    latitude?: number;
    longitude?: number;
}