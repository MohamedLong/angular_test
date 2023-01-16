import { GenericEntity } from "../generic/genericentity";
import { CarModel } from "./carmodel";

export interface Brand extends GenericEntity{
    brandName?: string;
    document?: Document;
    carModels?: CarModel[];
}