import { GenericEntity } from "../../common/generic/genericentity";

export interface SubMenu extends GenericEntity {
    pageId: number;
    pageName: string;
    uiComponent: string;
    routerLink: string;
    icon: string;
    subMenus: Array<SubMenu>;
    newAuth: boolean;
    editAuth: boolean;
    deleteAuth: boolean;
    printAuth: boolean;
    confirmAuth: boolean;
    cancelConfirmAuth: boolean;
}
