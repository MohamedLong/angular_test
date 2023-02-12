export interface RequestDto{
    id?: number;
    status?: number;
    submissionDate?: Date;
    userId?: number;
    privacy?: string;
    firstName?: string;
    requestTitle?: string;
    submittedBids?: number;
    rejectedBids?: number;
    jobId?: number;
    claimId?: number;
    jobNo?: string;
    claimNo?: string;
    qtty?: number;
}