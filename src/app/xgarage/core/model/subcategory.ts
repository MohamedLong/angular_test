import { GenericEntity } from "../../common/generic/genericentity";
import { Part } from "./parts";

export interface SubCategory extends GenericEntity{
    name?: string;
    parts?: Part[];
}