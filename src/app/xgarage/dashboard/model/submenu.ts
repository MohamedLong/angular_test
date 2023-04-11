import { MainMenu } from './mainmenu';
export interface SubMenu{
    id?: number;
    pageName?: string;
    uiComponent?: string;
    routerLink?: string;
    icon?: string;
    pageOrder?: number;
    mainMenu?: MainMenu;
}
