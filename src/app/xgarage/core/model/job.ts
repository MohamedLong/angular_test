import { MasterEntity } from "../../common/generic/masterentity";
import { Privacy } from "../../common/model/privacy";
import { Car } from "./car";
import { InsuranceType } from "./insurancetype";
import { Supplier } from "./supplier";

export interface Job extends MasterEntity{
    jobNO?: string;
    claim?: number;
    claimNo?: string;
    insuranceType?: InsuranceType;
    car?: Car;
    privacy?: Privacy;
    jobTitle?: string;
    suppliers?: Supplier[];
    tenant?: number;
}
