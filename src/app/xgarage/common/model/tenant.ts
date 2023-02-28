import { TenantType } from './tenanttype';
import { GenericEntity } from '../generic/genericentity';

export interface Tenant extends GenericEntity{
    name?: string;
    cr?: string;
    email?: string;
    location?: string;
    tenantType?: TenantType;
    enabled?: boolean;
}