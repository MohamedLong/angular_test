export interface UserDto{
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    token?: string;
    enabled?: boolean;
    createDate?: Date;
    roles?: string[];
    tenant?: string;
    tenantId?: number;
    submittedRequests?: number;
    completedDeals?: number;
    userImage?: string;
    rating?: number;
}