import { Privacy } from "../../common/model/privacy";
import { Car } from "../model/car";
import { InsuranceType } from "../model/insurancetyps";
import { Supplier } from "../model/supplier";

export interface SharedJob{
    id?: number;    
    car?: Car;
    privacy?: Privacy;
    suppliers?: Supplier[];
}