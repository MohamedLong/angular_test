import { MasterEntity } from "../../common/generic/masterentity";
import { Document } from "../../common/model/document";
import { PartType } from "../../common/model/parttype";
import { Privacy } from "../../common/model/privacy";
import { Car } from "./car";
import { Mcq } from "./mcq";
import { Part } from "./part";
import { Supplier } from "./supplier";

export interface Request extends MasterEntity{
    car?: Car;
    description?: string;
    privacy?: Privacy;
    part?: Part;
    documents?: Document[];
    submissionDate?: Date;
    suppliers?: Supplier[];
    notInterestedSuppliers?: Supplier[];
    questions?: Mcq[];
    user?: number;
    job?: number;
    requestTitle?: string; 
    partTypes?: PartType[];
    locationName?: string;
    voiceNote?: Document;
    tenant?: number;
    qty?: number;
}