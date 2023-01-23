import { GenericEntity } from "../../common/generic/genericentity";
import { Claim } from "./claim";
import { InsuranceType } from "./insurancetype";

export interface Job extends GenericEntity{
    claim?: Claim;
    insuranceType: InsuranceType;
}
