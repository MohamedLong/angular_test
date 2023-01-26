import { Role } from "./role";
import { Tenant } from "./tenant";

export interface User {
    id?: number;
    createdDate?: Date;
    email?: string;
    enabled?: boolean;
    firstName?: string;
    lastName?: string;
    phone?: string;
    provider?: string;
    providerId?: string;
    token?: string;
    userId?: string;
    password?: string;
    document?: Document;
    roles?: Role[];
    tenant?: Tenant;
}
