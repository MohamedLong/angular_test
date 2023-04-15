import { Role } from '../../common/model/role';
import { MainMenu } from './mainmenu';
import { SubMenu } from './submenu';
import { UserMainMenu } from './usermainmenu';
export interface UserSubMenu {
    id?: number;
    role?: number;
    userMainMenu?: UserMainMenu;
    subMenu?: SubMenu;
    mainMenu?: MainMenu;
    newAuth?: boolean;
    editAuth?: boolean;
    deleteAuth?: boolean;
    printAuth?: boolean;
    approveAuth?: boolean;
    cancelAuth?: boolean;
    acceptAuth?: boolean;
    completeAuth?: boolean;
    viewAuth?: boolean;
}
