import { MainMenu } from './mainmenu';
import { UserRootMenu } from './userrootmenu';
export interface UserMainMenu {
    id?: number;
    role?: number;
    mainMenu?: MainMenu;
    userRootMenu?: UserRootMenu;
}
