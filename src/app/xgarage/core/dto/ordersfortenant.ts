export interface OrdersForTenant{
    id?: number;
    createdAt?: Date;
    customerName?: string;
    customerAddress?: string;
    supplierName?: string;
    supplierAddress?: string;
    jobTitle?: string;
    jobNumber?: string;
    currency?: string;
    country?: string;
    orderAmount?: number;
    deliveryFees?: number;
    totalAmount?: number;
    orderStatus?: string;
}