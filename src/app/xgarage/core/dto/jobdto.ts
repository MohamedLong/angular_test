export interface JobDto{
    id?: number;
    jobNo?: string;
    claimId?: number;
    claimNo?: string;
    insuranceType?: string;
    createdAt?: Date;
    createdUser?: number;
    carChassisNumber?: string;
    carPlateNumber?: string;
    carGearType?: string;
    jobStatus?: string;
    statusDate?: Date;
}