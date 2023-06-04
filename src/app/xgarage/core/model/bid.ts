import { MasterEntity } from "../../common/generic/masterentity";
import { Currency } from "../../common/model/currency";
import { Document } from "../../common/model/document";
import { PartType } from "../../common/model/parttype";
import { Part } from "./part";

export interface Bid extends MasterEntity{
    part?: Part;
    partName?: string;
    voiceNote?: Document;
    images?: Document[];
    order?: number;
    bidDate?: string;
    price?: number;
    cu?: Currency;
    cuRate?: number;
    request?: any;
    supplier?: number;
    createUser?: number;
    deliverDays: number;
    warranty?: number;
    comments?: string;
    location?: string;
    reviseVoiceNote?: Document;
    reviseComments?: string;
    actionComments?: string;
    partType?: PartType | number;
    discount?: number;
    discountType?: string;
    vat?: number;
    originalPrice?: number;
    qty?: number;
    servicePrice?: number;
}
