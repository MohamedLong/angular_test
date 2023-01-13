import { GenericEntity } from "../generic/genericentity";

export interface Tenant extends GenericEntity{
    name?: string;
    cr?: string;
    location?: string;
}