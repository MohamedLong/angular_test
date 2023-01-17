import { GenericEntity } from "../../common/generic/genericentity";
import { Claim } from "./claim";
import { JobType } from "./jobtype";

export interface Job extends GenericEntity{
    jobType?: JobType;
    claim?: Claim;

}