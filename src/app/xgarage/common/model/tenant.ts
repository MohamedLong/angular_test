import { TenantType } from './tenanttype';
import { GenericEntity } from "../generic/genericentity";

export interface Tenant extends GenericEntity{
    name?: string;
    cr?: string;
    location?: string;
    tenantType?: TenantType;
    enabled?: boolean;
}