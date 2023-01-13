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
    documentId?: number;
    roleId?:number;
}
