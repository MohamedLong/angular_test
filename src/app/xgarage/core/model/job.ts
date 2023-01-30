import { MasterEntity } from "../../common/generic/masterentity";
import { Car } from "./car";
import { InsuranceType } from "./insurancetype";

export interface Job extends MasterEntity{
    jobNO?: string;
    claim?: number;
    insuranceType: InsuranceType;
    car?: Car
}
