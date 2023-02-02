import { GenericEntity } from "../../common/generic/genericentity";
import { Part } from "./part";

export interface SubCategory extends GenericEntity{
    name?: string;
    parts?: Part[];
}