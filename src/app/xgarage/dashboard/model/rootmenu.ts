import { MainMenu } from "./mainmenu";

export interface RootMenu {
    id?: number;
    moduleName?: string;
    icon?: string;
    pageNumber?: number;
    mainMenus: Array<MainMenu>;
}