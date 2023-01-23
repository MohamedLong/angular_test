import { GenericEntity } from "../../common/generic/genericentity";
import { GearType } from "./geartype";

export interface Car extends GenericEntity{
    brandId?: number;
    carModelId?: number;
    carModelYearId?: number;
    carModelTypeId?: number;
    chassisNumber?: string;
    plateNumber?: string;
    gearType?: GearType;
    document?: Document;
}