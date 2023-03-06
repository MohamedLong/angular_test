import { OrderType } from "./ordertype";

export interface BidOrderDto{
    bids?: number[];
    customer?: number;
    supplier?: number;
    orderDate?: Date;
    paymentMethod?: number;
    orderAmount?: number;
    deliveryFees?: number;
    vat?: number;
    discount?: number;
    totalAmount?: number;
    shippingMethod?: number;
    shippingAddress?: number;
    phone?: string;
    orderType?: OrderType;
}