import { SubMenu } from './submenu';
export interface MainMenu{
    id: number;
    pageName: string;
    uiComponent: string;
    routerLink: string;
    icon: string;
    subMenus: Array<SubMenu>;
    mainMenu: any;
    rootMenu: {id: number, icon: string, moduleName: string, pageOrder: number}
}
