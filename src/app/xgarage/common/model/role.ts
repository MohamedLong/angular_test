import { Permission } from "./permission";

export interface Role {
    id?: number;
    createdAt?: Date;
    roleDescription?: string;
    roleName?: string;
    permissions?: Permission[];
}
