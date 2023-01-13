import { Role } from '../../common/model/role';
import { SubMenu } from './submenu';
import { UserMainMenu } from './usermainmenu';
export interface UserSubMenu {
    id?: number;
    role?: Role;
    userMainMenu?: UserMainMenu;
    subMenu?: SubMenu;
    newAuth?: boolean;
    editAuth?: boolean;
    deleteAuth?: boolean;
    printAuth?: boolean;
    confirmAuth?: boolean;
    cancelConfirmAuth?: boolean;
}
