import { PartType } from "../../common/model/parttype";
import { Part } from "../model/part";

export interface BidDto{
    bidId?: number;
    part?: Part;
    partName?: string;
    partType?: PartType;
    requestId?: number;
    userId?: number;
    userFirstName?: string;
    userCreatedDate?: Date;
    bidDate?: string;
    statusId?: number;
    price?: number;
    originalPrice?: number;
    vat?: number;
    qty?: number;
    discount?: number;
    servicePrice?: number;
    cuId?: number;
    cuRate?: number;
    supplierId?: number;
    supplierName?: string;
    supplierUserId?: number;
    deliverDays?: number;
    requestTitle?: string;
    submittedBids?: number;
    rejectedBids?: number;
    comments?: string;
    location?: string;
    warranty?: number;
    reviseComments?: string;
    actionComments?: string;
    voiceNote?: string;
    reviseVoiceNote?: string;
    orderId?: number;
    bidImages?: string;
    added?: boolean;
}
