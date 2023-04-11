import { RootMenu } from './rootmenu';
export interface MainMenu{
    id?: number;
    pageName?: string;
    uiComponent?: string;
    routerLink?: string;
    icon?: string;
    pageOrder?: number;
    rootMenu?: RootMenu;
}
