export interface SupplierDto{
    id?: number;
    userId?: number;
    name?: string;
    cr?: string;
    contantName?: string;
    phone?: string;
    locations?: Location[];
    enabled?: boolean;
    submittedBids?: number;
    completedDeals?: number;
    rating?: number;
}