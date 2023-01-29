import { Status } from "../model/status";

export interface MasterEntity{
    id?: number;
    createdAt?: Date;
    createdBy?: number;
    updatedAt?: Date;
    updatedBy?: number;
    status?: Status;
}