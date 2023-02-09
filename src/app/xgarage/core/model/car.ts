import { GenericEntity } from "../../common/generic/genericentity";
import { Brand } from "../../common/model/brand";
import { CarModel } from "../../common/model/carmodel";
import { CarModelType } from "../../common/model/carmodeltype";
import { CarModelYear } from "../../common/model/carmodelyear";
import { GearType } from "./geartype";

export interface Car extends GenericEntity{
    brandId?: Brand;
    carModelId?: CarModel;
    carModelYearId?: CarModelYear;
    carModelTypeId?: CarModelType;
    chassisNumber?: string;
    plateNumber?: string;
    gearType?: GearType;
    document?: {extension: string, id: number, name:string};
}
