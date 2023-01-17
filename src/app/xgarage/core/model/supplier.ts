import { GenericEntity } from "../../common/generic/genericentity";

export interface Supplier extends GenericEntity{
    name?: string;
    cr?: string;
    phoneNumber?: string;
    partTypes?: {id: string}[];
    serviceTypes?:  {id: string}[];
    band?: {id: string}[];
    user?: number
}
