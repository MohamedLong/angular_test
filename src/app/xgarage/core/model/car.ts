import { GenericEntity } from "../../common/generic/genericentity";

export interface Car extends GenericEntity{
    brandId?: number;
    carModelId?: number;
    carModelYearId?: number;
    carModelTypeId?: number;
    chassisNumber?: string;
}