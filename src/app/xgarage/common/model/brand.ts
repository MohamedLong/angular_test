import { GenericEntity } from "../generic/genericentity";
import { CarModel } from "./carmodel";
import { Document } from "./document";

export interface Brand extends GenericEntity{
    brandName?: string;
    document?: Document;
    carModels?: CarModel[];
}