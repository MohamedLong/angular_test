import { GenericEntity } from "../generic/genericentity";

export interface Currency extends GenericEntity{
  currencyName?: string;
  currencyCode?: string;
  cuRate?: number;
}
