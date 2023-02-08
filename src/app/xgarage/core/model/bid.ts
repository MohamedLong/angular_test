import { MasterEntity } from "../../common/generic/masterentity";
import { Currency } from "../../common/model/currency";
import { Document } from "../../common/model/document";
import { PartType } from "../../common/model/parttype";
import { Supplier } from "./supplier";

export interface Bid extends MasterEntity{
    partName?: string;
    voiceNote?: Document;
    images?: Document[];
    order?: number;
    bidDate?: Date;
    price?: number;
    cu?: Currency;
    cuRate?: number;
    request?: Request;
    supplier?: number;
    deliverDays: number;
    warranty?: number;
    comments?: string;
    location?: string;
    reviseVoiceNote?: Document;
    reviseComments?: string;
    actionComments?: string;
    partType?: PartType;
    discount?: number;
    vat?: number;
    originalPrice?: number;
}
