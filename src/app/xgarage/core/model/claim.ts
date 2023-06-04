import { MasterEntity } from "../../common/generic/masterentity";

export interface Claim extends MasterEntity{
    claimDate?: Date;
    tenant?: number;
    insuranceType?: string;
    claimNo?: string;
    customerName?: string;
    contactNo?: string;
    excessRo?: string;
    excDeliveryDate?: string;
    breakDown?: string;
    km?: number;
    documents?: any[];
    claimTicks?: any[];
}
