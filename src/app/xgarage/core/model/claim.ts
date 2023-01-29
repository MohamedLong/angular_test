import { MasterEntity } from "../../common/generic/masterentity";

export interface Claim extends MasterEntity{
    claimDate?: Date;
    tenant?: number;
}