export interface SubMenu {
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
