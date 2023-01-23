import { GenericEntity } from "../../common/generic/genericentity";
import { Car } from "./car";
import { InsuranceType } from "./insurancetyps";

export interface Job extends GenericEntity{
    jobNO?: string;
    claim?: number;
    insuranceType?: InsuranceType,
    car?: Car,
    status?: number;
}
