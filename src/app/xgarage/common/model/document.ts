import { GenericEntity } from "../generic/genericentity";

export interface Document extends GenericEntity{
    name?: string;
    extention?: string;
}