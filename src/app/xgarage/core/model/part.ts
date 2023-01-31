import { GenericEntity } from "../../common/generic/genericentity";

export interface Part extends GenericEntity{
    id?: number;
    name?: string;
    status?: number;
    subCategoryId?: number;
    categoryId?: number;
}
