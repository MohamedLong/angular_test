import { GenericEntity } from "../../common/generic/genericentity";

export interface Claim extends GenericEntity{
    claimDate?: Date;
    tenant?: number;
}