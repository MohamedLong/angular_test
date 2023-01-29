import { MasterEntity } from "../../common/generic/masterentity";
import { Car } from "./car";
import { InsuranceType } from "./insurancetyps";

export interface Job extends MasterEntity{
    jobNO?: string;
    claim?: number;
    insuranceType?: InsuranceType,
    car?: Car
}
