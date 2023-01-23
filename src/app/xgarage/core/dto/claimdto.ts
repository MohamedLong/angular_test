export interface ClaimDto {
    id?: number;
    tenantId?: number;
    tenantName?: string;
    createdUser?: string;
    statusDate?: Date;
    claimNo?: number;
    claimDate?: Date;
    status?: number;
    cancellable?: boolean;
}

