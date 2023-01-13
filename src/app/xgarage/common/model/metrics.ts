import { GenericEntity } from "../generic/genericentity";

export interface Metrics extends GenericEntity{
    metricCode?: string;
    metricName?: string;
}