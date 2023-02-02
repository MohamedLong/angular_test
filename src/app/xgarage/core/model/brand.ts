import { MasterEntity } from "../../common/generic/masterentity";
import { CarModel } from "../../common/model/carmodel";

export interface Brand extends MasterEntity{
    brandName?: string;
    document?: Document;
    carModels?: Array<CarModel>;
}